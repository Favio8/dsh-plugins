import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { open, readdir, realpath, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { extname, join, resolve, sep } from "node:path";
//#region src/index.ts
const name = "workspace-files";
const inject = ["webServer"];
const DEFAULTS = {
	maxPreviewBytes: 524288,
	imageMaxBytes: 2097152,
	allowOutsideCwd: false
};
/** 菜单/浏览中始终忽略的目录名（大小写不敏感比较）。 */
const IGNORED_NAMES = [
	"node_modules",
	".git",
	"dist",
	"build",
	"out",
	".next"
];
/** 明确按二进制处理的扩展名（不含图片——图片单独走 dataURL）。 */
const BINARY_EXTS = /* @__PURE__ */ new Set([
	".pdf",
	".zip",
	".gz",
	".tgz",
	".tar",
	".7z",
	".rar",
	".xz",
	".bz2",
	".exe",
	".dll",
	".so",
	".dylib",
	".bin",
	".dat",
	".db",
	".sqlite",
	".sqlite3",
	".woff",
	".woff2",
	".ttf",
	".otf",
	".wasm",
	".class",
	".pyc",
	".o",
	".a",
	".ico",
	".mp3",
	".mp4",
	".mov",
	".avi",
	".mkv",
	".webm"
]);
const IMAGE_EXTS = /* @__PURE__ */ new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".bmp",
	".svg"
]);
const LIST_CAP = 200;
/** HTTP 桥 JSON body 大小上限（本地接口，防止异常请求占用内存）。 */
const MAX_JSON_BODY_BYTES = 65536;
const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), ".dsh");
const CONFIG_DIR = join(DSH_HOME, "plugins");
const CONFIG_PATH = join(CONFIG_DIR, "workspace-files.json");
function loadConfig() {
	try {
		if (!existsSync(CONFIG_PATH)) return { ...DEFAULTS };
		const raw = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
		return {
			maxPreviewBytes: pickInt(raw.maxPreviewBytes, DEFAULTS.maxPreviewBytes, 65536, 8388608),
			imageMaxBytes: pickInt(raw.imageMaxBytes, DEFAULTS.imageMaxBytes, 65536, 16777216),
			allowOutsideCwd: typeof raw.allowOutsideCwd === "boolean" ? raw.allowOutsideCwd : DEFAULTS.allowOutsideCwd
		};
	} catch {
		return { ...DEFAULTS };
	}
}
function pickInt(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(max, Math.max(min, Math.floor(value)));
}
let config = loadConfig();
function saveConfig(next) {
	try {
		mkdirSync(CONFIG_DIR, { recursive: true });
		writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2), "utf8");
	} catch (error) {
		console.error("[workspace-files] 保存配置失败:", error);
	}
}
/**
* 校验目标路径位于边界内。
* 边界：默认 = root 本身；allowOutsideCwd=true 时 = root 本身 + 宿主主目录。
* 这样即使工作区不在主目录下（如 D:\code\project），开启“允许浏览工作区之外”
* 也不会把原本工作区内的合法访问误杀。
* realpath 复核：目标存在时解析符号链接，链接指向边界外一律拒绝。
*/
async function guardPath(root, target) {
	const absRoot = resolve(root);
	const abs = resolve(absRoot, target);
	const home = resolve(homedir());
	const withinRoot = (candidate) => candidate === absRoot || candidate.startsWith(absRoot + sep);
	const withinHome = (candidate) => config.allowOutsideCwd && (candidate === home || candidate.startsWith(home + sep));
	if (!withinRoot(abs) && !withinHome(abs)) return {
		ok: false,
		status: 403,
		error: "越权：路径超出允许范围"
	};
	try {
		const real = await realpath(abs);
		if (!withinRoot(real) && !withinHome(real)) return {
			ok: false,
			status: 403,
			error: "越权：符号链接指向允许范围之外"
		};
	} catch {}
	return {
		ok: true,
		abs
	};
}
function sendJson(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
function readJsonBody(req) {
	return new Promise((resolveBody) => {
		let data = "";
		let tooLarge = false;
		req.on("data", (chunk) => {
			if (tooLarge) return;
			data += chunk.toString("utf8");
			if (Buffer.byteLength(data, "utf8") > MAX_JSON_BODY_BYTES) {
				tooLarge = true;
				resolveBody(null);
				req.destroy();
			}
		});
		req.on("end", () => {
			if (tooLarge) return;
			try {
				resolveBody(JSON.parse(data));
			} catch {
				resolveBody(null);
			}
		});
		req.on("error", () => resolveBody(null));
	});
}
function parseQuery(req) {
	return new URL(req.url ?? "/", "http://localhost").searchParams;
}
async function handleList(req, res) {
	if (req.method !== "GET") {
		sendJson(res, 405, {
			ok: false,
			error: "method not allowed"
		});
		return;
	}
	const params = parseQuery(req);
	const root = params.get("root") ?? "";
	const rel = params.get("path") ?? ".";
	const showHidden = params.get("hidden") === "1";
	if (root === "") {
		sendJson(res, 400, {
			ok: false,
			error: "缺少 root 参数"
		});
		return;
	}
	const guarded = await guardPath(root, rel);
	if (!guarded.ok) {
		sendJson(res, guarded.status, {
			ok: false,
			error: guarded.error
		});
		return;
	}
	try {
		const visible = (await readdir(guarded.abs, { withFileTypes: true })).filter((d) => {
			if (IGNORED_NAMES.includes(d.name.toLowerCase())) return false;
			if (!showHidden && d.name.startsWith(".")) return false;
			return true;
		});
		const withStat = await Promise.all(visible.map(async (d) => {
			const full = join(guarded.abs, d.name);
			try {
				const s = await stat(full);
				return {
					name: d.name,
					path: full,
					kind: d.isDirectory() ? "dir" : "file",
					size: s.size,
					mtime: s.mtimeMs
				};
			} catch {
				return {
					name: d.name,
					path: full,
					kind: d.isDirectory() ? "dir" : "file"
				};
			}
		}));
		withStat.sort((a, b) => {
			if (a.kind !== b.kind) return a.kind === "dir" ? -1 : 1;
			return a.name.localeCompare(b.name);
		});
		const truncated = withStat.length > LIST_CAP;
		sendJson(res, 200, {
			ok: true,
			path: guarded.abs,
			entries: withStat.slice(0, LIST_CAP),
			truncated
		});
	} catch {
		sendJson(res, 404, {
			ok: false,
			error: "目录不存在或不可读"
		});
	}
}
async function handleRead(req, res) {
	if (req.method !== "GET") {
		sendJson(res, 405, {
			ok: false,
			error: "method not allowed"
		});
		return;
	}
	const params = parseQuery(req);
	const root = params.get("root") ?? "";
	const rel = params.get("path") ?? "";
	if (root === "" || rel === "") {
		sendJson(res, 400, {
			ok: false,
			error: "缺少 root/path 参数"
		});
		return;
	}
	const guarded = await guardPath(root, rel);
	if (!guarded.ok) {
		sendJson(res, guarded.status, {
			ok: false,
			error: guarded.error
		});
		return;
	}
	let info;
	try {
		info = await stat(guarded.abs);
	} catch {
		sendJson(res, 404, {
			ok: false,
			error: "文件不存在"
		});
		return;
	}
	if (info.isDirectory()) {
		sendJson(res, 400, {
			ok: false,
			error: "目标是一个目录"
		});
		return;
	}
	const ext = extname(guarded.abs).toLowerCase();
	const size = info.size;
	if (IMAGE_EXTS.has(ext)) {
		if (size > config.imageMaxBytes) {
			sendJson(res, 200, {
				ok: true,
				path: guarded.abs,
				size,
				binary: true,
				error: "图片超过预览大小上限"
			});
			return;
		}
		try {
			const handle = await open(guarded.abs, "r");
			try {
				const buf = await handle.readFile();
				const mime = ext === ".svg" ? "image/svg+xml" : `image/${ext.slice(1)}`;
				sendJson(res, 200, {
					ok: true,
					path: guarded.abs,
					size,
					binary: false,
					imageDataUrl: `data:${mime};base64,${buf.toString("base64")}`
				});
			} finally {
				await handle.close();
			}
			return;
		} catch {
			sendJson(res, 500, {
				ok: false,
				error: "图片读取失败"
			});
			return;
		}
	}
	if (BINARY_EXTS.has(ext)) {
		sendJson(res, 200, {
			ok: true,
			path: guarded.abs,
			size,
			binary: true
		});
		return;
	}
	const offset = Math.max(0, Number.parseInt(params.get("offset") ?? "0", 10) || 0);
	const limitRaw = Number.parseInt(params.get("limit") ?? "", 10);
	const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, config.maxPreviewBytes) : config.maxPreviewBytes;
	if (offset >= size) {
		sendJson(res, 200, {
			ok: true,
			path: guarded.abs,
			size,
			content: "",
			bytesRead: 0,
			truncated: false,
			encoding: "utf8"
		});
		return;
	}
	try {
		const handle = await open(guarded.abs, "r");
		try {
			const buf = Buffer.alloc(limit);
			const { bytesRead } = await handle.read(buf, 0, limit, offset);
			const chunk = buf.subarray(0, bytesRead);
			if (chunk.subarray(0, 4096).includes(0)) {
				sendJson(res, 200, {
					ok: true,
					path: guarded.abs,
					size,
					binary: true
				});
				return;
			}
			sendJson(res, 200, {
				ok: true,
				path: guarded.abs,
				size,
				content: chunk.toString("utf8"),
				bytesRead,
				truncated: offset + bytesRead < size,
				encoding: "utf8"
			});
		} finally {
			await handle.close();
		}
	} catch {
		sendJson(res, 500, {
			ok: false,
			error: "文件读取失败"
		});
	}
}
function handleConfig(req, res) {
	if (req.method === "GET") {
		sendJson(res, 200, {
			ok: true,
			...config
		});
		return;
	}
	if (req.method === "POST") {
		readJsonBody(req).then((body) => {
			const patch = typeof body === "object" && body !== null ? body : {};
			const keys = Object.keys(patch);
			if (keys.length === 0) {
				sendJson(res, 400, {
					ok: false,
					error: "配置项不能为空"
				});
				return;
			}
			const known = {
				maxPreviewBytes: true,
				imageMaxBytes: true,
				allowOutsideCwd: true
			};
			for (const key of keys) if (!known[key]) {
				sendJson(res, 400, {
					ok: false,
					error: `未知配置项: ${key}`
				});
				return;
			}
			config = {
				maxPreviewBytes: keys.includes("maxPreviewBytes") ? pickInt(patch.maxPreviewBytes, config.maxPreviewBytes, 65536, 8388608) : config.maxPreviewBytes,
				imageMaxBytes: keys.includes("imageMaxBytes") ? pickInt(patch.imageMaxBytes, config.imageMaxBytes, 65536, 16777216) : config.imageMaxBytes,
				allowOutsideCwd: keys.includes("allowOutsideCwd") ? typeof patch.allowOutsideCwd === "boolean" ? patch.allowOutsideCwd : config.allowOutsideCwd : config.allowOutsideCwd
			};
			saveConfig(config);
			sendJson(res, 200, {
				ok: true,
				...config
			});
		});
		return;
	}
	sendJson(res, 405, {
		ok: false,
		error: "method not allowed"
	});
}
function apply(ctx) {
	const webServer = ctx.get("webServer");
	if (webServer === void 0) return;
	ctx.effect(() => webServer.register({
		kind: "exact",
		path: "/workspace-files/list",
		handler: handleList
	}));
	ctx.effect(() => webServer.register({
		kind: "exact",
		path: "/workspace-files/read",
		handler: handleRead
	}));
	ctx.effect(() => webServer.register({
		kind: "exact",
		path: "/workspace-files/config",
		handler: handleConfig
	}));
}
//#endregion
export { apply, inject, name };
