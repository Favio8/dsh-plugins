import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { lstat, open, readdir, realpath, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { extname, join, resolve, sep } from "node:path";
//#region src/index.ts
const name = "workspace-files";
const inject = ["webServer", "sessions"];
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
		const fallback = { ...DEFAULTS };
		try {
			saveConfig(fallback);
		} catch {}
		return fallback;
	}
}
function pickInt(value, fallback, min, max) {
	if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
	return Math.min(max, Math.max(min, Math.floor(value)));
}
let config = loadConfig();
function saveConfig(next) {
	const tempPath = `${CONFIG_PATH}.tmp`;
	try {
		mkdirSync(CONFIG_DIR, { recursive: true });
		writeFileSync(tempPath, JSON.stringify(next, null, 2), "utf8");
		renameSync(tempPath, CONFIG_PATH);
	} catch (error) {
		try {
			unlinkSync(tempPath);
		} catch {}
		console.error("[workspace-files] 保存配置失败:", error);
	}
}
let liveSessions;
/** Windows 文件系统大小写不敏感，路径比较前统一归一化。 */
function comparePath(path) {
	return process.platform === "win32" ? path.toLowerCase() : path;
}
/** candidate 是否位于 parent 内（或与 parent 相同）；盘符根也正确。 */
function isWithin(parent, candidate) {
	const p = comparePath(parent);
	const c = comparePath(candidate);
	if (c === p) return true;
	const prefix = p.endsWith(sep) ? p : p + sep;
	return c.startsWith(prefix);
}
/** 取真实路径；目标不存在时回退为词法绝对路径（调用方会按 404 处理）。 */
async function canonicalPath(path) {
	try {
		return await realpath(path);
	} catch {
		return resolve(path);
	}
}
/**
* root 不允许客户端任意指定：必须是当前 host sessions 中某个会话的 cwd。
* 这补上了旧实现“root 即边界”的漏洞——否则请求方传 root=D:\secret 即可读任意目录。
*/
async function isRegisteredRoot(root) {
	const canonicalRoot = comparePath(await canonicalPath(root));
	for (const session of liveSessions?.list() ?? []) {
		const cwd = session.header?.cwd;
		if (typeof cwd !== "string" || cwd === "") continue;
		if (comparePath(await canonicalPath(cwd)) === canonicalRoot) return true;
	}
	return false;
}
/**
* 校验目标路径位于边界内。
* 边界：root 必须是已注册会话 cwd；allowOutsideCwd=true 时额外允许宿主主目录。
* root 与目标都先 canonicalPath：支持 cwd 本身是符号链接/大小写差异，
* 且符号链接逃逸会因 realpath 落在边界外而被拒绝。
*/
async function guardPath(root, target) {
	if (!await isRegisteredRoot(root)) return {
		ok: false,
		status: 403,
		error: "root 不是当前已注册会话的工作目录"
	};
	const absRoot = await canonicalPath(root);
	const abs = resolve(absRoot, target);
	const home = await canonicalPath(resolve(homedir()));
	const withinRoot = (candidate) => isWithin(absRoot, candidate);
	const withinHome = (candidate) => config.allowOutsideCwd && isWithin(home, candidate);
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
		return {
			ok: true,
			abs: real
		};
	} catch {
		return {
			ok: true,
			abs
		};
	}
}
function sendJson(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
function readJsonBody(req) {
	return new Promise((resolveBody) => {
		let data = "";
		let settled = false;
		req.on("data", (chunk) => {
			if (settled) return;
			data += chunk.toString("utf8");
			if (Buffer.byteLength(data, "utf8") > MAX_JSON_BODY_BYTES) {
				settled = true;
				req.pause();
				resolveBody({
					ok: false,
					status: 413,
					error: "请求体过大"
				});
			}
		});
		req.on("end", () => {
			if (settled) return;
			settled = true;
			try {
				resolveBody({
					ok: true,
					value: JSON.parse(data)
				});
			} catch {
				resolveBody({
					ok: false,
					status: 400,
					error: "请求体不是合法 JSON"
				});
			}
		});
		req.on("error", () => {
			if (settled) return;
			settled = true;
			resolveBody({
				ok: false,
				status: 400,
				error: "请求体读取失败"
			});
		});
	});
}
function parseQuery(req) {
	return new URL(req.url ?? "/", "http://localhost").searchParams;
}
const IMAGE_MIME = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".bmp": "image/bmp",
	".svg": "image/svg+xml"
};
/**
* 多字节 UTF-8 字符可能跨 offset/limit 边界：若 chunk 末尾截断了字符，
* 把 bytesRead 回退到该字符起点，下一段从合法边界续读。
*/
function completeUtf8Prefix(chunk, hasMore) {
	if (!hasMore || chunk.length === 0) return chunk.length;
	let end = chunk.length - 1;
	if ((chunk[end] & 128) === 0) return chunk.length;
	let start = end;
	while (start > 0 && (chunk[start] & 192) === 128) start--;
	const lead = chunk[start];
	const expected = lead < 128 ? 1 : lead < 224 ? 2 : lead < 240 ? 3 : 4;
	return end - start + 1 < expected ? start : chunk.length;
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
				const s = await lstat(full);
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
				const mime = IMAGE_MIME[ext] ?? `image/${ext.slice(1)}`;
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
			const readLimit = Math.min(limit + 3, size - offset);
			const buf = Buffer.alloc(readLimit);
			const read = await handle.read(buf, 0, readLimit, offset);
			const safeBytes = completeUtf8Prefix(buf.subarray(0, read.bytesRead), offset + read.bytesRead < size);
			const chunk = buf.subarray(0, safeBytes);
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
				bytesRead: safeBytes,
				truncated: offset + safeBytes < size,
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
		readJsonBody(req).then((result) => {
			if (!result.ok) {
				sendJson(res, result.status, {
					ok: false,
					error: result.error
				});
				return;
			}
			const body = result.value;
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
			for (const key of keys) {
				if (!Object.hasOwn(known, key)) {
					sendJson(res, 400, {
						ok: false,
						error: `未知配置项: ${key}`
					});
					return;
				}
				const value = patch[key];
				if (key === "allowOutsideCwd" && typeof value !== "boolean" || key !== "allowOutsideCwd" && (typeof value !== "number" || !Number.isInteger(value)) || key === "maxPreviewBytes" && value < 65536 || key === "maxPreviewBytes" && value > 8388608 || key === "imageMaxBytes" && value < 65536 || key === "imageMaxBytes" && value > 16777216) {
					sendJson(res, 400, {
						ok: false,
						error: `非法值: ${key}`
					});
					return;
				}
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
	liveSessions = ctx.get("sessions");
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
