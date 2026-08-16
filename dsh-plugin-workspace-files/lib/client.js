window.__ModuleLoader__.load({
	id: "dsh-plugin-workspace-files",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let react = require("react");
react = __toESM(react, 1);
//#region src/client/locales.ts
/**
* 插件文案（zh/en 双语）。全部文案必须走 t()，不硬编码中文。
*/
const NS = "workspace-files";
/** 全部字典。 */
const DICTS = {
	zh: {
		"settings.title": "工作区文件",
		"settings.desc": "输入框 @ 引用文件、修改文件点击侧边栏预览、右上角项目文件夹浏览。",
		"settings.intercept": "点击文件打开预览",
		"settings.interceptSub": "产物 / 文件提及 / 工具卡片中的文件路径点击后在此预览（关闭后恢复系统打开）",
		"settings.showHidden": "显示隐藏文件",
		"settings.showHiddenSub": "文件夹浏览中显示点开头的文件与目录",
		"settings.ignore": "忽略规则",
		"settings.ignoreSub": "逗号分隔的目录/文件名；与内置 node_modules/.git 等合并生效",
		"settings.maxPreview": "预览大小上限",
		"settings.maxPreviewSub": "文本预览单次读取上限（服务端强制）",
		"settings.imageMax": "图片预览上限",
		"settings.imageMaxSub": "超过此大小的图片不返回预览（服务端强制）",
		"settings.outside": "允许浏览工作区之外",
		"settings.outsideSub": "放宽读取边界到主目录（谨慎）",
		"settings.recentCount": "最近引用条数",
		"settings.recentCountSub": "@ 菜单置顶显示的最近文件数量",
		"settings.hostHint": "宿主桥未连接，安全参数无法保存",
		"preview.copyPath": "复制路径",
		"preview.copyDone": "已复制",
		"preview.openSystem": "在系统中打开",
		"preview.rendered": "渲染",
		"preview.raw": "原文",
		"preview.back": "← 返回文件夹",
		"preview.binary": "二进制文件，暂不支持预览",
		"preview.imageTooLarge": "图片超过预览大小上限",
		"preview.truncated": "内容较长，已显示前 {count} 行",
		"preview.loadMore": "加载更多",
		"preview.loading": "加载中…",
		"preview.error": "读取失败：{error}",
		"preview.retry": "重试",
		"preview.lines": "{lines} 行 · {size}",
		"preview.close": "关闭预览",
		"browser.title": "项目文件夹",
		"browser.refresh": "刷新",
		"browser.close": "关闭",
		"browser.empty": "此目录为空",
		"browser.emptyOpen": "在系统中打开",
		"browser.folder": "📁 {name}",
		"browser.folderTooltip": "当前会话工作目录：{path}",
		"browser.noCwd": "当前会话无工作目录",
		"mention.recent": "最近引用"
	},
	en: {
		"settings.title": "Workspace Files",
		"settings.desc": "Mention files with @, preview modified files in the sidebar, and browse the project folder.",
		"settings.intercept": "Open file preview on click",
		"settings.interceptSub": "Produced files, mentions, and tool-card paths preview here (system open restored when off)",
		"settings.showHidden": "Show hidden files",
		"settings.showHiddenSub": "Show dot-prefixed files and directories in the folder browser",
		"settings.ignore": "Ignore rules",
		"settings.ignoreSub": "Comma-separated names; merged with built-in node_modules/.git etc.",
		"settings.maxPreview": "Preview size limit",
		"settings.maxPreviewSub": "Max bytes per text preview read (enforced host-side)",
		"settings.imageMax": "Image preview limit",
		"settings.imageMaxSub": "Images larger than this are not previewed (enforced host-side)",
		"settings.outside": "Allow browsing outside workspace",
		"settings.outsideSub": "Relax the read boundary to the home directory (use with care)",
		"settings.recentCount": "Recent count",
		"settings.recentCountSub": "Number of recent files pinned at the top of the @ menu",
		"settings.hostHint": "Host bridge unreachable; security settings cannot be saved",
		"preview.copyPath": "Copy path",
		"preview.copyDone": "Copied",
		"preview.openSystem": "Open in system",
		"preview.rendered": "Rendered",
		"preview.raw": "Raw",
		"preview.back": "← Back to folder",
		"preview.binary": "Binary file — preview not supported",
		"preview.imageTooLarge": "Image exceeds the preview size limit",
		"preview.truncated": "Long content — showing first {count} lines",
		"preview.loadMore": "Load more",
		"preview.loading": "Loading…",
		"preview.error": "Read failed: {error}",
		"preview.retry": "Retry",
		"preview.lines": "{lines} lines · {size}",
		"preview.close": "Close preview",
		"browser.title": "Project Folder",
		"browser.refresh": "Refresh",
		"browser.close": "Close",
		"browser.empty": "This folder is empty",
		"browser.emptyOpen": "Open in system",
		"browser.folder": "📁 {name}",
		"browser.folderTooltip": "Current session working directory: {path}",
		"browser.noCwd": "Current session has no working directory",
		"mention.recent": "Recent"
	}
};
let bind;
/** apply 时绑定 locale.bind(NS)。 */
function setTranslator(translate) {
	bind = translate;
}
/** 组件内取文案；未绑定时回退到 key 本身。 */
function t(key, params) {
	if (bind !== void 0) return bind(key, params);
	return key;
}
//#endregion
//#region src/client/bridge.ts
function q$1(params) {
	const sp = new URLSearchParams();
	for (const [k, v] of Object.entries(params)) if (v !== void 0 && v !== "") sp.set(k, String(v));
	const s = sp.toString();
	return s === "" ? "" : `?${s}`;
}
async function getJson(url, signal) {
	try {
		const res = await fetch(url, { signal });
		if (!res.ok) try {
			return {
				ok: false,
				error: (await res.json()).error ?? `HTTP ${res.status}`
			};
		} catch {
			return {
				ok: false,
				error: `HTTP ${res.status}`
			};
		}
		return await res.json();
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") throw error;
		return {
			ok: false,
			error: "无法连接宿主桥"
		};
	}
}
/** 列一层目录。rel 为相对 root 的路径（'' = root）。 */
function listDir(root, rel, showHidden, signal) {
	return getJson(`/workspace-files/list${q$1({
		root,
		path: rel,
		hidden: showHidden ? 1 : void 0
	})}`, signal);
}
/** 读文件片段。 */
function readFile(root, rel, offset, limit, signal) {
	return getJson(`/workspace-files/read${q$1({
		root,
		path: rel,
		offset,
		limit
	})}`, signal);
}
async function getHostConfig(signal) {
	const result = await getJson(`/workspace-files/config`, signal);
	if (result === null || typeof result === "object" && result.ok === false) return null;
	return result;
}
async function patchHostConfig(patch) {
	try {
		const res = await fetch("/workspace-files/config", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(patch)
		});
		if (!res.ok) return null;
		const body = await res.json();
		if (body.ok === false) return null;
		return body;
	} catch {
		return null;
	}
}
//#endregion
//#region src/client/store.ts
function createStore(initial) {
	let state = initial;
	const listeners = /* @__PURE__ */ new Set();
	return {
		get: () => state,
		set: (patch) => {
			const next = typeof patch === "function" ? patch(state) : patch;
			state = {
				...state,
				...next
			};
			for (const fn of listeners) fn();
		},
		subscribe: (fn) => {
			listeners.add(fn);
			return () => {
				listeners.delete(fn);
			};
		}
	};
}
/** React 订阅 hook：与 useSyncExternalStore 同语义。 */
function useStore(store) {
	return reactUseSyncExternalStore(store.subscribe, store.get);
}
const reactUseSyncExternalStore = react.useSyncExternalStore;
const previewStore = createStore({
	open: false,
	root: "",
	relPath: "",
	fromBrowser: false
});
function openPreview(root, relPath, fromBrowser) {
	previewStore.set({
		open: true,
		root,
		relPath,
		fromBrowser
	});
}
function closePreview() {
	previewStore.set({ open: false });
}
const browserStore = createStore({
	open: false,
	root: "",
	currentPath: "",
	rev: 0
});
function openBrowser(root) {
	browserStore.set({
		open: true,
		root,
		currentPath: root,
		rev: browserStore.get().rev + 1
	});
}
function closeBrowser() {
	browserStore.set({ open: false });
}
const PREFS_KEY = "dsh-workspace-files:prefs";
const DEFAULT_PREFS = {
	intercept: true,
	showHidden: false,
	ignore: "",
	recentCount: 5
};
const prefsStore = createStore(loadPrefs());
function loadPrefs() {
	try {
		const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}");
		return {
			intercept: typeof raw.intercept === "boolean" ? raw.intercept : DEFAULT_PREFS.intercept,
			showHidden: typeof raw.showHidden === "boolean" ? raw.showHidden : DEFAULT_PREFS.showHidden,
			ignore: typeof raw.ignore === "string" ? raw.ignore : DEFAULT_PREFS.ignore,
			recentCount: typeof raw.recentCount === "number" && raw.recentCount > 0 ? Math.min(10, Math.floor(raw.recentCount)) : DEFAULT_PREFS.recentCount
		};
	} catch {
		return { ...DEFAULT_PREFS };
	}
}
function setPrefs(patch) {
	const next = {
		...prefsStore.get(),
		...patch
	};
	prefsStore.set(next);
	try {
		localStorage.setItem(PREFS_KEY, JSON.stringify(next));
	} catch {}
}
const RECENTS_KEY = "dsh-workspace-files:recents";
function loadRecents() {
	try {
		const raw = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? "[]");
		if (!Array.isArray(raw)) return [];
		return raw.filter((e) => typeof e === "object" && e !== null && typeof e.sessionId === "string" && typeof e.root === "string" && typeof e.relPath === "string" && typeof e.at === "number").slice(0, 50);
	} catch {
		return [];
	}
}
function saveRecents(entries) {
	try {
		localStorage.setItem(RECENTS_KEY, JSON.stringify(entries.slice(0, 50)));
	} catch {}
}
/** 取某会话 + 某根目录下的最近引用（新→旧）。 */
function getRecents(sessionId, root) {
	const count = prefsStore.get().recentCount;
	return loadRecents().filter((e) => e.sessionId === sessionId && e.root === root).slice(0, count).map((e) => e.relPath);
}
const recentsListeners = /* @__PURE__ */ new Set();
/** 最近引用变化订阅（用于 input-trigger 的 lexicon 失效通知）。 */
function subscribeRecents(fn) {
	recentsListeners.add(fn);
	return () => {
		recentsListeners.delete(fn);
	};
}
/** 记录一次引用（@ 选中或预览打开）。 */
function addRecent(sessionId, root, relPath) {
	const entries = loadRecents().filter((e) => !(e.sessionId === sessionId && e.relPath === relPath && e.root === root));
	entries.unshift({
		sessionId,
		root,
		relPath,
		at: Date.now()
	});
	saveRecents(entries);
	for (const fn of [...recentsListeners]) fn();
}
//#endregion
//#region src/client/paths.ts
/**
* 路径工具（浏览器端，纯字符串处理）。
* Windows 分隔符（\\）与正斜杠均接受；显示统一用正斜杠。
*/
/** 取 basename（两套分隔符）。 */
function basenameOf(path) {
	const at = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
	return at === -1 ? path : path.slice(at + 1);
}
/** 是否绝对路径（盘符或 / 开头）。 */
function isAbsolute(path) {
	return /^[A-Za-z]:[\\/]/.test(path) || path.startsWith("/") || path.startsWith("\\");
}
/** 绝对路径 = 拼接（仅当 rel 为相对路径时）。 */
function joinAbs(root, rel) {
	if (isAbsolute(rel)) return rel;
	if (rel === "") return root;
	const sep = root.includes("\\") ? "\\" : "/";
	const trimmed = rel.replace(/^[\\/]+/, "").replace(/[\\/]+$/, "");
	return `${root.replace(/[\\/]+$/, "")}${sep}${trimmed}`;
}
/** 相对 root 的展示路径（正斜杠）。 */
function relOf(abs, root) {
	const normRoot = root.replace(/[\\/]+$/, "");
	if (abs === normRoot) return ".";
	const lower = abs.toLowerCase();
	const lowerRoot = normRoot.toLowerCase();
	if (lower.startsWith(lowerRoot + "\\") || lower.startsWith(lowerRoot + "/")) return abs.slice(normRoot.length + 1).replace(/\\/g, "/");
	return abs.replace(/\\/g, "/");
}
/**
* 是否「就是」一个路径 token（严格判定，拒绝「含路径的句子」，
* 如 tooltip「当前会话工作目录：D:\…」里夹着中文与冒号）：
* - 绝对：盘符+分隔符，或 /、\\ 开头；
* - 相对：纯路径段组成（字母数字 ._@+~- 与分隔符），或单段带扩展名。
*/
function isPathTitle(value) {
	const t = value.trim();
	if (t === "") return false;
	if (/^[A-Za-z]:[\\/]/.test(t) || t.startsWith("/") || t.startsWith("\\")) return true;
	return /^[\w.@+~ -]+(?:\.[A-Za-z0-9]+)$/.test(t) || /^[\w.@+~ -]+(?:[\\/][\w.@+~ -]+)+$/.test(t);
}
/** 文件图标（按扩展名）。 */
function fileIcon(name) {
	switch (name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "") {
		case "md": return "📝";
		case "json":
		case "yaml":
		case "yml":
		case "toml": return "🧾";
		case "png":
		case "jpg":
		case "jpeg":
		case "gif":
		case "webp":
		case "svg": return "🖼";
		case "ts":
		case "tsx":
		case "js":
		case "jsx":
		case "mjs":
		case "cjs": return "📄";
		default: return "📄";
	}
}
//#endregion
//#region src/client/mention.ts
/**
* F1：@ 文件引用 source（注册进官方 input-trigger 管线）。
*
* - 菜单候选：最近引用（置顶，按 query 过滤）+ 当前层文件/目录；
* - 斜杠层级导航：@src/components/ 直接进入子目录；
* - onPick → { text: '<相对路径> ' }，随普通 prompt 发送，agent 直接可读；
* - lexicon：返回本会话最近引用的相对路径，草稿中 @<路径> 呈 chip 装饰。
*/
/** 忽略规则：内置 + 用户自定义（逗号分隔，大小写不敏感）。 */
function ignoredNames() {
	const builtin = [
		"node_modules",
		".git",
		"dist",
		"build",
		"out",
		".next"
	];
	const extra = (prefsStore.get().ignore ?? "").split(",").map((s) => s.trim()).filter((s) => s !== "");
	return new Set([...builtin, ...extra].map((s) => s.toLowerCase()));
}
function cwdOf(sessions, sessionId) {
	return sessions.list.getSnapshot().byId[sessionId]?.cwd;
}
const listCache = /* @__PURE__ */ new Map();
const LIST_CACHE_TTL_MS = 2e3;
async function cachedList(root, rel, signal) {
	const key = `${root}\u0000${rel}`;
	const cached = listCache.get(key);
	const now = Date.now();
	if (cached !== void 0 && now - cached.at < LIST_CACHE_TTL_MS) return cached.result;
	const result = await listDir(root, rel, false, signal);
	if (result.ok) listCache.set(key, {
		at: now,
		result
	});
	return result;
}
function createFileSource(sessions, inputTriggers) {
	return inputTriggers.registerSource({
		trigger: "@",
		name: "file",
		order: -10,
		async candidates(session, { query, signal }) {
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd === void 0) return [];
			const lastSlash = Math.max(query.lastIndexOf("/"), query.lastIndexOf("\\"));
			const dirPart = lastSlash >= 0 ? query.slice(0, lastSlash + 1) : "";
			const rest = lastSlash >= 0 ? query.slice(lastSlash + 1) : query;
			const recents = dirPart === "" ? getRecents(session.sessionId, cwd) : [];
			const list = await cachedList(cwd, dirPart.replace(/\\/g, "/"), signal);
			const ignore = ignoredNames();
			const matched = (list.entries ?? []).filter((e) => !ignore.has(e.name.toLowerCase())).filter((e) => e.name.toLowerCase().startsWith(rest.toLowerCase()));
			const dirs = matched.filter((e) => e.kind === "dir");
			const files = matched.filter((e) => e.kind === "file");
			const recentCands = recents.filter((rel) => {
				const target = rest.toLowerCase();
				return target === "" || rel.toLowerCase().includes(target) || basenameOf(rel).toLowerCase().includes(target);
			}).map((rel) => ({
				name: basenameOf(rel),
				description: rel,
				icon: "🕘",
				hint: t("mention.recent")
			}));
			const dirCands = dirs.map((d) => ({
				name: d.name,
				description: `${relOf(d.path, cwd)}/`,
				icon: "📁"
			}));
			const fileCands = files.map((f) => ({
				name: f.name,
				description: relOf(f.path, cwd),
				icon: fileIcon(f.name)
			}));
			return [
				...recentCands,
				...dirCands,
				...fileCands
			];
		},
		onPick({ candidate, session }) {
			const raw = candidate.description ?? candidate.name;
			const isDir = raw.endsWith("/");
			const rel = raw.replace(/\/$/, "");
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd !== void 0) addRecent(session.sessionId, cwd, rel);
			return { insert: {
				source: "file",
				ref: isDir ? `${rel}/` : rel,
				label: isDir ? `${basenameOf(rel)}/` : basenameOf(rel),
				clipboardText: `@${rel}${isDir ? "/" : ""}`
			} };
		},
		codec: {
			clipboardText: (ref) => `@${ref}`,
			serialize: (ref) => Promise.resolve(`@${ref}`)
		},
		lexicon(session) {
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd === void 0) return void 0;
			const recents = getRecents(session.sessionId, cwd);
			return recents.length > 0 ? recents : void 0;
		},
		subscribeLexicon(_session, listener) {
			const offSessions = sessions.list.subscribe(listener);
			const offPrefs = prefsStore.subscribe(listener);
			const offRecents = subscribeRecents(listener);
			return () => {
				offSessions();
				offPrefs();
				offRecents();
			};
		},
		warm(session) {
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd !== void 0) cachedList(cwd, "");
		}
	});
}
//#endregion
//#region src/client/browser.ts
/**
* F3：右上角「项目文件夹」→ 文件夹浏览抽屉。
*
* 面包屑导航 + 单层列表（目录在前，点击进入；文件点击打开预览）。
* 根 = 当前会话 cwd；切换会话自动重根；隐藏文件开关来自设置。
*/
let sessionsSvc$2;
let workspacesSvc$1;
function bindBrowserServices(sessions, workspaces) {
	sessionsSvc$2 = sessions;
	workspacesSvc$1 = workspaces;
}
function FolderBrowser() {
	const state = useStore(browserStore);
	const prefs = useStore(prefsStore);
	const [listing, setListing] = react.useState({
		entries: [],
		truncated: false
	});
	const [loading, setLoading] = react.useState(false);
	const lastSession = react.useRef(void 0);
	react.useEffect(() => {
		if (!state.open || state.root === "") return;
		let cancelled = false;
		const controller = new AbortController();
		setLoading(true);
		listDir(state.root, relOf(state.currentPath, state.root), prefs.showHidden, controller.signal).then((r) => {
			if (cancelled) return;
			setListing(r.ok ? {
				entries: r.entries ?? [],
				truncated: r.truncated === true
			} : {
				entries: [],
				truncated: false,
				error: r.error
			});
			setLoading(false);
		}).catch(() => {
			if (cancelled) return;
			setListing({
				entries: [],
				truncated: false,
				error: "network"
			});
			setLoading(false);
		});
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [
		state.open,
		state.root,
		state.currentPath,
		state.rev,
		prefs.showHidden
	]);
	react.useEffect(() => {
		if (!state.open || sessionsSvc$2 === void 0) return;
		const sync = () => {
			const snap = sessionsSvc$2?.list.getSnapshot();
			const cur = snap?.current;
			if (cur === void 0 || cur === lastSession.current) return;
			lastSession.current = cur;
			const cwd = snap?.byId[cur]?.cwd;
			if (cwd !== void 0 && cwd !== "") browserStore.set({
				root: cwd,
				currentPath: cwd,
				rev: browserStore.get().rev + 1
			});
		};
		sync();
		return sessionsSvc$2.list.subscribe(sync);
	}, [state.open]);
	react.useEffect(() => {
		if (!state.open) return;
		const onKey = (ev) => {
			if (ev.key === "Escape") {
				if (previewStore.get().open) return;
				ev.stopPropagation();
				closeBrowser();
			}
		};
		document.addEventListener("keydown", onKey, true);
		return () => document.removeEventListener("keydown", onKey, true);
	}, [state.open]);
	if (!state.open) return null;
	const root = state.root;
	const current = state.currentPath;
	const crumbs = crumbsOf(root, current);
	const ignore = ignoredNames();
	const visible = (listing.entries ?? []).filter((e) => !ignore.has(e.name.toLowerCase()));
	const openFile = (entry) => {
		addRecent(lastSession.current ?? "", root, relOf(entry.path, root));
		openPreview(root, relOf(entry.path, root), true);
	};
	return react.createElement("div", {
		className: "wf-drawer-backdrop",
		onClick: (e) => {
			if (e.target === e.currentTarget) closeBrowser();
		}
	}, react.createElement("div", {
		className: "wf-drawer",
		role: "dialog",
		"aria-label": t("browser.title"),
		onClick: (e) => e.stopPropagation()
	}, react.createElement("div", { className: "wf-drawer-head" }, react.createElement("div", { className: "wf-drawer-title" }, t("browser.title")), react.createElement("button", {
		type: "button",
		className: "wf-icon-btn",
		title: t("browser.refresh"),
		onClick: () => browserStore.set({ rev: browserStore.get().rev + 1 })
	}, "⟳"), react.createElement("button", {
		type: "button",
		className: "wf-icon-btn",
		"aria-label": t("browser.close"),
		onClick: closeBrowser
	}, "⨯")), react.createElement("div", { className: "wf-breadcrumb" }, crumbs.map((path, i) => {
		const isLast = i === crumbs.length - 1;
		return react.createElement(react.Fragment, { key: path }, i > 0 ? react.createElement("span", { className: "wf-crumb-sep" }, "›") : null, isLast ? react.createElement("span", {
			className: "wf-crumb",
			style: {
				color: "var(--dsw-alias-label-primary)",
				cursor: "default"
			}
		}, basenameOf(path)) : react.createElement("button", {
			type: "button",
			className: "wf-crumb",
			onClick: () => browserStore.set({ currentPath: path })
		}, basenameOf(path)));
	})), loading ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", { className: "wf-body-hint" }, t("preview.loading"))) : listing.error !== void 0 ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", { className: "wf-body-hint" }, t("preview.error", { error: listing.error }))) : visible.length === 0 ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", { className: "wf-body-hint" }, t("browser.empty"), workspacesSvc$1 !== void 0 ? react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => {
			workspacesSvc$1?.openPath(current).catch(() => {});
		}
	}, t("browser.emptyOpen")) : null)) : react.createElement("div", {
		className: "wf-drawer-body wf-body-plain",
		style: { padding: "4px 6px" }
	}, react.createElement("div", { className: "wf-tree" }, visible.map((entry) => entry.kind === "dir" ? react.createElement("div", {
		key: entry.path,
		className: "wf-node",
		title: entry.path,
		onClick: () => browserStore.set({ currentPath: entry.path })
	}, react.createElement("span", { className: "wf-node-toggle" }, "›"), react.createElement("span", { className: "wf-node-icon" }, "📁"), react.createElement("span", { className: "wf-node-name" }, entry.name)) : react.createElement("div", {
		key: entry.path,
		className: "wf-node",
		title: entry.path,
		onClick: () => openFile(entry)
	}, react.createElement("span", { className: "wf-node-toggle" }, ""), react.createElement("span", { className: "wf-node-icon" }, fileIcon(entry.name)), react.createElement("span", { className: "wf-node-name" }, entry.name), react.createElement("span", { className: "wf-node-size" }, formatBytes$1(entry.size)))), listing.truncated === true ? react.createElement("div", {
		className: "wf-body-hint",
		style: { padding: "12px" }
	}, "+ …") : null)), react.createElement("div", { className: "wf-browser-foot" }, react.createElement("label", { style: {
		display: "inline-flex",
		alignItems: "center",
		gap: 6,
		cursor: "pointer"
	} }, react.createElement("input", {
		type: "checkbox",
		checked: prefs.showHidden,
		onChange: (e) => setPrefs({ showHidden: e.target.checked })
	}), t("settings.showHidden")))));
}
function crumbsOf(root, current) {
	if (current === root) return [root];
	const segs = relOf(current, root).split("/").filter((s) => s !== "");
	const parts = [root];
	let acc = root;
	for (const s of segs) {
		acc = joinAbs(acc, s);
		parts.push(acc);
	}
	return parts;
}
function formatBytes$1(size) {
	if (size === void 0) return "";
	if (size < 1024) return `${size} B`;
	if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / 1048576).toFixed(1)} MB`;
}
//#endregion
//#region src/client/header.ts
/**
* F3：会话头部右端「📁 项目名」按钮（conversation.session.header.utilities）。
* 点击打开文件夹浏览抽屉，根 = 当前会话 cwd；无 cwd 时置灰。
*/
let sessionsSvc$1;
function bindHeaderServices(sessions) {
	sessionsSvc$1 = sessions;
}
/** props.sessionId 由槽位 owner 注入（官方 header utilities 同款）。 */
function HeaderFolderButton(props) {
	const [, force] = react.useState(0);
	react.useEffect(() => {
		if (sessionsSvc$1 === void 0) return void 0;
		return sessionsSvc$1.list.subscribe(() => force((n) => n + 1));
	}, []);
	const browser = useStore(browserStore);
	const snap = sessionsSvc$1?.list.getSnapshot();
	const sessionId = props.sessionId ?? snap?.current;
	const cwd = sessionId !== void 0 ? snap?.byId[sessionId]?.cwd : void 0;
	const name = cwd !== void 0 && cwd !== "" ? basenameOf(cwd) : "";
	const open = browser.open;
	return react.createElement("button", {
		type: "button",
		className: "wf-folder-btn",
		title: cwd !== void 0 && cwd !== "" ? t("browser.folderTooltip", { path: cwd }) : t("browser.noCwd"),
		disabled: cwd === void 0 || cwd === "",
		"aria-pressed": open,
		onClick: () => {
			if (cwd !== void 0 && cwd !== "") openBrowser(cwd);
		}
	}, react.createElement("span", null, "📁"), react.createElement("span", { className: "wf-folder-btn-name" }, name !== "" ? name : "…"));
}
//#endregion
//#region node_modules/.pnpm/dompurify@3.4.13/node_modules/dompurify/dist/purify.es.mjs
/*! @license DOMPurify 3.4.13 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.13/LICENSE */
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			if (i = (t = t.call(r)).next, 0 === l);
			else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = true, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
const entries = Object.entries;
const setPrototypeOf = Object.setPrototypeOf;
const isFrozen = Object.isFrozen;
const getPrototypeOf = Object.getPrototypeOf;
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let freeze = Object.freeze;
let seal = Object.seal;
let create = Object.create;
let _ref = typeof Reflect !== "undefined" && Reflect;
let apply$1 = _ref.apply;
let construct = _ref.construct;
if (!freeze) freeze = function freeze(x) {
	return x;
};
if (!seal) seal = function seal(x) {
	return x;
};
if (!apply$1) apply$1 = function apply(func, thisArg) {
	for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) args[_key - 2] = arguments[_key];
	return func.apply(thisArg, args);
};
if (!construct) construct = function construct(Func) {
	for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
	return new Func(...args);
};
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === "undefined" ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === "undefined" ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
* Creates a new function that calls the given function with a specified thisArg and arguments.
*
* @param func - The function to be wrapped and called.
* @returns A new function that calls the given function with a specified thisArg and arguments.
*/
function unapply(func) {
	return function(thisArg) {
		if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
		for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
		return apply$1(func, thisArg, args);
	};
}
/**
* Creates a new function that constructs an instance of the given constructor function with the provided arguments.
*
* @param func - The constructor function to be wrapped and called.
* @returns A new function that constructs an instance of the given constructor function with the provided arguments.
*/
function unconstruct(Func) {
	return function() {
		for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
		return construct(Func, args);
	};
}
/**
* Add properties to a lookup table
*
* @param set - The set to which elements will be added.
* @param array - The array containing elements to be added to the set.
* @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
* @returns The modified set with added elements.
*/
function addToSet(set, array) {
	let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
	if (setPrototypeOf) setPrototypeOf(set, null);
	if (!arrayIsArray(array)) return set;
	let l = array.length;
	while (l--) {
		let element = array[l];
		if (typeof element === "string") {
			const lcElement = transformCaseFunc(element);
			if (lcElement !== element) {
				if (!isFrozen(array)) array[l] = lcElement;
				element = lcElement;
			}
		}
		set[element] = true;
	}
	return set;
}
/**
* Clean up an array to harden against CSPP
*
* @param array - The array to be cleaned.
* @returns The cleaned version of the array
*/
function cleanArray(array) {
	for (let index = 0; index < array.length; index++) if (!objectHasOwnProperty(array, index)) array[index] = null;
	return array;
}
/**
* Shallow clone an object
*
* @param object - The object to be cloned.
* @returns A new object that copies the original.
*/
function clone(object) {
	const newObject = create(null);
	for (const _ref2 of entries(object)) {
		var _ref3 = _slicedToArray(_ref2, 2);
		const property = _ref3[0];
		const value = _ref3[1];
		if (objectHasOwnProperty(object, property)) {
			if (arrayIsArray(value)) newObject[property] = cleanArray(value);
			else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
			else newObject[property] = value;
		}
	}
	return newObject;
}
/**
* Convert non-node values into strings without depending on direct property access.
*
* @param value - The value to stringify.
* @returns A string representation of the provided value.
*/
function stringifyValue(value) {
	switch (typeof value) {
		case "string": return value;
		case "number": return numberToString(value);
		case "boolean": return booleanToString(value);
		case "bigint": return bigintToString ? bigintToString(value) : "0";
		case "symbol": return symbolToString ? symbolToString(value) : "Symbol()";
		case "undefined": return objectToString(value);
		case "function":
		case "object": {
			if (value === null) return objectToString(value);
			const valueAsRecord = value;
			const valueToString = lookupGetter(valueAsRecord, "toString");
			if (typeof valueToString === "function") {
				const stringified = valueToString(valueAsRecord);
				return typeof stringified === "string" ? stringified : objectToString(stringified);
			}
			return objectToString(value);
		}
		default: return objectToString(value);
	}
}
/**
* This method automatically checks if the prop is function or getter and behaves accordingly.
*
* @param object - The object to look up the getter function in its prototype chain.
* @param prop - The property name for which to find the getter function.
* @returns The getter function found in the prototype chain or a fallback function.
*/
function lookupGetter(object, prop) {
	while (object !== null) {
		const desc = getOwnPropertyDescriptor(object, prop);
		if (desc) {
			if (desc.get) return unapply(desc.get);
			if (typeof desc.value === "function") return unapply(desc.value);
		}
		object = getPrototypeOf(object);
	}
	function fallbackValue() {
		return null;
	}
	return fallbackValue;
}
function isRegex(value) {
	try {
		regExpTest(value, "");
		return true;
	} catch (_unused) {
		return false;
	}
}
const html$1 = freeze([
	"a",
	"abbr",
	"acronym",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"bdi",
	"bdo",
	"big",
	"blink",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"content",
	"data",
	"datalist",
	"dd",
	"decorator",
	"del",
	"details",
	"dfn",
	"dialog",
	"dir",
	"div",
	"dl",
	"dt",
	"element",
	"em",
	"fieldset",
	"figcaption",
	"figure",
	"font",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"img",
	"input",
	"ins",
	"kbd",
	"label",
	"legend",
	"li",
	"main",
	"map",
	"mark",
	"marquee",
	"menu",
	"menuitem",
	"meter",
	"nav",
	"nobr",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"picture",
	"pre",
	"progress",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"search",
	"section",
	"select",
	"shadow",
	"slot",
	"small",
	"source",
	"spacer",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"tr",
	"track",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
]);
const svg$1 = freeze([
	"svg",
	"a",
	"altglyph",
	"altglyphdef",
	"altglyphitem",
	"animatecolor",
	"animatemotion",
	"animatetransform",
	"circle",
	"clippath",
	"defs",
	"desc",
	"ellipse",
	"enterkeyhint",
	"exportparts",
	"filter",
	"font",
	"g",
	"glyph",
	"glyphref",
	"hkern",
	"image",
	"inputmode",
	"line",
	"lineargradient",
	"marker",
	"mask",
	"metadata",
	"mpath",
	"part",
	"path",
	"pattern",
	"polygon",
	"polyline",
	"radialgradient",
	"rect",
	"stop",
	"style",
	"switch",
	"symbol",
	"text",
	"textpath",
	"title",
	"tref",
	"tspan",
	"view",
	"vkern"
]);
const svgFilters = freeze([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]);
const svgDisallowed = freeze([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]);
const mathMl$1 = freeze([
	"math",
	"menclose",
	"merror",
	"mfenced",
	"mfrac",
	"mglyph",
	"mi",
	"mlabeledtr",
	"mmultiscripts",
	"mn",
	"mo",
	"mover",
	"mpadded",
	"mphantom",
	"mroot",
	"mrow",
	"ms",
	"mspace",
	"msqrt",
	"mstyle",
	"msub",
	"msup",
	"msubsup",
	"mtable",
	"mtd",
	"mtext",
	"mtr",
	"munder",
	"munderover",
	"mprescripts"
]);
const mathMlDisallowed = freeze([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]);
const text = freeze(["#text"]);
const html = freeze([
	"accept",
	"action",
	"align",
	"alt",
	"autocapitalize",
	"autocomplete",
	"autopictureinpicture",
	"autoplay",
	"background",
	"bgcolor",
	"border",
	"capture",
	"cellpadding",
	"cellspacing",
	"checked",
	"cite",
	"class",
	"clear",
	"color",
	"cols",
	"colspan",
	"command",
	"commandfor",
	"controls",
	"controlslist",
	"coords",
	"crossorigin",
	"datetime",
	"decoding",
	"default",
	"dir",
	"disabled",
	"disablepictureinpicture",
	"disableremoteplayback",
	"download",
	"draggable",
	"enctype",
	"enterkeyhint",
	"exportparts",
	"face",
	"for",
	"headers",
	"height",
	"hidden",
	"high",
	"href",
	"hreflang",
	"id",
	"inert",
	"inputmode",
	"integrity",
	"ismap",
	"kind",
	"label",
	"lang",
	"list",
	"loading",
	"loop",
	"low",
	"max",
	"maxlength",
	"media",
	"method",
	"min",
	"minlength",
	"multiple",
	"muted",
	"name",
	"nonce",
	"noshade",
	"novalidate",
	"nowrap",
	"open",
	"optimum",
	"part",
	"pattern",
	"placeholder",
	"playsinline",
	"popover",
	"popovertarget",
	"popovertargetaction",
	"poster",
	"preload",
	"pubdate",
	"radiogroup",
	"readonly",
	"rel",
	"required",
	"rev",
	"reversed",
	"role",
	"rows",
	"rowspan",
	"spellcheck",
	"scope",
	"selected",
	"shape",
	"size",
	"sizes",
	"slot",
	"span",
	"srclang",
	"start",
	"src",
	"srcset",
	"step",
	"style",
	"summary",
	"tabindex",
	"title",
	"translate",
	"type",
	"usemap",
	"valign",
	"value",
	"width",
	"wrap",
	"xmlns"
]);
const svg = freeze([
	"accent-height",
	"accumulate",
	"additive",
	"alignment-baseline",
	"amplitude",
	"ascent",
	"attributename",
	"attributetype",
	"azimuth",
	"basefrequency",
	"baseline-shift",
	"begin",
	"bias",
	"by",
	"class",
	"clip",
	"clippathunits",
	"clip-path",
	"clip-rule",
	"color",
	"color-interpolation",
	"color-interpolation-filters",
	"color-profile",
	"color-rendering",
	"cx",
	"cy",
	"d",
	"dx",
	"dy",
	"diffuseconstant",
	"direction",
	"display",
	"divisor",
	"dominant-baseline",
	"dur",
	"edgemode",
	"elevation",
	"end",
	"exponent",
	"fill",
	"fill-opacity",
	"fill-rule",
	"filter",
	"filterunits",
	"flood-color",
	"flood-opacity",
	"font-family",
	"font-size",
	"font-size-adjust",
	"font-stretch",
	"font-style",
	"font-variant",
	"font-weight",
	"fx",
	"fy",
	"g1",
	"g2",
	"glyph-name",
	"glyphref",
	"gradientunits",
	"gradienttransform",
	"height",
	"href",
	"id",
	"image-rendering",
	"in",
	"in2",
	"intercept",
	"k",
	"k1",
	"k2",
	"k3",
	"k4",
	"kerning",
	"keypoints",
	"keysplines",
	"keytimes",
	"lang",
	"lengthadjust",
	"letter-spacing",
	"kernelmatrix",
	"kernelunitlength",
	"lighting-color",
	"local",
	"marker-end",
	"marker-mid",
	"marker-start",
	"markerheight",
	"markerunits",
	"markerwidth",
	"maskcontentunits",
	"maskunits",
	"max",
	"mask",
	"mask-type",
	"media",
	"method",
	"mode",
	"min",
	"name",
	"numoctaves",
	"offset",
	"operator",
	"opacity",
	"order",
	"orient",
	"orientation",
	"origin",
	"overflow",
	"paint-order",
	"path",
	"pathlength",
	"patterncontentunits",
	"patterntransform",
	"patternunits",
	"points",
	"preservealpha",
	"preserveaspectratio",
	"primitiveunits",
	"r",
	"rx",
	"ry",
	"radius",
	"refx",
	"refy",
	"repeatcount",
	"repeatdur",
	"restart",
	"result",
	"rotate",
	"scale",
	"seed",
	"shape-rendering",
	"slope",
	"specularconstant",
	"specularexponent",
	"spreadmethod",
	"startoffset",
	"stddeviation",
	"stitchtiles",
	"stop-color",
	"stop-opacity",
	"stroke-dasharray",
	"stroke-dashoffset",
	"stroke-linecap",
	"stroke-linejoin",
	"stroke-miterlimit",
	"stroke-opacity",
	"stroke",
	"stroke-width",
	"style",
	"surfacescale",
	"systemlanguage",
	"tabindex",
	"tablevalues",
	"targetx",
	"targety",
	"transform",
	"transform-origin",
	"text-anchor",
	"text-decoration",
	"text-orientation",
	"text-rendering",
	"textlength",
	"type",
	"u1",
	"u2",
	"unicode",
	"values",
	"viewbox",
	"visibility",
	"version",
	"vert-adv-y",
	"vert-origin-x",
	"vert-origin-y",
	"width",
	"word-spacing",
	"wrap",
	"writing-mode",
	"xchannelselector",
	"ychannelselector",
	"x",
	"x1",
	"x2",
	"xmlns",
	"y",
	"y1",
	"y2",
	"z",
	"zoomandpan"
]);
const mathMl = freeze([
	"accent",
	"accentunder",
	"align",
	"bevelled",
	"close",
	"columnalign",
	"columnlines",
	"columnspacing",
	"columnspan",
	"denomalign",
	"depth",
	"dir",
	"display",
	"displaystyle",
	"encoding",
	"fence",
	"frame",
	"height",
	"href",
	"id",
	"largeop",
	"length",
	"linethickness",
	"lquote",
	"lspace",
	"mathbackground",
	"mathcolor",
	"mathsize",
	"mathvariant",
	"maxsize",
	"minsize",
	"movablelimits",
	"notation",
	"numalign",
	"open",
	"rowalign",
	"rowlines",
	"rowspacing",
	"rowspan",
	"rspace",
	"rquote",
	"scriptlevel",
	"scriptminsize",
	"scriptsizemultiplier",
	"selection",
	"separator",
	"separators",
	"stretchy",
	"subscriptshift",
	"supscriptshift",
	"symmetric",
	"voffset",
	"width",
	"xmlns"
]);
const xml = freeze([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]);
const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/);
const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
const ELEMENT_MARKUP_PROBE = seal(/<[/\w!]/g);
const COMMENT_MARKUP_PROBE = seal(/<[/\w]/g);
const FALLBACK_TAG_CLOSE = seal(/<\/no(script|embed|frames)/i);
const SELF_CLOSING_TAG = seal(/\/>/i);
const NODE_TYPE = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
};
const getGlobal = function getGlobal() {
	return typeof window === "undefined" ? null : window;
};
/**
* Creates a no-op policy for internal use only.
* Don't export this function outside this module!
* @param trustedTypes The policy factory.
* @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
* @return The policy created (or null, if Trusted Types
* are not supported or creating the policy failed).
*/
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
	if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
	let suffix = null;
	const ATTR_NAME = "data-tt-policy-suffix";
	if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
	const policyName = "dompurify" + (suffix ? "#" + suffix : "");
	try {
		return trustedTypes.createPolicy(policyName, {
			createHTML(html) {
				return html;
			},
			createScriptURL(scriptUrl) {
				return scriptUrl;
			}
		});
	} catch (_) {
		console.warn("TrustedTypes policy " + policyName + " could not be created.");
		return null;
	}
};
const _createHooksMap = function _createHooksMap() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
};
/**
* Resolve a set-valued configuration option: a fresh set built from
* cfg[key] when it is an own array property (seeded with a clone of
* options.base when given, case-normalized via options.transform),
* the fallback set otherwise.
*
* @param cfg the cloned, prototype-free configuration object
* @param key the configuration property to read
* @param fallback the set to use when the option is absent or not an array
* @param options transform and optional base set to merge into
* @returns the resolved set
*/
const _resolveSetOption = function _resolveSetOption(cfg, key, fallback, options) {
	return objectHasOwnProperty(cfg, key) && arrayIsArray(cfg[key]) ? addToSet(options.base ? clone(options.base) : {}, cfg[key], options.transform) : fallback;
};
function createDOMPurify() {
	let window = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
	const DOMPurify = (root) => createDOMPurify(root);
	DOMPurify.version = "3.4.13";
	DOMPurify.removed = [];
	if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
		DOMPurify.isSupported = false;
		return DOMPurify;
	}
	let document = window.document;
	const originalDocument = document;
	const currentScript = originalDocument.currentScript;
	window.DocumentFragment;
	const HTMLTemplateElement = window.HTMLTemplateElement, Node = window.Node, Element = window.Element, NodeFilter = window.NodeFilter;
	window.NamedNodeMap === void 0 && (window.NamedNodeMap || window.MozNamedAttrMap);
	window.HTMLFormElement;
	const DOMParser = window.DOMParser, trustedTypes = window.trustedTypes;
	const ElementPrototype = Element.prototype;
	const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
	const remove = lookupGetter(ElementPrototype, "remove");
	const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
	const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
	const getParentNode = lookupGetter(ElementPrototype, "parentNode");
	const getShadowRoot = lookupGetter(ElementPrototype, "shadowRoot");
	const getAttributes = lookupGetter(ElementPrototype, "attributes");
	const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeType") : null;
	const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, "nodeName") : null;
	const getOwnerDocument = Node && Node.prototype ? lookupGetter(Node.prototype, "ownerDocument") : null;
	if (typeof HTMLTemplateElement === "function") {
		const template = document.createElement("template");
		if (template.content && template.content.ownerDocument) document = template.content.ownerDocument;
	}
	let trustedTypesPolicy;
	let emptyHTML = "";
	let defaultTrustedTypesPolicy;
	let defaultTrustedTypesPolicyResolved = false;
	let IN_TRUSTED_TYPES_POLICY = 0;
	const _assertNotInTrustedTypesPolicy = function _assertNotInTrustedTypesPolicy() {
		if (IN_TRUSTED_TYPES_POLICY > 0) throw typeErrorCreate("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	};
	const _createTrustedHTML = function _createTrustedHTML(html) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createHTML(html);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _createTrustedScriptURL = function _createTrustedScriptURL(scriptUrl) {
		_assertNotInTrustedTypesPolicy();
		IN_TRUSTED_TYPES_POLICY++;
		try {
			return trustedTypesPolicy.createScriptURL(scriptUrl);
		} finally {
			IN_TRUSTED_TYPES_POLICY--;
		}
	};
	const _getDefaultTrustedTypesPolicy = function _getDefaultTrustedTypesPolicy() {
		if (!defaultTrustedTypesPolicyResolved) {
			defaultTrustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
			defaultTrustedTypesPolicyResolved = true;
		}
		return defaultTrustedTypesPolicy;
	};
	const _document = document, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, createDocumentFragment = _document.createDocumentFragment, getElementsByTagName = _document.getElementsByTagName;
	const importNode = originalDocument.importNode;
	let hooks = _createHooksMap();
	/**
	* Expose whether this browser supports running the full DOMPurify.
	*/
	DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
	const MUSTACHE_EXPR$1 = MUSTACHE_EXPR, ERB_EXPR$1 = ERB_EXPR, TMPLIT_EXPR$1 = TMPLIT_EXPR, DATA_ATTR$1 = DATA_ATTR, ARIA_ATTR$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$1 = ATTR_WHITESPACE, CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
	/**
	* We consider the elements and attributes below to be safe. Ideally
	* don't add any new ones but feel free to remove unwanted ones.
	*/
	let ALLOWED_TAGS = null;
	const DEFAULT_ALLOWED_TAGS = addToSet({}, [
		...html$1,
		...svg$1,
		...svgFilters,
		...mathMl$1,
		...text
	]);
	let ALLOWED_ATTR = null;
	const DEFAULT_ALLOWED_ATTR = addToSet({}, [
		...html,
		...svg,
		...mathMl,
		...xml
	]);
	let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
		tagNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeNameCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: false
		}
	}));
	let FORBID_TAGS = null;
	let FORBID_ATTR = null;
	const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
		tagCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		},
		attributeCheck: {
			writable: true,
			configurable: false,
			enumerable: true,
			value: null
		}
	}));
	let ALLOW_ARIA_ATTR = true;
	let ALLOW_DATA_ATTR = true;
	let ALLOW_UNKNOWN_PROTOCOLS = false;
	let ALLOW_SELF_CLOSE_IN_ATTR = true;
	let SAFE_FOR_TEMPLATES = false;
	let SAFE_FOR_XML = true;
	let WHOLE_DOCUMENT = false;
	let SET_CONFIG = false;
	let SET_CONFIG_ALLOWED_TAGS = null;
	let SET_CONFIG_ALLOWED_ATTR = null;
	let FORCE_BODY = false;
	let RETURN_DOM = false;
	let RETURN_DOM_FRAGMENT = false;
	let RETURN_TRUSTED_TYPE = false;
	let SANITIZE_DOM = true;
	let SANITIZE_NAMED_PROPS = false;
	const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
	let KEEP_CONTENT = true;
	let IN_PLACE = false;
	let USE_PROFILES = {};
	let FORBID_CONTENTS = null;
	const DEFAULT_FORBID_CONTENTS = addToSet({}, [
		"annotation-xml",
		"audio",
		"colgroup",
		"desc",
		"foreignobject",
		"head",
		"iframe",
		"math",
		"mi",
		"mn",
		"mo",
		"ms",
		"mtext",
		"noembed",
		"noframes",
		"noscript",
		"plaintext",
		"script",
		"selectedcontent",
		"style",
		"svg",
		"template",
		"thead",
		"title",
		"video",
		"xmp"
	]);
	let DATA_URI_TAGS = null;
	const DEFAULT_DATA_URI_TAGS = addToSet({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]);
	let URI_SAFE_ATTRIBUTES = null;
	const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]);
	const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
	const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
	const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
	let NAMESPACE = HTML_NAMESPACE;
	let IS_EMPTY_INPUT = false;
	let ALLOWED_NAMESPACES = null;
	const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
		MATHML_NAMESPACE,
		SVG_NAMESPACE,
		HTML_NAMESPACE
	], stringToString);
	const DEFAULT_MATHML_TEXT_INTEGRATION_POINTS = freeze([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]);
	let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
	const DEFAULT_HTML_INTEGRATION_POINTS = freeze(["annotation-xml"]);
	let HTML_INTEGRATION_POINTS = addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
	const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]);
	let PARSER_MEDIA_TYPE = null;
	const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
	const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
	let transformCaseFunc = null;
	let CONFIG = null;
	const formElement = document.createElement("form");
	const isRegexOrFunction = function isRegexOrFunction(testValue) {
		return testValue instanceof RegExp || testValue instanceof Function;
	};
	/**
	* _parseConfig
	*
	* @param cfg optional config literal
	*/
	const _parseConfig = function _parseConfig() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (CONFIG && CONFIG === cfg) return;
		if (!cfg || typeof cfg !== "object") cfg = {};
		cfg = clone(cfg);
		PARSER_MEDIA_TYPE = SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
		transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
		ALLOWED_TAGS = _resolveSetOption(cfg, "ALLOWED_TAGS", DEFAULT_ALLOWED_TAGS, { transform: transformCaseFunc });
		ALLOWED_ATTR = _resolveSetOption(cfg, "ALLOWED_ATTR", DEFAULT_ALLOWED_ATTR, { transform: transformCaseFunc });
		ALLOWED_NAMESPACES = _resolveSetOption(cfg, "ALLOWED_NAMESPACES", DEFAULT_ALLOWED_NAMESPACES, { transform: stringToString });
		URI_SAFE_ATTRIBUTES = _resolveSetOption(cfg, "ADD_URI_SAFE_ATTR", DEFAULT_URI_SAFE_ATTRIBUTES, {
			transform: transformCaseFunc,
			base: DEFAULT_URI_SAFE_ATTRIBUTES
		});
		DATA_URI_TAGS = _resolveSetOption(cfg, "ADD_DATA_URI_TAGS", DEFAULT_DATA_URI_TAGS, {
			transform: transformCaseFunc,
			base: DEFAULT_DATA_URI_TAGS
		});
		FORBID_CONTENTS = _resolveSetOption(cfg, "FORBID_CONTENTS", DEFAULT_FORBID_CONTENTS, { transform: transformCaseFunc });
		FORBID_TAGS = _resolveSetOption(cfg, "FORBID_TAGS", clone({}), { transform: transformCaseFunc });
		FORBID_ATTR = _resolveSetOption(cfg, "FORBID_ATTR", clone({}), { transform: transformCaseFunc });
		USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === "object" ? clone(cfg.USE_PROFILES) : cfg.USE_PROFILES : false;
		ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
		ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
		ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
		ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
		SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
		SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
		WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
		RETURN_DOM = cfg.RETURN_DOM || false;
		RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
		RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
		FORCE_BODY = cfg.FORCE_BODY || false;
		SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
		SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
		KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
		IN_PLACE = cfg.IN_PLACE || false;
		IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI;
		NAMESPACE = typeof cfg.NAMESPACE === "string" ? cfg.NAMESPACE : HTML_NAMESPACE;
		MATHML_TEXT_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "MATHML_TEXT_INTEGRATION_POINTS") && cfg.MATHML_TEXT_INTEGRATION_POINTS && typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === "object" ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS) : addToSet({}, DEFAULT_MATHML_TEXT_INTEGRATION_POINTS);
		HTML_INTEGRATION_POINTS = objectHasOwnProperty(cfg, "HTML_INTEGRATION_POINTS") && cfg.HTML_INTEGRATION_POINTS && typeof cfg.HTML_INTEGRATION_POINTS === "object" ? clone(cfg.HTML_INTEGRATION_POINTS) : addToSet({}, DEFAULT_HTML_INTEGRATION_POINTS);
		const customElementHandling = objectHasOwnProperty(cfg, "CUSTOM_ELEMENT_HANDLING") && cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING === "object" ? clone(cfg.CUSTOM_ELEMENT_HANDLING) : create(null);
		CUSTOM_ELEMENT_HANDLING = create(null);
		if (objectHasOwnProperty(customElementHandling, "tagNameCheck") && isRegexOrFunction(customElementHandling.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck;
		if (objectHasOwnProperty(customElementHandling, "attributeNameCheck") && isRegexOrFunction(customElementHandling.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck;
		if (objectHasOwnProperty(customElementHandling, "allowCustomizedBuiltInElements") && typeof customElementHandling.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements;
		seal(CUSTOM_ELEMENT_HANDLING);
		if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
		if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
		if (USE_PROFILES) {
			ALLOWED_TAGS = addToSet({}, text);
			ALLOWED_ATTR = create(null);
			if (USE_PROFILES.html === true) {
				addToSet(ALLOWED_TAGS, html$1);
				addToSet(ALLOWED_ATTR, html);
			}
			if (USE_PROFILES.svg === true) {
				addToSet(ALLOWED_TAGS, svg$1);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.svgFilters === true) {
				addToSet(ALLOWED_TAGS, svgFilters);
				addToSet(ALLOWED_ATTR, svg);
				addToSet(ALLOWED_ATTR, xml);
			}
			if (USE_PROFILES.mathMl === true) {
				addToSet(ALLOWED_TAGS, mathMl$1);
				addToSet(ALLOWED_ATTR, mathMl);
				addToSet(ALLOWED_ATTR, xml);
			}
		}
		EXTRA_ELEMENT_HANDLING.tagCheck = null;
		EXTRA_ELEMENT_HANDLING.attributeCheck = null;
		if (objectHasOwnProperty(cfg, "ADD_TAGS")) {
			if (typeof cfg.ADD_TAGS === "function") EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
			else if (arrayIsArray(cfg.ADD_TAGS)) {
				if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
				addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_ATTR")) {
			if (typeof cfg.ADD_ATTR === "function") EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
			else if (arrayIsArray(cfg.ADD_ATTR)) {
				if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
				addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
			}
		}
		if (objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
		if (objectHasOwnProperty(cfg, "FORBID_CONTENTS") && arrayIsArray(cfg.FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
		}
		if (objectHasOwnProperty(cfg, "ADD_FORBID_CONTENTS") && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
			if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
			addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
		}
		if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
		if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
			"html",
			"head",
			"body"
		]);
		if (ALLOWED_TAGS.table) {
			addToSet(ALLOWED_TAGS, ["tbody"]);
			delete FORBID_TAGS.tbody;
		}
		if (cfg.TRUSTED_TYPES_POLICY) {
			if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			const previousTrustedTypesPolicy = trustedTypesPolicy;
			trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
			try {
				emptyHTML = _createTrustedHTML("");
			} catch (error) {
				trustedTypesPolicy = previousTrustedTypesPolicy;
				throw error;
			}
		} else if (cfg.TRUSTED_TYPES_POLICY === null) {
			trustedTypesPolicy = void 0;
			emptyHTML = "";
		} else {
			if (trustedTypesPolicy === void 0) trustedTypesPolicy = _getDefaultTrustedTypesPolicy();
			if (trustedTypesPolicy && typeof emptyHTML === "string") emptyHTML = _createTrustedHTML("");
		}
		if (freeze) freeze(cfg);
		CONFIG = cfg;
	};
	const ALL_SVG_TAGS = addToSet({}, [
		...svg$1,
		...svgFilters,
		...svgDisallowed
	]);
	const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
	/**
	* Namespace rules for an element in the SVG namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkSvgNamespace = function _checkSvgNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
		if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
		return Boolean(ALL_SVG_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the MathML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkMathMlNamespace = function _checkMathMlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
		if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
		return Boolean(ALL_MATHML_TAGS[tagName]);
	};
	/**
	* Namespace rules for an element in the HTML namespace.
	*
	* @param tagName the element's lowercase tag name
	* @param parent the (possibly simulated) parent node
	* @param parentTagName the parent's lowercase tag name
	* @returns true if a spec-compliant parser could produce this element
	*/
	const _checkHtmlNamespace = function _checkHtmlNamespace(tagName, parent, parentTagName) {
		if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
		if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
		return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
	};
	/**
	* @param element a DOM element whose namespace is being checked
	* @returns Return false if the element has a
	*  namespace that a spec-compliant parser would never
	*  return. Return true otherwise.
	*/
	const _checkValidNamespace = function _checkValidNamespace(element) {
		let parent = getParentNode(element);
		if (!parent || !parent.tagName) parent = {
			namespaceURI: NAMESPACE,
			tagName: "template"
		};
		const tagName = stringToLowerCase(element.tagName);
		const parentTagName = stringToLowerCase(parent.tagName);
		if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
		if (element.namespaceURI === SVG_NAMESPACE) return _checkSvgNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === MATHML_NAMESPACE) return _checkMathMlNamespace(tagName, parent, parentTagName);
		if (element.namespaceURI === HTML_NAMESPACE) return _checkHtmlNamespace(tagName, parent, parentTagName);
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
		return false;
	};
	/**
	* _forceRemove
	*
	* @param node a DOM node
	*/
	const _forceRemove = function _forceRemove(node) {
		arrayPush(DOMPurify.removed, { element: node });
		try {
			getParentNode(node).removeChild(node);
		} catch (_) {
			remove(node);
			if (!getParentNode(node)) throw typeErrorCreate("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	};
	/**
	* _neutralizeRoot
	*
	* Fail-closed teardown of an in-place root after the sanitize walk aborts
	* (campaign-3 F2). An internal throw mid-walk — e.g. a page-registered
	* custom element's reaction detaches a node so `_forceRemove`'s deliberate
	* parentless guard throws, or any other re-entrant engine mutation — would
	* otherwise leave the caller's *live* tree half-sanitized, with everything
	* after the abort point still carrying its handlers. There is no safe way
	* to resume the walk (the tree mutated under us), so we strip the root bare:
	* remove every child and every attribute, then let the caller's catch see
	* the original error. Clobber-safe (cached `remove`/`childNodes`/`attributes`
	* getters; the root was already clobber-pre-flighted at the IN_PLACE entry).
	*
	* @param root the in-place root to empty
	*/
	const _neutralizeRoot = function _neutralizeRoot(root) {
		_neutralizeSubtree(root);
		const childNodes = getChildNodes(root);
		if (childNodes) {
			const snapshot = [];
			arrayForEach(childNodes, (child) => {
				arrayPush(snapshot, child);
			});
			arrayForEach(snapshot, (child) => {
				try {
					remove(child);
				} catch (_) {}
			});
		}
		const attributes = getAttributes(root);
		if (attributes) for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name === "string") try {
				root.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _removeAttribute
	*
	* @param name an Attribute name
	* @param element a DOM node
	*/
	const _removeAttribute = function _removeAttribute(name, element) {
		try {
			arrayPush(DOMPurify.removed, {
				attribute: element.getAttributeNode(name),
				from: element
			});
		} catch (_) {
			arrayPush(DOMPurify.removed, {
				attribute: null,
				from: element
			});
		}
		element.removeAttribute(name);
		if (name === "is") {
			if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
				_forceRemove(element);
			} catch (_) {}
			else try {
				element.setAttribute(name, "");
			} catch (_) {}
		}
	};
	/**
	* _stripDisallowedAttributes
	*
	* Removes every attribute the active configuration does not allow from a
	* single element, using the same allowlist as the main attribute pass (so
	* `on*` handlers go, but no `/^on/` blocklist is introduced). Used only to
	* neutralise nodes that are being discarded from an in-place tree.
	*
	* @param element the element to strip
	*/
	const _stripDisallowedAttributes = function _stripDisallowedAttributes(element) {
		const attributes = getAttributes(element);
		if (!attributes) return;
		for (let i = attributes.length - 1; i >= 0; --i) {
			const attribute = attributes[i];
			const name = attribute && attribute.name;
			if (typeof name !== "string" || ALLOWED_ATTR[transformCaseFunc(name)]) continue;
			try {
				element.removeAttribute(name);
			} catch (_) {}
		}
	};
	/**
	* _neutralizeSubtree
	*
	* Completes the audit-5 F1 fix across every removal path. The KEEP_CONTENT
	* move-hoist neutralises only disallowed-tag removals; clobber, mXSS-canary,
	* namespace, comment, processing-instruction and KEEP_CONTENT:false removals
	* all drop their subtree wholesale via `_forceRemove`. On the IN_PLACE path
	* those dropped nodes are detached from the caller's LIVE tree but a
	* handler-bearing original among them (an `<img onerror>`/`<video>` that was
	* loading) keeps its queued resource event, which fires in page scope after
	* sanitize returns. This walks a removed subtree and strips every attribute
	* the active configuration does not allow — so `on*` handlers are cancelled
	* through the SAME allowlist that governs kept nodes, not a separate `/^on/`
	* blocklist. Run synchronously before sanitize returns, i.e. before any
	* queued event can fire. Hook-free by design: these nodes leave the output,
	* so firing attribute hooks for them would be surprising. Clobber-safe reads;
	* a doomed clobbered node may shadow `removeAttribute` (its own attributes are
	* irrelevant — it is discarded — while its non-clobbered descendants, e.g.
	* the `<img>`, are reached and scrubbed).
	*
	* @param root the root of a removed subtree to neutralise
	*/
	const _neutralizeSubtree = function _neutralizeSubtree(root) {
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			if ((getNodeType ? getNodeType(node) : node.nodeType) === NODE_TYPE.element) _stripDisallowedAttributes(node);
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _neutralizePatchLinkage
	*
	* IN_PLACE entry pre-pass (declarative-partial-updates / streaming
	* hardening, https://github.com/WICG/declarative-partial-updates).
	*
	* The main walk strips patch linkage (`for`/`patchsrc`) and removes range
	* markers (PIs / markup comments) node-by-node, in document order, AS it
	* reaches each node. On a live in-place root that leaves a window: from the
	* moment the root is connected until the walk arrives at a given node, that
	* node's linkage is live. A patch applied on connection/stream can fire as
	* a microtask during the walk and inject or teleport an unsanitized DOM
	* range into a region the iterator has already passed and will not revisit,
	* so the post-return "tree is sanitized" contract is violated. Sweep the
	* whole tree once up front and sever every linkage before the walk begins,
	* closing that window.
	*
	* This CANNOT undo a patch that already fired before sanitize ran — that is
	* the irreducible "do not IN_PLACE a live-connected attacker tree" caveat —
	* but it closes everything from sanitize-start onward. Gated on SAFE_FOR_XML
	* to group with the rest of the declarative-partial-updates handling and
	* stay overridable, consistent with the codebase.
	*
	* Clobber-safe traversal (cached childNodes getter); per-node try/catch so a
	* clobbered root cannot defeat the sweep of its non-clobbered descendants.
	*
	* NOTE (pending real-Chrome confirmation, see test/declarative-patch-probe
	* .html Q1): this mirrors the existing policy of keeping `for` on
	* <label>/<output>. If the shipping feature can drive a patch through a
	* surviving `for`-on-label/output + `id` pair, this pre-pass and the
	* attribute check at _isBasicCustomElement's caller must additionally drop
	* that pair on the IN_PLACE path. Left as-is until the taxonomy is verified.
	*
	* @param root the in-place root to sweep
	*/
	const _neutralizePatchLinkage = function _neutralizePatchLinkage(root) {
		if (!SAFE_FOR_XML) return;
		const stack = [root];
		while (stack.length > 0) {
			const node = stack.pop();
			const nodeType = getNodeType ? getNodeType(node) : node.nodeType;
			if (nodeType === NODE_TYPE.processingInstruction || nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, node.data)) {
				try {
					remove(node);
				} catch (_) {}
				continue;
			}
			if (nodeType === NODE_TYPE.element) {
				const element = node;
				const lcTag = transformCaseFunc(getNodeName ? getNodeName(node) : node.nodeName);
				try {
					if (element.hasAttribute && element.hasAttribute("patchsrc")) element.removeAttribute("patchsrc");
					if (element.hasAttribute && element.hasAttribute("for") && lcTag !== "label" && lcTag !== "output") element.removeAttribute("for");
				} catch (_) {}
			}
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push(childNodes[i]);
		}
	};
	/**
	* _initDocument
	*
	* @param dirty - a string of dirty markup
	* @return a DOM, filled with the dirty markup
	*/
	const _initDocument = function _initDocument(dirty) {
		let doc = null;
		let leadingWhitespace = null;
		if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
		else {
			const matches = stringMatch(dirty, /^[\r\n\t ]+/);
			leadingWhitespace = matches && matches[0];
		}
		if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) dirty = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + dirty + "</body></html>";
		const dirtyPayload = trustedTypesPolicy ? _createTrustedHTML(dirty) : dirty;
		if (NAMESPACE === HTML_NAMESPACE) try {
			doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
		} catch (_) {}
		if (!doc || !doc.documentElement) {
			doc = implementation.createDocument(NAMESPACE, "template", null);
			try {
				doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
			} catch (_) {}
		}
		const body = doc.body || doc.documentElement;
		if (dirty && leadingWhitespace) body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
		if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
		return WHOLE_DOCUMENT ? doc.documentElement : body;
	};
	/**
	* Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
	*
	* @param root The root element or node to start traversing on.
	* @return The created NodeIterator
	*/
	const _createNodeIterator = function _createNodeIterator(root) {
		const doc = getOwnerDocument ? getOwnerDocument(root) : root.ownerDocument;
		return createNodeIterator.call(doc || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
	};
	/**
	* Replace template expression syntax (mustache, ERB, template
	* literal) with a space; shared by all SAFE_FOR_TEMPLATES scrub
	* sites. Order matters: mustache, then ERB, then template literal.
	*
	* @param value the string to scrub
	* @returns the scrubbed string
	*/
	const _stripTemplateExpressions = function _stripTemplateExpressions(value) {
		value = stringReplace(value, MUSTACHE_EXPR$1, " ");
		value = stringReplace(value, ERB_EXPR$1, " ");
		value = stringReplace(value, TMPLIT_EXPR$1, " ");
		return value;
	};
	/**
	* Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
	* character data of an element subtree. Used as the final safety net for
	* SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
	* which only form after text-node normalization (e.g. fragments split across
	* stripped elements) cannot survive into a template-evaluating framework.
	*
	* Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
	* in place rather than round-tripping through innerHTML. This preserves
	* descendant node references (important for IN_PLACE callers), avoids a
	* serialize/reparse cycle, and reads literal character data — which means
	* `<%...%>` in text content matches the ERB regex against its real bytes
	* instead of the HTML-entity-escaped form innerHTML would produce.
	*
	* Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
	* attributes is performed during the per-node `_sanitizeAttributes` pass.
	*
	* @param node The root element whose character data should be scrubbed.
	*/
	const _scrubTemplateExpressions2 = function _scrubTemplateExpressions(node) {
		var _node$querySelectorAl;
		node.normalize();
		const doc = getOwnerDocument ? getOwnerDocument(node) : node.ownerDocument;
		const walker = createNodeIterator.call(doc || node, node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_CDATA_SECTION | NodeFilter.SHOW_PROCESSING_INSTRUCTION, null);
		let currentNode = walker.nextNode();
		while (currentNode) {
			currentNode.data = _stripTemplateExpressions(currentNode.data);
			currentNode = walker.nextNode();
		}
		const templates = (_node$querySelectorAl = node.querySelectorAll) === null || _node$querySelectorAl === void 0 ? void 0 : _node$querySelectorAl.call(node, "template");
		if (templates) arrayForEach(templates, (tmpl) => {
			if (_isDocumentFragment(tmpl.content)) _scrubTemplateExpressions2(tmpl.content);
		});
	};
	/**
	* _isClobbered
	*
	* Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
	* interface with [LegacyOverrideBuiltIns]; a descendant element with a
	* `name` attribute matching a prototype property shadows that property
	* on direct reads. We use this check at the IN_PLACE entry-point and
	* during attribute sanitization to refuse clobbered forms.
	*
	* @param element element to check for clobbering attacks
	* @return true if clobbered, false if safe
	*/
	const _isClobbered = function _isClobbered(element) {
		const realTagName = getNodeName ? getNodeName(element) : null;
		if (typeof realTagName !== "string") return false;
		if (transformCaseFunc(realTagName) !== "form") return false;
		return typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || element.attributes !== getAttributes(element) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function" || element.nodeType !== getNodeType(element) || element.childNodes !== getChildNodes(element);
	};
	/**
	* Checks whether the given value is a DocumentFragment from any realm.
	*
	* The realm-independent replacement reads `nodeType` through the cached
	* Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
	* constant (11). nodeType is a numeric value resolved from the node's
	* internal slot, identical across realms for the same kind of node.
	*
	* @param value object to check
	* @return true if value is a DocumentFragment-shaped node from any realm
	*/
	const _isDocumentFragment = function _isDocumentFragment(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return getNodeType(value) === NODE_TYPE.documentFragment;
		} catch (_) {
			return false;
		}
	};
	/**
	* Checks whether the given object is a DOM node, including nodes that
	* originate from a different window/realm (e.g. an iframe's
	* contentDocument). The previous `value instanceof Node` check was
	* realm-bound: nodes from a different window failed it, causing
	* sanitize() to silently stringify them and reset IN_PLACE to false,
	* returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
	*
	* @param value object to check whether it's a DOM node
	* @return true if value is a DOM node from any realm
	*/
	const _isNode = function _isNode(value) {
		if (!getNodeType || typeof value !== "object" || value === null) return false;
		try {
			return typeof getNodeType(value) === "number";
		} catch (_) {
			return false;
		}
	};
	function _executeHooks(hooks, currentNode, data) {
		if (hooks.length === 0) return;
		arrayForEach(hooks, (hook) => {
			hook.call(DOMPurify, currentNode, data, CONFIG);
		});
	}
	/**
	* Structural-threat checks that condemn a node regardless of the
	* allowlists: mXSS via namespace confusion, risky CSS construction,
	* processing instructions, markup-bearing comments. Pure predicate;
	* the caller removes. Check order is load-bearing.
	*
	* @param currentNode the node to inspect
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node must be removed
	*/
	const _isUnsafeNode = function _isUnsafeNode(currentNode, tagName) {
		if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.textContent) && regExpTest(ELEMENT_MARKUP_PROBE, currentNode.innerHTML)) return true;
		if (SAFE_FOR_XML && currentNode.namespaceURI === HTML_NAMESPACE && tagName === "style" && _isNode(currentNode.firstElementChild)) return true;
		if (currentNode.nodeType === NODE_TYPE.processingInstruction) return true;
		if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(COMMENT_MARKUP_PROBE, currentNode.data)) return true;
		return false;
	};
	/**
	* Handle a node whose tag is forbidden or not allowlisted: keep
	* allowed custom elements (false return exits _sanitizeElements
	* early - the namespace and fallback-tag removal checks are
	* intentionally skipped for kept custom elements), else hoist
	* content per KEEP_CONTENT and remove.
	*
	* A kept custom element is the ONLY case in which this function
	* returns false, so the caller uses that return value to run the
	* afterSanitizeElements hook on the kept element and keep the
	* element-hook lifecycle consistent with normal allowlisted
	* elements (GHSA-c2j3-45gr-mqc4).
	*
	* @param currentNode the disallowed node
	* @param tagName the node's transformCaseFunc'd tag name
	* @return true if the node was removed, false if kept
	*/
	const _sanitizeDisallowedNode = function _sanitizeDisallowedNode(currentNode, tagName, root) {
		if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
			if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
			if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
		}
		if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
			const parentNode = getParentNode(currentNode);
			const childNodes = getChildNodes(currentNode);
			if (childNodes && parentNode) {
				const childCount = childNodes.length;
				for (let i = childCount - 1; i >= 0; --i) {
					const hoisted = currentNode === root ? cloneNode(childNodes[i], true) : childNodes[i];
					parentNode.insertBefore(hoisted, getNextSibling(currentNode));
				}
			}
		}
		_forceRemove(currentNode);
		return true;
	};
	/**
	* Fork a hook-mutable allowlist off its shared binding the first time a
	* (possibly lazily-installed) uponSanitize* hook is about to see it, so the
	* hook cannot widen the per-instance default or the setConfig binding by
	* reference and leak past the call. Returns the set unchanged once it is
	* already call-local, so repeated calls across elements are idempotent.
	*
	* @param hookList the uponSanitize* hook array for this event
	* @param set the current ALLOWED_TAGS / ALLOWED_ATTR binding
	* @param defaultSet the per-instance DEFAULT_ALLOWED_* constant
	* @param setConfigSet the captured setConfig() binding, or null
	* @return a call-local clone if a hook is present and set is still shared,
	*   else set unchanged
	*/
	const _forkSharedAllowlist = function _forkSharedAllowlist(hookList, set, defaultSet, setConfigSet) {
		if (hookList.length === 0) return set;
		return set === defaultSet || set === setConfigSet ? clone(set) : set;
	};
	/**
	* _sanitizeElements
	*
	* @protect nodeName
	* @protect textContent
	* @protect removeChild
	* @param currentNode to check for permission to exist
	* @return true if node was killed, false if left alive
	*/
	const _sanitizeElements = function _sanitizeElements(currentNode, root) {
		_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
		if (currentNode !== root && getParentNode(currentNode) === null) {
			if (IN_PLACE) _neutralizeSubtree(currentNode);
			return true;
		}
		if (_isClobbered(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		const tagName = transformCaseFunc(getNodeName ? getNodeName(currentNode) : currentNode.nodeName);
		ALLOWED_TAGS = _forkSharedAllowlist(hooks.uponSanitizeElement, ALLOWED_TAGS, DEFAULT_ALLOWED_TAGS, SET_CONFIG_ALLOWED_TAGS);
		_executeHooks(hooks.uponSanitizeElement, currentNode, {
			tagName,
			allowedTags: ALLOWED_TAGS
		});
		if (currentNode !== root && getParentNode(currentNode) === null) {
			if (IN_PLACE) _neutralizeSubtree(currentNode);
			return true;
		}
		if (_isUnsafeNode(currentNode, tagName)) {
			_forceRemove(currentNode);
			return true;
		}
		if (FORBID_TAGS[tagName] || !(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && !ALLOWED_TAGS[tagName]) {
			const removed = _sanitizeDisallowedNode(currentNode, tagName, root);
			if (removed === false) _executeHooks(hooks.afterSanitizeElements, currentNode, null);
			return removed;
		}
		if ((getNodeType ? getNodeType(currentNode) : currentNode.nodeType) === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
			_forceRemove(currentNode);
			return true;
		}
		if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(FALLBACK_TAG_CLOSE, currentNode.innerHTML)) {
			_forceRemove(currentNode);
			return true;
		}
		if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
			const content = _stripTemplateExpressions(currentNode.textContent);
			if (currentNode.textContent !== content) {
				arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
				currentNode.textContent = content;
			}
		}
		_executeHooks(hooks.afterSanitizeElements, currentNode, null);
		return false;
	};
	/**
	* _isValidAttribute
	*
	* @param lcTag Lowercase tag name of containing element.
	* @param lcName Lowercase attribute name.
	* @param value Attribute value.
	* @return Returns true if `value` is valid, otherwise false.
	*/
	const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
		if (FORBID_ATTR[lcName]) return false;
		if (SAFE_FOR_XML && lcName === "patchsrc") return false;
		if (SAFE_FOR_XML && lcName === "for" && lcTag !== "label" && lcTag !== "output") return false;
		if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) return false;
		const nameIsPermitted = ALLOWED_ATTR[lcName] || EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag);
		if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$1, lcName));
		else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName));
		else if (!nameIsPermitted) {
			if (_isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) || lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value)));
			else return false;
		} else if (URI_SAFE_ATTRIBUTES[lcName]);
		else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, "")));
		else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]);
		else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, "")));
		else if (value) return false;
		return true;
	};
	const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]);
	/**
	* _isBasicCustomElement
	* checks if at least one dash is included in tagName, and it's not the first char
	* for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	*
	* @param tagName name of the tag of the node to sanitize
	* @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
	*/
	const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
		return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
	};
	/**
	* Wrap an attribute value in the matching Trusted Types object when
	* the active policy requires it. Namespaced attributes pass through
	* unchanged (no TT support yet, see
	* https://bugs.chromium.org/p/chromium/issues/detail?id=1305293).
	*
	* @param lcTag lowercase tag name of the containing element
	* @param lcName lowercase attribute name
	* @param namespaceURI the attribute's namespace, if any
	* @param value the attribute value to wrap
	* @return the value, wrapped when Trusted Types demand it
	*/
	const _applyTrustedTypesToAttribute = function _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value) {
		if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function" && !namespaceURI) switch (trustedTypes.getAttributeType(lcTag, lcName)) {
			case "TrustedHTML": return _createTrustedHTML(value);
			case "TrustedScriptURL": return _createTrustedScriptURL(value);
		}
		return value;
	};
	/**
	* Write a modified attribute value back onto the element. On
	* success, re-probe for clobbering introduced by the new value and
	* remove the element when found; otherwise pop the removal entry
	* recorded by the earlier _removeAttribute (long-standing pairing
	* with the SANITIZE_NAMED_PROPS path - do not "fix" casually). On
	* failure, remove the attribute instead.
	*
	* @param currentNode the element carrying the attribute
	* @param name the attribute name as present on the element
	* @param namespaceURI the attribute's namespace, if any
	* @param value the new attribute value
	*/
	const _setAttributeValue = function _setAttributeValue(currentNode, name, namespaceURI, value) {
		try {
			if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
			else currentNode.setAttribute(name, value);
			if (_isClobbered(currentNode)) _forceRemove(currentNode);
			else arrayPop(DOMPurify.removed);
		} catch (_) {
			_removeAttribute(name, currentNode);
		}
	};
	/**
	* _sanitizeAttributes
	*
	* @protect attributes
	* @protect nodeName
	* @protect removeAttribute
	* @protect setAttribute
	*
	* @param currentNode to sanitize
	*/
	const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
		_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
		const attributes = currentNode.attributes;
		if (!attributes || _isClobbered(currentNode)) return;
		ALLOWED_ATTR = _forkSharedAllowlist(hooks.uponSanitizeAttribute, ALLOWED_ATTR, DEFAULT_ALLOWED_ATTR, SET_CONFIG_ALLOWED_ATTR);
		const hookEvent = {
			attrName: "",
			attrValue: "",
			keepAttr: true,
			allowedAttributes: ALLOWED_ATTR,
			forceKeepAttr: void 0
		};
		let l = attributes.length;
		const lcTag = transformCaseFunc(currentNode.nodeName);
		while (l--) {
			const attr = attributes[l];
			const name = attr.name, namespaceURI = attr.namespaceURI, attrValue = attr.value;
			const lcName = transformCaseFunc(name);
			const initValue = attrValue;
			let value = name === "value" ? initValue : stringTrim(initValue);
			hookEvent.attrName = lcName;
			hookEvent.attrValue = value;
			hookEvent.keepAttr = true;
			hookEvent.forceKeepAttr = void 0;
			_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
			value = hookEvent.attrValue;
			if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name") && stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0) {
				_removeAttribute(name, currentNode);
				value = SANITIZE_NAMED_PROPS_PREFIX + value;
			}
			if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (lcName === "attributename" && stringMatch(value, "href")) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (hookEvent.forceKeepAttr) continue;
			if (!hookEvent.keepAttr) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(SELF_CLOSING_TAG, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			if (SAFE_FOR_TEMPLATES) value = _stripTemplateExpressions(value);
			if (!_isValidAttribute(lcTag, lcName, value)) {
				_removeAttribute(name, currentNode);
				continue;
			}
			value = _applyTrustedTypesToAttribute(lcTag, lcName, namespaceURI, value);
			if (value !== initValue) _setAttributeValue(currentNode, name, namespaceURI, value);
		}
		_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
	};
	/**
	* _sanitizeShadowDOM
	*
	* @param fragment to iterate over recursively
	*/
	const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
		let shadowNode = null;
		const shadowIterator = _createNodeIterator(fragment);
		_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
		while (shadowNode = shadowIterator.nextNode()) {
			_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
			_sanitizeElements(shadowNode, fragment);
			_sanitizeAttributes(shadowNode);
			if (_isDocumentFragment(shadowNode.content)) _sanitizeShadowDOM2(shadowNode.content);
			if ((getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType) === NODE_TYPE.element) {
				const innerSr = getShadowRoot(shadowNode);
				if (_isDocumentFragment(innerSr)) {
					_sanitizeAttachedShadowRoots(innerSr);
					_sanitizeShadowDOM2(innerSr);
				}
			}
		}
		_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
	};
	/**
	* _sanitizeAttachedShadowRoots
	*
	* Walks `root` and feeds every attached shadow root we encounter into
	* the existing _sanitizeShadowDOM pipeline. The default node iterator
	* does not descend into shadow trees, so nodes inside an attached
	* shadow root would otherwise be skipped entirely.
	*
	* Two real input paths put attached shadow roots in front of us:
	*   1. IN_PLACE on a DOM node that already has shadow roots attached.
	*   2. DOM-node input where importNode(dirty, true) deep-clones the
	*      shadow root because it was created with `clonable: true`.
	*
	* This pass runs once, up front, so the main iteration loop (and the
	* existing _sanitizeShadowDOM template-content recursion) stay
	* untouched — string-input paths are not affected.
	*
	* @param root the subtree root to walk for attached shadow roots
	*/
	const _sanitizeAttachedShadowRoots = function _sanitizeAttachedShadowRoots(root) {
		const stack = [{
			node: root,
			shadow: null
		}];
		while (stack.length > 0) {
			const item = stack.pop();
			if (item.shadow) {
				_sanitizeShadowDOM2(item.shadow);
				continue;
			}
			const node = item.node;
			const isElement = (getNodeType ? getNodeType(node) : node.nodeType) === NODE_TYPE.element;
			const childNodes = getChildNodes(node);
			if (childNodes) for (let i = childNodes.length - 1; i >= 0; --i) stack.push({
				node: childNodes[i],
				shadow: null
			});
			if (isElement) {
				const rootName = getNodeName ? getNodeName(node) : null;
				if (typeof rootName === "string" && transformCaseFunc(rootName) === "template") {
					const content = node.content;
					if (_isDocumentFragment(content)) stack.push({
						node: content,
						shadow: null
					});
				}
			}
			if (isElement) {
				const sr = getShadowRoot(node);
				if (_isDocumentFragment(sr)) stack.push({
					node: null,
					shadow: sr
				}, {
					node: sr,
					shadow: null
				});
			}
		}
	};
	DOMPurify.sanitize = function(dirty) {
		let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		let body = null;
		let importedNode = null;
		let currentNode = null;
		let returnNode = null;
		IS_EMPTY_INPUT = !dirty;
		if (IS_EMPTY_INPUT) dirty = "<!-->";
		if (typeof dirty !== "string" && !_isNode(dirty)) {
			dirty = stringifyValue(dirty);
			if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
		}
		if (!DOMPurify.isSupported) return dirty;
		if (SET_CONFIG) {
			ALLOWED_TAGS = SET_CONFIG_ALLOWED_TAGS;
			ALLOWED_ATTR = SET_CONFIG_ALLOWED_ATTR;
		} else _parseConfig(cfg);
		if (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) ALLOWED_TAGS = clone(ALLOWED_TAGS);
		if (hooks.uponSanitizeAttribute.length > 0) ALLOWED_ATTR = clone(ALLOWED_ATTR);
		DOMPurify.removed = [];
		const inPlace = IN_PLACE && typeof dirty !== "string" && _isNode(dirty);
		if (inPlace) {
			_neutralizePatchLinkage(dirty);
			const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
			if (typeof nn === "string") {
				const tagName = transformCaseFunc(nn);
				if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
					_neutralizeRoot(dirty);
					throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
				}
			}
			if (_isClobbered(dirty)) {
				_neutralizeRoot(dirty);
				throw typeErrorCreate("root node is clobbered and cannot be sanitized in-place");
			}
			try {
				_sanitizeAttachedShadowRoots(dirty);
			} catch (error) {
				_neutralizeRoot(dirty);
				throw error;
			}
		} else if (_isNode(dirty)) {
			body = _initDocument("<!---->");
			importedNode = body.ownerDocument.importNode(dirty, true);
			if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") body = importedNode;
			else if (importedNode.nodeName === "HTML") body = importedNode;
			else body.appendChild(importedNode);
			_sanitizeAttachedShadowRoots(importedNode);
		} else {
			if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(dirty) : dirty;
			body = _initDocument(dirty);
			if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
		}
		if (body && FORCE_BODY) _forceRemove(body.firstChild);
		const walkRoot = inPlace ? dirty : body;
		try {
			const nodeIterator = _createNodeIterator(walkRoot);
			while (currentNode = nodeIterator.nextNode()) {
				_sanitizeElements(currentNode, walkRoot);
				_sanitizeAttributes(currentNode);
				if (_isDocumentFragment(currentNode.content)) _sanitizeShadowDOM2(currentNode.content);
			}
		} catch (error) {
			if (inPlace) {
				_neutralizeRoot(dirty);
				arrayForEach(DOMPurify.removed, (entry) => {
					if (entry.element) _neutralizeSubtree(entry.element);
				});
			}
			throw error;
		}
		if (inPlace) {
			arrayForEach(DOMPurify.removed, (entry) => {
				if (entry.element) _neutralizeSubtree(entry.element);
			});
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(dirty);
			return dirty;
		}
		if (RETURN_DOM) {
			if (SAFE_FOR_TEMPLATES) _scrubTemplateExpressions2(body);
			if (RETURN_DOM_FRAGMENT) {
				returnNode = createDocumentFragment.call(body.ownerDocument);
				while (body.firstChild) returnNode.appendChild(body.firstChild);
			} else returnNode = body;
			if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) returnNode = importNode.call(originalDocument, returnNode, true);
			return returnNode;
		}
		let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
		if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
		if (SAFE_FOR_TEMPLATES) serializedHTML = _stripTemplateExpressions(serializedHTML);
		return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? _createTrustedHTML(serializedHTML) : serializedHTML;
	};
	DOMPurify.setConfig = function() {
		let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		_parseConfig(cfg);
		SET_CONFIG = true;
		SET_CONFIG_ALLOWED_TAGS = ALLOWED_TAGS;
		SET_CONFIG_ALLOWED_ATTR = ALLOWED_ATTR;
	};
	DOMPurify.clearConfig = function() {
		CONFIG = null;
		SET_CONFIG = false;
		SET_CONFIG_ALLOWED_TAGS = null;
		SET_CONFIG_ALLOWED_ATTR = null;
		trustedTypesPolicy = defaultTrustedTypesPolicy;
		emptyHTML = "";
	};
	DOMPurify.isValidAttribute = function(tag, attr, value) {
		if (!CONFIG) _parseConfig({});
		const lcTag = transformCaseFunc(tag);
		const lcName = transformCaseFunc(attr);
		return _isValidAttribute(lcTag, lcName, value);
	};
	DOMPurify.addHook = function(entryPoint, hookFunction) {
		if (typeof hookFunction !== "function") return;
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		arrayPush(hooks[entryPoint], hookFunction);
	};
	DOMPurify.removeHook = function(entryPoint, hookFunction) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		if (hookFunction !== void 0) {
			const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
			return index === -1 ? void 0 : arraySplice(hooks[entryPoint], index, 1)[0];
		}
		return arrayPop(hooks[entryPoint]);
	};
	DOMPurify.removeHooks = function(entryPoint) {
		if (!objectHasOwnProperty(hooks, entryPoint)) return;
		hooks[entryPoint] = [];
	};
	DOMPurify.removeAllHooks = function() {
		hooks = _createHooksMap();
	};
	return DOMPurify;
}
var purify = createDOMPurify();
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region node_modules/.pnpm/marked@18.0.9/node_modules/marked/lib/marked.esm.js
var _Class;
/**
* marked v18.0.9 - a markdown parser
* Copyright (c) 2018-2026, MarkedJS. (MIT License)
* Copyright (c) 2011-2018, Christopher Jeffrey. (MIT License)
* https://github.com/markedjs/marked
*/
/**
* DO NOT EDIT THIS FILE
* The code in this file is generated from files in ./src/
*/
function C() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var R = C();
function j(l) {
	R = l;
}
var z = { exec: () => null };
function A(l) {
	let e = [];
	return (t) => {
		let n = Math.max(0, Math.min(3, t - 1)), s = e[n];
		return s || (s = l(n), e[n] = s), s;
	};
}
function k(l, e = "") {
	let t = typeof l == "string" ? l : l.source, n = {
		replace: (s, r) => {
			let i = typeof r == "string" ? r : r.source;
			return i = i.replace(m.caret, "$1"), t = t.replace(s, i), n;
		},
		getRegex: () => new RegExp(t, e)
	};
	return n;
}
var Te = ((l = "") => {
	try {
		return !!new RegExp("(?<=1)(?<!1)" + l);
	} catch {
		return !1;
	}
})();
var m = {
	codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
	outputLinkReplace: /\\([\[\]])/g,
	indentCodeCompensation: /^(\s+)(?:```)/,
	beginningSpace: /^\s+/,
	endingHash: /#$/,
	startingSpaceChar: /^ /,
	endingSpaceChar: / $/,
	nonSpaceChar: /[^ ]/,
	newLineCharGlobal: /\n/g,
	tabCharGlobal: /\t/g,
	multipleSpaceGlobal: /\s+/g,
	blankLine: /^[ \t]*$/,
	doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
	blockquoteStart: /^ {0,3}>/,
	blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
	blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
	listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
	listIsTask: /^\[[ xX]\] +\S/,
	listReplaceTask: /^\[[ xX]\] +/,
	listTaskCheckbox: /\[[ xX]\]/,
	anyLine: /\n.*\n/,
	hrefBrackets: /^<(.*)>$/,
	tableDelimiter: /[:|]/,
	tableAlignChars: /^\||\| *$/g,
	tableRowBlankLine: /\n[ \t]*$/,
	tableAlignRight: /^ *-+: *$/,
	tableAlignCenter: /^ *:-+: *$/,
	tableAlignLeft: /^ *:-+ *$/,
	startATag: /^<a /i,
	endATag: /^<\/a>/i,
	startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
	endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
	startAngleBracket: /^</,
	endAngleBracket: />$/,
	pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
	unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
	escapeTest: /[&<>"']/,
	escapeReplace: /[&<>"']/g,
	escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
	escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
	caret: /(^|[^\[])\^/g,
	percentDecode: /%25/g,
	findPipe: /\|/g,
	splitPipe: / \|/,
	slashPipe: /\\\|/g,
	carriageReturn: /\r\n|\r/g,
	spaceLine: /^ +$/gm,
	notSpaceStart: /^\S*/,
	endingNewline: /\n$/,
	listItemRegex: (l) => new RegExp(`^( {0,3}${l})((?:[	 ][^\\n]*)?(?:\\n|$))`),
	nextBulletRegex: A((l) => new RegExp(`^ {0,${l}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),
	hrRegex: A((l) => new RegExp(`^ {0,${l}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),
	fencesBeginRegex: A((l) => new RegExp(`^ {0,${l}}(?:\`\`\`|~~~)`)),
	headingBeginRegex: A((l) => new RegExp(`^ {0,${l}}#`)),
	htmlBeginRegex: A((l) => new RegExp(`^ {0,${l}}<(?:[a-z].*>|!--)`, "i")),
	blockquoteBeginRegex: A((l) => new RegExp(`^ {0,${l}}>`))
};
var Oe = /^(?:[ \t]*(?:\n|$))+/;
var we = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
var ye = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
var q = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
var Pe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
var U = / {0,3}(?:[*+-]|\d{1,9}[.)])/;
var oe = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
var ae = k(oe).replace(/bull/g, U).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
var Se = k(oe).replace(/bull/g, U).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
var K = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/;
var _e = /^[^\n]+/;
var W = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
var $e = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", W).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
var Le = k(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, U).getRegex();
var Q = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
var X = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
var Me = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", X).replace("tag", Q).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
var le = (l) => k(K).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list", l).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex();
var ze = le(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/);
var Ee = le(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/);
var J = {
	blockquote: k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Ee).getRegex(),
	code: we,
	def: $e,
	fences: ye,
	heading: Pe,
	hr: q,
	html: Me,
	lheading: ae,
	list: Le,
	newline: Oe,
	paragraph: ze,
	table: z,
	text: _e
};
var se = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex();
var Ae = {
	...J,
	lheading: Se,
	table: se,
	paragraph: k(K).replace("hr", q).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", se).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Q).getRegex()
};
var Ie = {
	...J,
	html: k(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", X).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: z,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: k(K).replace("hr", q).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ae).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
var Be = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
var De = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
var pe = /^( {2,}|\\)\n(?!\s*$)/;
var qe = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
var _ = /[\p{P}\p{S}]/u;
var I = /[\s\p{P}\p{S}]/u;
var v = /[^\s\p{P}\p{S}]/u;
var ve = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, I).getRegex();
var He = /[\p{Pi}\p{Ps}"']/u;
var ue = /(?!~)[\p{P}\p{S}]/u;
var Ze = /(?!~)[\s\p{P}\p{S}]/u;
var Ge = /(?:[^\s\p{P}\p{S}]|~)/u;
var Qe = k(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Te ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
var ce = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/;
var Ne = k(ce, "u").replace(/punct/g, _).getRegex();
var je = k(ce, "u").replace(/punct/g, ue).getRegex();
var Ue = k(/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, "u").replace(/openQuote/g, He).replace(/punct/g, _).getRegex();
var he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
var Ke = k(he, "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex();
var We = k(he, "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, Ze).replace(/punct/g, ue).getRegex();
var Je = k("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex();
var Ve = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex();
var et = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex();
var tt = k(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, _).getRegex();
var rt = k("^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", "gu").replace(/notPunctSpace/g, v).replace(/punctSpace/g, I).replace(/punct/g, _).getRegex();
var st = k(/\\(punct)/, "gu").replace(/punct/g, _).getRegex();
var it = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
var ot = k(X).replace("(?:-->|$)", "-->").getRegex();
var at = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ot).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
var G = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/;
var lt = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", G).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
var de = k(/^!?\[(label)\]\[(ref)\]/).replace("label", G).replace("ref", W).getRegex();
var ke = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", W).getRegex();
var pt = k("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", ke).getRegex();
var ie = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
var V = {
	_backpedal: z,
	anyPunctuation: st,
	autolink: it,
	blockSkip: Qe,
	br: pe,
	code: De,
	del: z,
	delLDelim: z,
	delRDelim: z,
	emStrongLDelim: Ne,
	emStrongRDelimAst: Ke,
	emStrongRDelimUnd: Ve,
	escape: Be,
	link: lt,
	nolink: ke,
	punctuation: ve,
	reflink: de,
	reflinkSearch: pt,
	tag: at,
	text: qe,
	url: z
};
var ut = {
	...V,
	emStrongLDelim: Ue,
	emStrongRDelimAst: Je,
	emStrongRDelimUnd: et,
	link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", G).getRegex(),
	reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", G).getRegex()
};
var F = {
	...V,
	emStrongRDelimAst: We,
	emStrongLDelim: je,
	delLDelim: tt,
	delRDelim: rt,
	url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ie).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
	text: k(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ie).getRegex()
};
var ct = {
	...F,
	br: k(pe).replace("{2,}", "*").getRegex(),
	text: k(F.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
var H = {
	normal: J,
	gfm: Ae,
	pedantic: Ie
};
var B = {
	normal: V,
	gfm: F,
	breaks: ct,
	pedantic: ut
};
var ht = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
var ge = (l) => ht[l];
function O(l, e) {
	if (e) {
		if (m.escapeTest.test(l)) return l.replace(m.escapeReplace, ge);
	} else if (m.escapeTestNoEncode.test(l)) return l.replace(m.escapeReplaceNoEncode, ge);
	return l;
}
function Y(l) {
	try {
		l = encodeURI(l).replace(m.percentDecode, "%");
	} catch {
		return null;
	}
	return l;
}
function ee(l, e) {
	let n = l.replace(m.findPipe, (r, i, o) => {
		let p = !1, a = i;
		for (; --a >= 0 && o[a] === "\\";) p = !p;
		return p ? "|" : " |";
	}).split(m.splitPipe), s = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e) if (n.length > e) n.splice(e);
	else for (; n.length < e;) n.push("");
	for (; s < n.length; s++) n[s] = n[s].trim().replace(m.slashPipe, "|");
	return n;
}
function $(l, e, t) {
	let n = l.length;
	if (n === 0) return "";
	let s = 0;
	for (; s < n;) {
		let r = l.charAt(n - s - 1);
		if (r === e && !t) s++;
		else if (r !== e && t) s++;
		else break;
	}
	return l.slice(0, n - s);
}
function te(l) {
	let e = l.split(`
`), t = e.length - 1;
	for (; t >= 0 && m.blankLine.test(e[t]);) t--;
	return e.length - t <= 2 ? l : e.slice(0, t + 1).join(`
`);
}
function fe(l, e) {
	if (l.indexOf(e[1]) === -1) return -1;
	let t = 0;
	for (let n = 0; n < l.length; n++) if (l[n] === "\\") n++;
	else if (l[n] === e[0]) t++;
	else if (l[n] === e[1] && (t--, t < 0)) return n;
	return t > 0 ? -2 : -1;
}
function me(l, e = 0) {
	let t = e, n = "";
	for (let s of l) if (s === "	") {
		let r = 4 - t % 4;
		n += " ".repeat(r), t += r;
	} else n += s, t++;
	return n;
}
function xe(l, e, t, n, s) {
	let r = e.href, i = e.title || null, o = l[1].replace(s.other.outputLinkReplace, "$1");
	n.state.inLink = !0;
	let p = {
		type: l[0].charAt(0) === "!" ? "image" : "link",
		raw: t,
		href: r,
		title: i,
		text: o,
		tokens: n.inlineTokens(o)
	};
	return n.state.inLink = !1, p;
}
function dt(l, e, t) {
	let n = l.match(t.other.indentCodeCompensation);
	if (n === null) return e;
	let s = n[1];
	return e.split(`
`).map((r) => {
		let i = r.match(t.other.beginningSpace);
		if (i === null) return r;
		let [o] = i;
		return o.length >= s.length ? r.slice(s.length) : r;
	}).join(`
`);
}
var y = class {
	constructor(e) {
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "rules", void 0);
		_defineProperty(this, "lexer", void 0);
		this.options = e || R;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let n = this.options.pedantic ? t[0] : te(t[0]);
			return {
				type: "code",
				raw: n,
				codeBlockStyle: "indented",
				text: n.replace(this.rules.other.codeRemoveIndent, "")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let n = t[0], s = dt(n, t[3] || "", this.rules);
			return {
				type: "code",
				raw: n,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: s
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let n = t[2].trim();
			if (this.rules.other.endingHash.test(n)) {
				let s = $(n, "#");
				(this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (n = s.trim());
			}
			return {
				type: "heading",
				raw: $(t[0], `
`),
				depth: t[1].length,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: $(t[0], `
`)
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let n = $(t[0], `
`).split(`
`), s = "", r = "", i = [];
			for (; n.length > 0;) {
				let o = !1, p = [], a;
				for (a = 0; a < n.length; a++) if (this.rules.other.blockquoteStart.test(n[a])) p.push(n[a]), o = !0;
				else if (!o) p.push(n[a]);
				else break;
				n = n.slice(a);
				let u = p.join(`
`), c = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
				s = s ? `${s}
${u}` : u, r = r ? `${r}
${c}` : c;
				let h = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = h, n.length === 0) break;
				let d = i.at(-1);
				if (d?.type === "code") break;
				if (d?.type === "blockquote") {
					let T = d, g = n.join(`
`), w = T.raw + `
` + g.replace(this.rules.other.blockquoteSetextReplace2, ""), M = this.blockquote(w);
					i[i.length - 1] = M, s = `${s}
${g}`, r = r.substring(0, r.length - T.text.length) + M.text;
					break;
				} else if (d?.type === "list") {
					let T = d, g = T.raw + `
` + n.join(`
`), w = this.list(g);
					i[i.length - 1] = w, s = s.substring(0, s.length - d.raw.length) + w.raw, r = r.substring(0, r.length - T.raw.length) + w.raw, n = g.substring(i.at(-1).raw.length).split(`
`);
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: s,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), s = n.length > 1, r = {
				type: "list",
				raw: "",
				ordered: s,
				start: s ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = s ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = s ? n : "[*+-]");
			let i = this.rules.other.listItemRegex(n), o = !1;
			for (; e;) {
				let a = !1, u = "", c = "";
				if (!(t = i.exec(e)) || this.rules.block.hr.test(e)) break;
				u = t[0], e = e.substring(u.length);
				let h = me(t[2].split(`
`, 1)[0], t[1].length), d = e.split(`
`, 1)[0], T = !h.trim(), g = 0;
				if (this.options.pedantic ? (g = 2, c = h.trimStart()) : T ? g = t[1].length + 1 : (g = h.search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = h.slice(g), g += t[1].length), T && this.rules.other.blankLine.test(d) && (u += d + `
`, e = e.substring(d.length + 1), a = !0), !a) {
					let w = this.rules.other.nextBulletRegex(g), M = this.rules.other.hrRegex(g), ne = this.rules.other.fencesBeginRegex(g), re = this.rules.other.headingBeginRegex(g), be = this.rules.other.htmlBeginRegex(g), Re = this.rules.other.blockquoteBeginRegex(g);
					for (; e;) {
						let N = e.split(`
`, 1)[0], D;
						if (d = N, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), D = d) : D = d.replace(this.rules.other.tabCharGlobal, "    "), ne.test(d) || re.test(d) || be.test(d) || Re.test(d) || w.test(d) || M.test(d)) break;
						if (D.search(this.rules.other.nonSpaceChar) >= g || !d.trim()) c += `
` + D.slice(g);
						else {
							if (T || h.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ne.test(h) || re.test(h) || M.test(h)) break;
							c += `
` + d;
						}
						T = !d.trim(), u += N + `
`, e = e.substring(N.length + 1), h = D.slice(g);
					}
				}
				r.loose || (o ? r.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (o = !0)), r.items.push({
					type: "list_item",
					raw: u,
					task: !!this.options.gfm && this.rules.other.listIsTask.test(c),
					loose: !1,
					text: c,
					tokens: []
				}), r.raw += u;
			}
			let p = r.items.at(-1);
			if (p) p.raw = p.raw.trimEnd(), p.text = p.text.trimEnd();
			else return;
			r.raw = r.raw.trimEnd();
			for (let a of r.items) {
				this.lexer.state.top = !1, a.tokens = this.lexer.blockTokens(a.text, []);
				let u = a.tokens[0];
				if (a.task && (u?.type === "text" || u?.type === "paragraph")) {
					a.text = a.text.replace(this.rules.other.listReplaceTask, ""), u.raw = u.raw.replace(this.rules.other.listReplaceTask, ""), u.text = u.text.replace(this.rules.other.listReplaceTask, "");
					for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
						this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
						break;
					}
					let c = this.rules.other.listTaskCheckbox.exec(a.raw);
					if (c) {
						let h = {
							type: "checkbox",
							raw: c[0] + " ",
							checked: c[0] !== "[ ]"
						};
						a.checked = h.checked, r.loose ? a.tokens[0] && ["paragraph", "text"].includes(a.tokens[0].type) && "tokens" in a.tokens[0] && a.tokens[0].tokens ? (a.tokens[0].raw = h.raw + a.tokens[0].raw, a.tokens[0].text = h.raw + a.tokens[0].text, a.tokens[0].tokens.unshift(h)) : a.tokens.unshift({
							type: "paragraph",
							raw: h.raw,
							text: h.raw,
							tokens: [h]
						}) : a.tokens.unshift(h);
					}
				} else a.task && (a.task = !1);
				if (!r.loose) {
					let c = a.tokens.filter((d) => d.type === "space");
					r.loose = c.length > 0 && c.some((d) => this.rules.other.anyLine.test(d.raw));
				}
			}
			if (r.loose) for (let a of r.items) {
				a.loose = !0;
				for (let u of a.tokens) u.type === "text" && (u.type = "paragraph");
			}
			return r;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) {
			let n = te(t[0]);
			return {
				type: "html",
				block: !0,
				raw: n,
				pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
				text: n
			};
		}
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: n,
				raw: $(t[0], `
`),
				href: s,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
		let n = ee(t[1]), s = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = {
			type: "table",
			raw: $(t[0], `
`),
			header: [],
			align: [],
			rows: []
		};
		if (n.length === s.length) {
			for (let o of s) this.rules.other.tableAlignRight.test(o) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? i.align.push("left") : i.align.push(null);
			for (let o = 0; o < n.length; o++) i.header.push({
				text: n[o],
				tokens: this.lexer.inline(n[o]),
				header: !0,
				align: i.align[o]
			});
			for (let o of r) i.rows.push(ee(o, i.header.length).map((p, a) => ({
				text: p,
				tokens: this.lexer.inline(p),
				header: !1,
				align: i.align[a]
			})));
			return i;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) {
			let n = t[1].trim();
			return {
				type: "heading",
				raw: $(t[0], `
`),
				depth: t[2].charAt(0) === "=" ? 1 : 2,
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: n,
				tokens: this.lexer.inline(n)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: t[1]
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let n = t[2].trim();
			if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
				if (!this.rules.other.endAngleBracket.test(n)) return;
				let i = $(n.slice(0, -1), "\\");
				if ((n.length - i.length) % 2 === 0) return;
			} else {
				let i = fe(t[2], "()");
				if (i === -2) return;
				if (i > -1) {
					let p = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + i;
					t[2] = t[2].substring(0, i), t[0] = t[0].substring(0, p).trim(), t[3] = "";
				}
			}
			let s = t[2], r = "";
			if (this.options.pedantic) {
				let i = this.rules.other.pedanticHrefTitle.exec(s);
				i && (s = i[1], r = i[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? s = s.slice(1) : s = s.slice(1, -1)), xe(t, {
				href: s && s.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer, this.rules);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let r = t[(n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " ").toLowerCase()];
			if (!r) {
				let i = n[0].charAt(0);
				return {
					type: "text",
					raw: i,
					text: i
				};
			}
			return xe(n, r, n[0], this.lexer, this.rules);
		}
	}
	emStrong(e, t, n = "") {
		let s = this.rules.inline.emStrongLDelim.exec(e);
		if (!s || !s[1] && !s[2] && !s[3] && !s[4] || s[4] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
		if (!(s[1] || s[3] || "") || !n || this.rules.inline.punctuation.exec(n)) {
			let i = [...s[0]].length - 1, o, p, a = i, u = 0, c = s[0][0], h = n === c, d = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (d.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = d.exec(t)) !== null;) {
				if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o) continue;
				if (p = [...o].length, s[3] || s[4]) {
					a += p;
					continue;
				} else if (s[5] || s[6]) {
					if (i % 3 && !((i + p) % 3)) {
						u += p;
						continue;
					}
					if (h) break;
				}
				if (a -= p, a > 0) continue;
				p = Math.min(p, p + a + u);
				let T = [...s[0]][0].length, g = e.slice(0, i + s.index + T + p);
				if (Math.min(i, p) % 2) {
					let M = g.slice(1, -1);
					return {
						type: "em",
						raw: g,
						text: M,
						tokens: this.lexer.inlineTokens(M)
					};
				}
				let w = g.slice(2, -2);
				return {
					type: "strong",
					raw: g,
					text: w,
					tokens: this.lexer.inlineTokens(w)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
			return s && r && (n = n.substring(1, n.length - 1)), {
				type: "codespan",
				raw: t[0],
				text: n
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e, t, n = "") {
		let s = this.rules.inline.delLDelim.exec(e);
		if (!s) return;
		if (!(s[1] || "") || !n || this.rules.inline.punctuation.exec(n)) {
			let i = [...s[0]].length - 1, o, p, a = i, u = this.rules.inline.delRDelim;
			for (u.lastIndex = 0, t = t.slice(-1 * e.length + i); (s = u.exec(t)) !== null;) {
				if (o = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !o || (p = [...o].length, p !== i)) continue;
				if (s[3] || s[4]) {
					a += p;
					continue;
				}
				if (a -= p, a > 0) continue;
				p = Math.min(p, p + a);
				let c = [...s[0]][0].length, h = e.slice(0, i + s.index + c + p), d = h.slice(i, -i);
				return {
					type: "del",
					raw: h,
					text: d,
					tokens: this.lexer.inlineTokens(d)
				};
			}
		}
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let n, s;
			return t[2] === "@" ? (n = t[1], s = "mailto:" + n) : (n = t[1], s = n), {
				type: "link",
				raw: t[0],
				text: n,
				href: s,
				tokens: [{
					type: "text",
					raw: n,
					text: n
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let n, s;
			if (t[2] === "@") n = t[0], s = "mailto:" + n;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				n = t[0], t[1] === "www." ? s = "http://" + t[0] : s = t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: n,
				href: s,
				tokens: [{
					type: "text",
					raw: n,
					text: n
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let n = this.lexer.state.inRawBlock;
			return {
				type: "text",
				raw: t[0],
				text: t[0],
				escaped: n
			};
		}
	}
};
var x = class l {
	constructor(e) {
		_defineProperty(this, "tokens", void 0);
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "state", void 0);
		_defineProperty(this, "inlineQueue", void 0);
		_defineProperty(this, "tokenizer", void 0);
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || R, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let t = {
			other: m,
			block: H.normal,
			inline: B.normal
		};
		this.options.pedantic ? (t.block = H.pedantic, t.inline = B.pedantic) : this.options.gfm && (t.block = H.gfm, this.options.breaks ? t.inline = B.breaks : t.inline = B.gfm), this.tokenizer.rules = t;
	}
	static get rules() {
		return {
			block: H,
			inline: B
		};
	}
	static lex(e, t) {
		return new l(t).lex(e);
	}
	static lexInline(e, t) {
		return new l(t).inlineTokens(e);
	}
	lex(e) {
		e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
		for (let t = 0; t < this.inlineQueue.length; t++) {
			let n = this.inlineQueue[t];
			this.inlineTokens(n.src, n.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));
		let s = 1 / 0;
		for (; e;) {
			if (e.length < s) s = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			let r;
			if (this.options.extensions?.block?.some((o) => (r = o.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1)) continue;
			if (r = this.tokenizer.space(e)) {
				e = e.substring(r.raw.length);
				let o = t.at(-1);
				r.raw.length === 1 && o !== void 0 ? o.raw += `
` : t.push(r);
				continue;
			}
			if (r = this.tokenizer.code(e)) {
				e = e.substring(r.raw.length);
				let o = t.at(-1);
				o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.at(-1).src = o.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.fences(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.heading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.hr(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.blockquote(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.list(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.html(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.def(e)) {
				e = e.substring(r.raw.length);
				let o = t.at(-1);
				o?.type === "paragraph" || o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.raw, this.inlineQueue.at(-1).src = o.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
					href: r.href,
					title: r.title
				}, t.push(r));
				continue;
			}
			if (r = this.tokenizer.table(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.lheading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			let i = e;
			if (this.options.extensions?.startBlock) {
				let o = 1 / 0, p = e.slice(1), a;
				this.options.extensions.startBlock.forEach((u) => {
					a = u.call({ lexer: this }, p), typeof a == "number" && a >= 0 && (o = Math.min(o, a));
				}), o < 1 / 0 && o >= 0 && (i = e.substring(0, o + 1));
			}
			if (this.state.top && (r = this.tokenizer.paragraph(i))) {
				let o = t.at(-1);
				n && o?.type === "paragraph" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
				continue;
			}
			if (r = this.tokenizer.text(e)) {
				e = e.substring(r.raw.length);
				let o = t.at(-1);
				o?.type === "text" ? (o.raw += (o.raw.endsWith(`
`) ? "" : `
`) + r.raw, o.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = o.text) : t.push(r);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	inlineTokens(e, t = []) {
		this.tokenizer.lexer = this;
		let n = e;
		if (this.tokens.links) {
			let o = Object.keys(this.tokens.links);
			o.length > 0 && (n = n.replace(this.tokenizer.rules.inline.reflinkSearch, (p) => o.includes(p.slice(p.lastIndexOf("[") + 1, -1)) ? "[" + "a".repeat(p.length - 2) + "]" : p));
		}
		n = n.replace(this.tokenizer.rules.inline.anyPunctuation, "++"), n = n.replace(this.tokenizer.rules.inline.blockSkip, (o, p, a) => {
			let u = a ? a.length : 0;
			return o.slice(0, u) + "[" + "a".repeat(o.length - u - 2) + "]";
		}), n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
		let s = !1, r = "", i = 1 / 0;
		for (; e;) {
			if (e.length < i) i = e.length;
			else {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
			s || (r = ""), s = !1;
			let o;
			if (this.options.extensions?.inline?.some((a) => (o = a.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
			if (o = this.tokenizer.escape(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.tag(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.link(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(o.raw.length);
				let a = t.at(-1);
				o.type === "text" && a?.type === "text" ? (a.raw += o.raw, a.text += o.text) : t.push(o);
				continue;
			}
			if (o = this.tokenizer.emStrong(e, n, r)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.codespan(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.br(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.del(e, n, r)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (o = this.tokenizer.autolink(e)) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			if (!this.state.inLink && (o = this.tokenizer.url(e))) {
				e = e.substring(o.raw.length), t.push(o);
				continue;
			}
			let p = e;
			if (this.options.extensions?.startInline) {
				let a = 1 / 0, u = e.slice(1), c;
				this.options.extensions.startInline.forEach((h) => {
					c = h.call({ lexer: this }, u), typeof c == "number" && c >= 0 && (a = Math.min(a, c));
				}), a < 1 / 0 && a >= 0 && (p = e.substring(0, a + 1));
			}
			if (o = this.tokenizer.inlineText(p)) {
				e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (r = o.raw.slice(-1)), s = !0;
				let a = t.at(-1);
				a?.type === "text" ? (a.raw += o.raw, a.text += o.text) : t.push(o);
				continue;
			}
			if (e) {
				this.infiniteLoopError(e.charCodeAt(0));
				break;
			}
		}
		return t;
	}
	infiniteLoopError(e) {
		let t = "Infinite loop on byte: " + e;
		if (this.options.silent) console.error(t);
		else throw new Error(t);
	}
};
var P = class {
	constructor(e) {
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "parser", void 0);
		this.options = e || R;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let s = (t || "").match(m.notSpaceStart)?.[0], r = e.replace(m.endingNewline, "") + `
`;
		return s ? "<pre><code class=\"language-" + O(s) + "\">" + (n ? r : O(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : O(r, !0)) + `</code></pre>
`;
	}
	blockquote({ tokens: e }) {
		return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
	}
	html({ text: e }) {
		return e;
	}
	def(e) {
		return "";
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
	}
	hr(e) {
		return `<hr>
`;
	}
	list(e) {
		let t = e.ordered, n = e.start, s = "";
		for (let o = 0; o < e.items.length; o++) {
			let p = e.items[o];
			s += this.listitem(p);
		}
		let r = t ? "ol" : "ul", i = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + r + i + `>
` + s + "</" + r + `>
`;
	}
	listitem(e) {
		return `<li>${this.parser.parse(e.tokens)}</li>
`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\"> ";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>
`;
	}
	table(e) {
		let t = "", n = "";
		for (let r = 0; r < e.header.length; r++) n += this.tablecell(e.header[r]);
		t += this.tablerow({ text: n });
		let s = "";
		for (let r = 0; r < e.rows.length; r++) {
			let i = e.rows[r];
			n = "";
			for (let o = 0; o < i.length; o++) n += this.tablecell(i[o]);
			s += this.tablerow({ text: n });
		}
		return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + s + `</table>
`;
	}
	tablerow({ text: e }) {
		return `<tr>
${e}</tr>
`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${O(e, !0)}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let s = this.parser.parseInline(n), r = Y(e);
		if (r === null) return s;
		e = r;
		let i = "<a href=\"" + e + "\"";
		return t && (i += " title=\"" + O(t) + "\""), i += ">" + s + "</a>", i;
	}
	image({ href: e, title: t, text: n, tokens: s }) {
		s && (n = this.parser.parseInline(s, this.parser.textRenderer));
		let r = Y(e);
		if (r === null) return O(n);
		e = r;
		let i = `<img src="${e}" alt="${O(n)}"`;
		return t && (i += ` title="${O(t)}"`), i += ">", i;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : O(e.text);
	}
};
var L = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
	checkbox({ raw: e }) {
		return e;
	}
};
var b = class l {
	constructor(e) {
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "renderer", void 0);
		_defineProperty(this, "textRenderer", void 0);
		this.options = e || R, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new L();
	}
	static parse(e, t) {
		return new l(t).parse(e);
	}
	static parseInline(e, t) {
		return new l(t).parseInline(e);
	}
	parse(e) {
		this.renderer.parser = this;
		let t = "";
		for (let n = 0; n < e.length; n++) {
			let s = e[n];
			if (this.options.extensions?.renderers?.[s.type]) {
				let i = s, o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (o !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"checkbox",
					"html",
					"def",
					"paragraph",
					"text"
				].includes(i.type)) {
					t += o || "";
					continue;
				}
			}
			let r = s;
			switch (r.type) {
				case "space":
					t += this.renderer.space(r);
					break;
				case "hr":
					t += this.renderer.hr(r);
					break;
				case "heading":
					t += this.renderer.heading(r);
					break;
				case "code":
					t += this.renderer.code(r);
					break;
				case "table":
					t += this.renderer.table(r);
					break;
				case "blockquote":
					t += this.renderer.blockquote(r);
					break;
				case "list":
					t += this.renderer.list(r);
					break;
				case "checkbox":
					t += this.renderer.checkbox(r);
					break;
				case "html":
					t += this.renderer.html(r);
					break;
				case "def":
					t += this.renderer.def(r);
					break;
				case "paragraph":
					t += this.renderer.paragraph(r);
					break;
				case "text":
					t += this.renderer.text(r);
					break;
				default: {
					let i = "Token with \"" + r.type + "\" type was not found.";
					if (this.options.silent) return console.error(i), "";
					throw new Error(i);
				}
			}
		}
		return t;
	}
	parseInline(e, t = this.renderer) {
		this.renderer.parser = this;
		let n = "";
		for (let s = 0; s < e.length; s++) {
			let r = e[s];
			if (this.options.extensions?.renderers?.[r.type]) {
				let o = this.options.extensions.renderers[r.type].call({ parser: this }, r);
				if (o !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"checkbox",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(r.type)) {
					n += o || "";
					continue;
				}
			}
			let i = r;
			switch (i.type) {
				case "escape":
					n += t.text(i);
					break;
				case "html":
					n += t.html(i);
					break;
				case "link":
					n += t.link(i);
					break;
				case "image":
					n += t.image(i);
					break;
				case "checkbox":
					n += t.checkbox(i);
					break;
				case "strong":
					n += t.strong(i);
					break;
				case "em":
					n += t.em(i);
					break;
				case "codespan":
					n += t.codespan(i);
					break;
				case "br":
					n += t.br(i);
					break;
				case "del":
					n += t.del(i);
					break;
				case "text":
					n += t.text(i);
					break;
				default: {
					let o = "Token with \"" + i.type + "\" type was not found.";
					if (this.options.silent) return console.error(o), "";
					throw new Error(o);
				}
			}
		}
		return n;
	}
};
var S = (_Class = class {
	constructor(e) {
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "block", void 0);
		this.options = e || R;
	}
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
	emStrongMask(e) {
		return e;
	}
	provideLexer(e = this.block) {
		return e ? x.lex : x.lexInline;
	}
	provideParser(e = this.block) {
		return e ? b.parse : b.parseInline;
	}
}, _defineProperty(_Class, "passThroughHooks", /* @__PURE__ */ new Set([
	"preprocess",
	"postprocess",
	"processAllTokens",
	"emStrongMask"
])), _defineProperty(_Class, "passThroughHooksRespectAsync", /* @__PURE__ */ new Set([
	"preprocess",
	"postprocess",
	"processAllTokens"
])), _Class);
var Z = class {
	constructor(...e) {
		_defineProperty(this, "defaults", C());
		_defineProperty(this, "options", this.setOptions);
		_defineProperty(this, "parse", this.parseMarkdown(!0));
		_defineProperty(this, "parseInline", this.parseMarkdown(!1));
		_defineProperty(this, "Parser", b);
		_defineProperty(this, "Renderer", P);
		_defineProperty(this, "TextRenderer", L);
		_defineProperty(this, "Lexer", x);
		_defineProperty(this, "Tokenizer", y);
		_defineProperty(this, "Hooks", S);
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let s of e) switch (n = n.concat(t.call(this, s)), s.type) {
			case "table": {
				let r = s;
				for (let i of r.header) n = n.concat(this.walkTokens(i.tokens, t));
				for (let i of r.rows) for (let o of i) n = n.concat(this.walkTokens(o.tokens, t));
				break;
			}
			case "list": {
				let r = s;
				n = n.concat(this.walkTokens(r.items, t));
				break;
			}
			default: {
				let r = s;
				this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((i) => {
					let o = r[i].flat(1 / 0);
					n = n.concat(this.walkTokens(o, t));
				}) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((n) => {
			let s = { ...n };
			if (s.async = this.defaults.async || s.async || !1, n.extensions && (n.extensions.forEach((r) => {
				if (!r.name) throw new Error("extension name required");
				if ("renderer" in r) {
					let i = t.renderers[r.name];
					i ? t.renderers[r.name] = function(...o) {
						let p = r.renderer.apply(this, o);
						return p === !1 && (p = i.apply(this, o)), p;
					} : t.renderers[r.name] = r.renderer;
				}
				if ("tokenizer" in r) {
					if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
					let i = t[r.level];
					i ? i.unshift(r.tokenizer) : t[r.level] = [r.tokenizer], r.start && (r.level === "block" ? t.startBlock ? t.startBlock.push(r.start) : t.startBlock = [r.start] : r.level === "inline" && (t.startInline ? t.startInline.push(r.start) : t.startInline = [r.start]));
				}
				"childTokens" in r && r.childTokens && (t.childTokens[r.name] = r.childTokens);
			}), s.extensions = t), n.renderer) {
				let r = this.defaults.renderer || new P(this.defaults);
				for (let i in n.renderer) {
					if (!(i in r)) throw new Error(`renderer '${i}' does not exist`);
					if (["options", "parser"].includes(i)) continue;
					let o = i, p = n.renderer[o], a = r[o];
					r[o] = (...u) => {
						let c = p.apply(r, u);
						return c === !1 && (c = a.apply(r, u)), c || "";
					};
				}
				s.renderer = r;
			}
			if (n.tokenizer) {
				let r = this.defaults.tokenizer || new y(this.defaults);
				for (let i in n.tokenizer) {
					if (!(i in r)) throw new Error(`tokenizer '${i}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(i)) continue;
					let o = i, p = n.tokenizer[o], a = r[o];
					r[o] = (...u) => {
						let c = p.apply(r, u);
						return c === !1 && (c = a.apply(r, u)), c;
					};
				}
				s.tokenizer = r;
			}
			if (n.hooks) {
				let r = this.defaults.hooks || new S();
				for (let i in n.hooks) {
					if (!(i in r)) throw new Error(`hook '${i}' does not exist`);
					if (["options", "block"].includes(i)) continue;
					let o = i, p = n.hooks[o], a = r[o];
					S.passThroughHooks.has(i) ? r[o] = (u) => {
						if (this.defaults.async && S.passThroughHooksRespectAsync.has(i)) return (async () => {
							let h = await p.call(r, u);
							return a.call(r, h);
						})();
						let c = p.call(r, u);
						return a.call(r, c);
					} : r[o] = (...u) => {
						if (this.defaults.async) return (async () => {
							let h = await p.apply(r, u);
							return h === !1 && (h = await a.apply(r, u)), h;
						})();
						let c = p.apply(r, u);
						return c === !1 && (c = a.apply(r, u)), c;
					};
				}
				s.hooks = r;
			}
			if (n.walkTokens) {
				let r = this.defaults.walkTokens, i = n.walkTokens;
				s.walkTokens = function(o) {
					let p = [];
					return p.push(i.call(this, o)), r && (p = p.concat(r.call(this, o))), p;
				};
			}
			this.defaults = {
				...this.defaults,
				...s
			};
		}), this;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return x.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return b.parse(e, t ?? this.defaults);
	}
	parseMarkdown(e) {
		return (n, s) => {
			let r = { ...s }, i = {
				...this.defaults,
				...r
			}, o = this.onError(!!i.silent, !!i.async);
			if (this.defaults.async === !0 && r.async === !1) return o(/* @__PURE__ */ new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
			if (typeof n > "u" || n === null) return o(/* @__PURE__ */ new Error("marked(): input parameter is undefined or null"));
			if (typeof n != "string") return o(/* @__PURE__ */ new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
			if (i.hooks && (i.hooks.options = i, i.hooks.block = e), i.async) return (async () => {
				let p = i.hooks ? await i.hooks.preprocess(n) : n, u = await (i.hooks ? await i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(p, i), c = i.hooks ? await i.hooks.processAllTokens(u) : u;
				i.walkTokens && await Promise.all(this.walkTokens(c, i.walkTokens));
				let d = await (i.hooks ? await i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(c, i);
				return i.hooks ? await i.hooks.postprocess(d) : d;
			})().catch(o);
			try {
				i.hooks && (n = i.hooks.preprocess(n));
				let a = (i.hooks ? i.hooks.provideLexer(e) : e ? x.lex : x.lexInline)(n, i);
				i.hooks && (a = i.hooks.processAllTokens(a)), i.walkTokens && this.walkTokens(a, i.walkTokens);
				let c = (i.hooks ? i.hooks.provideParser(e) : e ? b.parse : b.parseInline)(a, i);
				return i.hooks && (c = i.hooks.postprocess(c)), c;
			} catch (p) {
				return o(p);
			}
		};
	}
	onError(e, t) {
		return (n) => {
			if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
				let s = "<p>An error occurred:</p><pre>" + O(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(s) : s;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
};
var E = new Z();
function f(l, e) {
	return E.parse(l, e);
}
f.options = f.setOptions = function(l) {
	return E.setOptions(l), f.defaults = E.defaults, j(f.defaults), f;
};
f.getDefaults = C;
f.defaults = R;
function kt(...l) {
	return E.use(...l), f.defaults = E.defaults, j(f.defaults), f;
}
f.use = kt;
f.walkTokens = function(l, e) {
	return E.walkTokens(l, e);
};
f.parseInline = E.parseInline;
f.Parser = b;
f.parser = b.parse;
f.Renderer = P;
f.TextRenderer = L;
f.Lexer = x;
f.lexer = x.lex;
f.Tokenizer = y;
f.Hooks = S;
f.parse = f;
f.options;
f.setOptions;
f.walkTokens;
f.parseInline;
b.parse;
x.lex;
//#endregion
//#region src/client/markdown.ts
/**
* Markdown 渲染：marked 生成 HTML，DOMPurify 做浏览器端消毒。
* 工作区文件可能来自 clone 的第三方仓库，因此不能信任 marked 的原样 HTML 透传；
* DOMPurify 会处理 script/事件属性/javascript: 及控制字符混淆等绕过。
*/
f.setOptions({
	gfm: true,
	breaks: true
});
/** 渲染 Markdown 为消毒后的 HTML 字符串；失败时回退为转义后的原文。 */
function renderMarkdown(src) {
	try {
		const out = f.parse(src);
		if (typeof out !== "string") return "";
		return purify.sanitize(out, {
			USE_PROFILES: { html: true },
			FORBID_TAGS: [
				"style",
				"form",
				"input",
				"button",
				"textarea",
				"select"
			],
			FORBID_ATTR: ["style"]
		});
	} catch {
		return src.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	}
}
/** 是否 Markdown 文件（按扩展名）。 */
function isMarkdownPath(relPath) {
	return /\.(md|markdown|mdown|mdx)$/i.test(relPath);
}
//#endregion
//#region src/client/preview.ts
/**
* F2：修改文件点击 → 右侧预览抽屉。
*
* 机制：文档级捕获阶段点击委托（不 shadow 官方渲染）——命中产物 chip /
* 文件 mention / 工具卡片路径时 stopPropagation，改为打开预览抽屉；
* 拦截总开关关闭时完全不干预（回退官方「在系统中打开」）。
*/
let sessionsSvc;
let workspacesSvc;
function bindPreviewServices(sessions, workspaces) {
	sessionsSvc = sessions;
	workspacesSvc = workspaces;
}
function isUnder(abs, root) {
	const a = abs.toLowerCase();
	const r = root.replace(/[\\/]+$/, "").toLowerCase();
	return a === r || a.startsWith(r + "\\") || a.startsWith(r + "/");
}
/** 从 title/文本解析为 cwd 内的绝对路径；无法确定时返回 null（不拦截）。 */
function resolveClickPath(cwd, title) {
	if (title === "" || title === ".") return null;
	if (isAbsolute(title)) return isUnder(title, cwd) ? title : null;
	if (!isPathTitle(title)) return null;
	const abs = joinAbs(cwd, title);
	return isUnder(abs, cwd) ? abs : null;
}
let lastFocused = null;
function installClickInterceptor() {
	const handler = (ev) => {
		if (!prefsStore.get().intercept) return;
		if (sessionsSvc === void 0) return;
		const snap = sessionsSvc.list.getSnapshot();
		const sessionId = snap.current;
		if (sessionId === void 0) return;
		const cwd = snap.byId[sessionId]?.cwd;
		if (cwd === void 0 || cwd === "") return;
		const target = ev.target;
		if (target === null) return;
		if (target.closest(".wf-folder-btn, .wf-drawer, .wf-drawer-backdrop") !== null) return;
		const el = target.closest?.("button, a, [role=\"button\"]") ?? null;
		if (el === null) return;
		const inProducedRow = el.closest("[data-produced-files-row]") !== null;
		const title = el.getAttribute("title") ?? "";
		if (!inProducedRow && !isPathTitle(title)) return;
		if (title === "") return;
		const abs = resolveClickPath(cwd, title.trim());
		if (abs === null) return;
		ev.preventDefault();
		ev.stopPropagation();
		lastFocused = el;
		addRecent(sessionId, cwd, relOf(abs, cwd));
		openPreview(cwd, relOf(abs, cwd), false);
	};
	document.addEventListener("click", handler, true);
	return () => {
		document.removeEventListener("click", handler, true);
	};
}
const TOKEN_SRC = "(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)|(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|\\b(import|export|from|default|const|let|var|function|return|class|interface|type|async|await|new|if|else|for|while|switch|case|break|continue|true|false|null|undefined|void|throw|try|catch|finally|this|typeof|instanceof|extends|implements|public|private|protected|static|readonly|enum|namespace|declare|as|of|in|do|yield|module|require|satisfies|keyof|infer)\\b";
function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
const TOKEN_RE = new RegExp(TOKEN_SRC, "g");
function highlightLine(line) {
	const escaped = escapeHtml(line);
	const re = TOKEN_RE;
	re.lastIndex = 0;
	const nodes = [];
	let last = 0;
	let i = 0;
	let m;
	while ((m = re.exec(escaped)) !== null) {
		if (m.index > last) nodes.push(escaped.slice(last, m.index));
		const cls = m[1] !== void 0 ? "wf-tok-str" : m[2] !== void 0 ? "wf-tok-com" : "wf-tok-kw";
		nodes.push(react.createElement("span", {
			className: cls,
			key: i++
		}, m[0]));
		last = m.index + m[0].length;
	}
	if (last < escaped.length) nodes.push(escaped.slice(last));
	return nodes;
}
const LOAD_CHUNK = 524288;
function PreviewDrawer() {
	const state = useStore(previewStore);
	const [load, setLoad] = react.useState({
		status: "idle",
		loadedBytes: 0
	});
	const [copied, setCopied] = react.useState(false);
	const [mode, setMode] = react.useState("render");
	const [retry, setRetry] = react.useState(0);
	const closeRef = react.useRef(null);
	const loadMoreController = react.useRef(null);
	react.useEffect(() => {
		if (!state.open) return;
		loadMoreController.current?.abort();
		loadMoreController.current = null;
		setLoad({
			status: "loading",
			loadedBytes: 0
		});
		setMode("render");
		const controller = new AbortController();
		readFile(state.root, state.relPath, 0, LOAD_CHUNK, controller.signal).then((r) => {
			if (r.ok) {
				if (r.error !== void 0 && r.error !== "") {
					setLoad({
						status: "error",
						error: r.error === "图片超过预览大小上限" ? t("preview.imageTooLarge") : r.error,
						loadedBytes: 0
					});
					return;
				}
				setLoad({
					status: "done",
					content: r.content,
					binary: r.binary,
					imageDataUrl: r.imageDataUrl,
					size: r.size,
					truncated: r.truncated,
					loadedBytes: r.bytesRead ?? r.content?.length ?? 0
				});
			} else setLoad({
				status: "error",
				error: r.error ?? "未知错误",
				loadedBytes: 0
			});
		}).catch((error) => {
			if (error instanceof DOMException && error.name === "AbortError") return;
			setLoad({
				status: "error",
				error: String(error),
				loadedBytes: 0
			});
		});
		return () => {
			controller.abort();
			loadMoreController.current?.abort();
			loadMoreController.current = null;
		};
	}, [
		state.open,
		state.root,
		state.relPath,
		retry
	]);
	react.useEffect(() => {
		if (!state.open) return;
		const onKey = (ev) => {
			if (ev.key === "Escape") {
				ev.stopPropagation();
				closePreview();
			}
		};
		document.addEventListener("keydown", onKey, true);
		closeRef.current?.focus();
		return () => {
			document.removeEventListener("keydown", onKey, true);
			if (lastFocused instanceof HTMLElement) lastFocused.focus();
		};
	}, [state.open]);
	if (!state.open) return null;
	const rel = state.relPath;
	const lines = load.content === void 0 ? 0 : load.content.split("\n").length;
	const md = isMarkdownPath(rel);
	const showMdRender = md && mode === "render" && load.content !== void 0;
	const loadMore = () => {
		const nextOffset = load.loadedBytes;
		loadMoreController.current?.abort();
		const controller = new AbortController();
		loadMoreController.current = controller;
		setLoad((prev) => ({
			...prev,
			status: "loading"
		}));
		readFile(state.root, rel, nextOffset, LOAD_CHUNK, controller.signal).then((r) => {
			if (controller.signal.aborted) return;
			if (r.ok) setLoad((prev) => ({
				status: "done",
				content: (prev.content ?? "") + (r.content ?? ""),
				binary: r.binary,
				imageDataUrl: r.imageDataUrl,
				size: r.size,
				truncated: r.truncated,
				loadedBytes: nextOffset + (r.bytesRead ?? r.content?.length ?? 0)
			}));
			else setLoad((prev) => ({
				...prev,
				status: "error",
				error: r.error ?? "未知错误"
			}));
		}).catch((error) => {
			if (error instanceof DOMException && error.name === "AbortError") return;
			if (controller.signal.aborted) return;
			setLoad((prev) => ({
				...prev,
				status: "error",
				error: String(error)
			}));
		}).finally(() => {
			if (loadMoreController.current === controller) loadMoreController.current = null;
		});
	};
	return react.createElement("div", {
		className: "wf-drawer-backdrop wf-preview-backdrop",
		onClick: (e) => {
			if (e.target === e.currentTarget) closePreview();
		}
	}, react.createElement("div", {
		className: "wf-drawer wf-preview-drawer",
		role: "dialog",
		"aria-label": `${t("preview.close")}: ${basenameOf(rel)}`,
		onClick: (e) => e.stopPropagation()
	}, react.createElement("div", { className: "wf-drawer-head" }, react.createElement("div", { className: "wf-drawer-title" }, basenameOf(rel), react.createElement("small", null, rel)), react.createElement("button", {
		ref: closeRef,
		type: "button",
		className: "wf-icon-btn",
		"aria-label": t("preview.close"),
		onClick: closePreview
	}, "⨯")), react.createElement("div", { className: "wf-drawer-meta" }, react.createElement("span", { className: "wf-meta-text" }, load.binary === true ? t("preview.binary") : t("preview.lines", {
		lines: String(lines),
		size: formatBytes(load.size ?? 0)
	})), state.fromBrowser ? react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: closePreview
	}, t("preview.back")) : null, md && load.content !== void 0 ? react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => setMode((m) => m === "render" ? "raw" : "render")
	}, mode === "render" ? t("preview.raw") : t("preview.rendered")) : null, react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => {
			const clipboard = navigator.clipboard;
			if (clipboard === void 0) return;
			clipboard.writeText(rel).then(() => {
				setCopied(true);
				window.setTimeout(() => setCopied(false), 1200);
			}).catch(() => {});
		}
	}, copied ? t("preview.copyDone") : t("preview.copyPath")), workspacesSvc !== void 0 ? react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => {
			workspacesSvc?.openPath(joinAbs(state.root, rel)).catch(() => {});
		}
	}, t("preview.openSystem")) : null), load.status === "loading" ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", { className: "wf-body-hint" }, t("preview.loading"))) : load.status === "error" ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", { className: "wf-body-hint" }, t("preview.error", { error: load.error ?? "" }), react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => {
			setLoad({
				status: "idle",
				loadedBytes: 0
			});
			setRetry((n) => n + 1);
		}
	}, t("preview.retry")))) : load.imageDataUrl !== void 0 ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("img", {
		className: "wf-image",
		src: load.imageDataUrl,
		alt: basenameOf(rel)
	})) : load.binary === true ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", { className: "wf-body-hint" }, t("preview.binary"), workspacesSvc !== void 0 ? react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => {
			workspacesSvc?.openPath(joinAbs(state.root, rel)).catch(() => {});
		}
	}, t("preview.openSystem")) : null)) : showMdRender ? react.createElement("div", { className: "wf-drawer-body wf-body-plain" }, react.createElement("div", {
		className: "wf-md",
		dangerouslySetInnerHTML: { __html: renderMarkdown(load.content ?? "") }
	})) : react.createElement("div", { className: "wf-drawer-body" }, react.createElement("pre", { className: "wf-code" }, (load.content ?? "").split("\n").map((line, i) => react.createElement("div", {
		className: "wf-code-line",
		key: i
	}, react.createElement("span", { className: "wf-line-no" }, String(i + 1)), react.createElement("span", { className: "wf-line-content" }, ...highlightLine(line)))))), load.status === "done" && load.truncated === true ? react.createElement("div", { className: "wf-drawer-foot" }, t("preview.truncated", { count: String(lines) }), react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: loadMore
	}, t("preview.loadMore"))) : null));
}
function formatBytes(size) {
	if (size < 1024) return `${size} B`;
	if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
	return `${(size / 1048576).toFixed(1)} MB`;
}
//#endregion
//#region src/client/settings.ts
/**
* 设置页（settings.section「工作区文件」）。
* 客户端偏好走 localStorage；安全参数（预览上限、越界开关）经 Host 桥持久化。
*/
const MAX_PREVIEW_OPTIONS = [
	{
		value: 262144,
		label: "256 KB"
	},
	{
		value: 524288,
		label: "512 KB"
	},
	{
		value: 1048576,
		label: "1 MB"
	},
	{
		value: 2097152,
		label: "2 MB"
	},
	{
		value: 5242880,
		label: "5 MB"
	}
];
const IMAGE_MAX_OPTIONS = [
	{
		value: 524288,
		label: "512 KB"
	},
	{
		value: 1048576,
		label: "1 MB"
	},
	{
		value: 2097152,
		label: "2 MB"
	},
	{
		value: 5242880,
		label: "5 MB"
	},
	{
		value: 10485760,
		label: "10 MB"
	}
];
const RECENT_OPTIONS = [
	1,
	3,
	5,
	8,
	10
];
function SettingsSection() {
	const prefs = useStore(prefsStore);
	const [host, setHost] = react.useState(null);
	const latestSeq = react.useRef(0);
	const lastGood = react.useRef(null);
	react.useEffect(() => {
		let cancelled = false;
		getHostConfig().then((h) => {
			if (cancelled || h === null) return;
			lastGood.current = h;
			setHost(h);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const patchHost = (p) => {
		setHost((prev) => {
			if (prev === null) return prev;
			lastGood.current = prev;
			return {
				...prev,
				...p
			};
		});
		const seq = ++latestSeq.current;
		patchHostConfig(p).then((h) => {
			if (seq !== latestSeq.current) return;
			if (h === null) setHost(lastGood.current);
			else {
				lastGood.current = h;
				setHost(h);
			}
		});
	};
	return react.createElement("div", { className: "wf-page" }, react.createElement("div", { className: "wf-page-title" }, t("settings.title")), react.createElement("div", { className: "wf-page-desc" }, t("settings.desc")), react.createElement("div", { className: "wf-card" }, field(t("settings.intercept"), t("settings.interceptSub"), react.createElement(Toggle, {
		checked: prefs.intercept,
		onChange: (v) => setPrefs({ intercept: v })
	})), field(t("settings.showHidden"), t("settings.showHiddenSub"), react.createElement(Toggle, {
		checked: prefs.showHidden,
		onChange: (v) => setPrefs({ showHidden: v })
	})), field(t("settings.recentCount"), t("settings.recentCountSub"), react.createElement("select", {
		className: "wf-select",
		value: prefs.recentCount,
		onChange: (e) => setPrefs({ recentCount: Number(e.target.value) })
	}, RECENT_OPTIONS.map((n) => react.createElement("option", {
		key: n,
		value: n
	}, String(n))))), field(t("settings.ignore"), t("settings.ignoreSub"), react.createElement("input", {
		className: "wf-input",
		type: "text",
		value: prefs.ignore,
		placeholder: "node_modules,.git",
		onChange: (e) => setPrefs({ ignore: e.target.value })
	}))), react.createElement("div", { className: "wf-card" }, field(t("settings.maxPreview"), t("settings.maxPreviewSub"), react.createElement("select", {
		className: "wf-select",
		value: host?.maxPreviewBytes ?? 524288,
		disabled: host === null,
		onChange: (e) => patchHost({ maxPreviewBytes: Number(e.target.value) })
	}, MAX_PREVIEW_OPTIONS.map((o) => react.createElement("option", {
		key: o.value,
		value: o.value
	}, o.label)))), field(t("settings.imageMax"), t("settings.imageMaxSub"), react.createElement("select", {
		className: "wf-select",
		value: host?.imageMaxBytes ?? 2097152,
		disabled: host === null,
		onChange: (e) => patchHost({ imageMaxBytes: Number(e.target.value) })
	}, IMAGE_MAX_OPTIONS.map((o) => react.createElement("option", {
		key: o.value,
		value: o.value
	}, o.label)))), field(t("settings.outside"), t("settings.outsideSub"), react.createElement(Toggle, {
		checked: host?.allowOutsideCwd === true,
		onChange: (v) => patchHost({ allowOutsideCwd: v }),
		disabled: host === null
	})), host === null ? react.createElement("span", { className: "wf-hint" }, t("settings.hostHint")) : null));
}
function field(label, sub, control) {
	return react.createElement("div", { className: "wf-field" }, react.createElement("div", { className: "wf-field-label" }, react.createElement("span", null, label), react.createElement("span", { className: "wf-field-sub" }, sub)), control);
}
function Toggle(props) {
	return react.createElement("button", {
		type: "button",
		role: "switch",
		"aria-checked": props.checked,
		disabled: props.disabled === true,
		className: props.checked ? "wf-toggle wf-toggle-on" : "wf-toggle",
		onClick: () => props.onChange(!props.checked)
	}, react.createElement("span", { className: "wf-toggle-knob" }));
}
//#endregion
//#region src/client/styles.ts
/**
* 插件样式：一次性注入，卸载时由客户端运行时的 style 清理机制移除。
* 颜色全部使用 DSH 主题变量（--dsw-alias-* / --dsw-shadow-*），跟随深浅色主题。
*/
const CSS = `
/* ── 右侧抽屉（shell.overlay，自绘，视觉与官方详情栏同源） ── */
.wf-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(0, 0, 0, 0.18);
  animation: wf-fade 0.18s ease-out;
}
.wf-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 901;
  width: min(480px, calc(100vw - 48px));
  display: flex;
  flex-direction: column;
  background: var(--dsw-alias-bg-overlay);
  border-left: 1px solid var(--dsw-alias-border-l2);
  box-shadow: var(--dsw-shadow-lv3);
  animation: wf-slide-in 0.22s ease-out;
  pointer-events: auto;
}
/* 预览抽屉（自文件夹浏览进入时）盖在浏览抽屉之上 */
.wf-preview-backdrop { z-index: 910; }
.wf-preview-drawer { z-index: 911; }
@keyframes wf-slide-in {
  from { transform: translateX(24px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@keyframes wf-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.wf-drawer-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  flex: none;
}
.wf-drawer-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wf-drawer-title small {
  display: block;
  font-size: 11px;
  font-weight: 400;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wf-icon-btn {
  flex: none;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-size: 15px;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
}
.wf-icon-btn:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}

.wf-drawer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  flex-wrap: wrap;
  flex: none;
}
.wf-meta-text {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
  margin-right: auto;
}
.wf-btn {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  padding: 2px 8px;
  cursor: pointer;
}
.wf-btn:hover {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-brand-primary);
}

.wf-drawer-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-alias-font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
}
.wf-drawer-body.wf-body-plain {
  font-family: inherit;
}
.wf-body-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 16px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  font-family: inherit;
}
.wf-image {
  max-width: 100%;
  max-height: calc(100vh - 220px);
  object-fit: contain;
  border-radius: 8px;
}
.wf-code {
  margin: 0;
  white-space: pre;
  tab-size: 2;
}
.wf-code-line {
  display: flex;
  content-visibility: auto;
  contain-intrinsic-size: 20px;
}
.wf-line-no {
  flex: none;
  width: 42px;
  padding-right: 10px;
  text-align: right;
  color: var(--dsw-alias-label-tertiary);
  user-select: none;
}
.wf-line-content {
  flex: 1;
  min-width: 0;
  white-space: pre;
}
.wf-tok-kw { color: var(--dsw-alias-state-info-primary, #4a90d9); }
.wf-tok-str { color: var(--dsw-alias-state-success-primary, #57b478); }
.wf-tok-com { color: var(--dsw-alias-label-tertiary); font-style: italic; }

.wf-drawer-foot {
  flex: none;
  padding: 8px 12px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

/* ── Markdown 渲染 ──────────────────────────────────────── */
.wf-md {
  font-size: 13px;
  line-height: 1.7;
  font-family: inherit;
  color: var(--dsw-alias-label-primary);
  word-break: break-word;
}
.wf-md h1, .wf-md h2, .wf-md h3, .wf-md h4, .wf-md h5, .wf-md h6 {
  margin: 16px 0 8px;
  line-height: 1.3;
  color: var(--dsw-alias-label-primary);
}
.wf-md h1 { font-size: 20px; border-bottom: 1px solid var(--dsw-alias-border-l1); padding-bottom: 6px; }
.wf-md h2 { font-size: 17px; border-bottom: 1px solid var(--dsw-alias-border-l1); padding-bottom: 4px; }
.wf-md h3 { font-size: 15px; }
.wf-md h4, .wf-md h5, .wf-md h6 { font-size: 13.5px; }
.wf-md p { margin: 8px 0; }
.wf-md ul, .wf-md ol { margin: 8px 0; padding-left: 22px; }
.wf-md li { margin: 3px 0; }
.wf-md a { color: var(--dsw-alias-brand-primary); text-decoration: none; }
.wf-md a:hover { text-decoration: underline; }
.wf-md blockquote {
  margin: 10px 0;
  padding: 2px 12px;
  border-left: 3px solid var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-label-secondary);
  background: var(--dsw-alias-fill-l2);
  border-radius: 0 6px 6px 0;
}
.wf-md code {
  font-family: var(--dsw-alias-font-mono, ui-monospace, SFMono-Regular, Consolas, monospace);
  font-size: 12px;
  background: var(--dsw-alias-fill-l2);
  border-radius: 4px;
  padding: 1px 5px;
}
.wf-md pre {
  margin: 10px 0;
  padding: 10px 12px;
  background: var(--dsw-alias-fill-l2);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  overflow: auto;
}
.wf-md pre code {
  background: transparent;
  padding: 0;
  display: block;
  line-height: 1.6;
}
.wf-md table {
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 12.5px;
}
.wf-md th, .wf-md td {
  border: 1px solid var(--dsw-alias-border-l2);
  padding: 5px 10px;
}
.wf-md th {
  background: var(--dsw-alias-fill-l2);
  color: var(--dsw-alias-label-primary);
}
.wf-md hr {
  border: 0;
  border-top: 1px solid var(--dsw-alias-border-l1);
  margin: 14px 0;
}
.wf-md img {
  max-width: 100%;
  border-radius: 8px;
}

/* ── 文件夹浏览抽屉 ─────────────────────────────────────── */
.wf-breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 2px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  font-size: 12px;
  flex: none;
}
.wf-crumb {
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
}
.wf-crumb:hover {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-interactive-bg-hover);
}
.wf-crumb-sep {
  color: var(--dsw-alias-label-tertiary);
  user-select: none;
}
.wf-tree {
  padding: 4px 0;
}
.wf-node {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 0 8px;
  border-radius: 6px;
  cursor: pointer;
  color: var(--dsw-alias-label-secondary);
  font-size: 12.5px;
  min-width: 0;
}
.wf-node:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.wf-node-toggle {
  flex: none;
  width: 16px;
  text-align: center;
  color: var(--dsw-alias-label-tertiary);
  font-size: 10px;
  user-select: none;
}
.wf-node-icon {
  flex: none;
  font-size: 13px;
}
.wf-node-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wf-node-size {
  flex: none;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}
.wf-browser-foot {
  flex: none;
  padding: 8px 12px;
  border-top: 1px solid var(--dsw-alias-border-l1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

/* ── 头部按钮 ───────────────────────────────────────────── */
.wf-folder-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 180px;
  height: 26px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}
.wf-folder-btn:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.wf-folder-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
.wf-folder-btn-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── 设置页（settings.section） ──────────────────────────── */
.wf-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 560px;
  padding: 4px 2px;
}
.wf-page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.wf-page-desc {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  margin-top: -6px;
}
.wf-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  padding: 12px 14px;
}
.wf-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
}
.wf-field-label {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.wf-field-label > span:first-child {
  font-size: 13px;
  color: var(--dsw-alias-label-primary);
}
.wf-field-sub {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}
.wf-toggle {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  border: 0;
  border-radius: 10px;
  padding: 0;
  background: var(--dsw-alias-fill-l2);
  cursor: pointer;
  transition: background 0.15s;
}
.wf-toggle:disabled {
  opacity: 0.5;
  cursor: default;
}
.wf-toggle-on {
  background: var(--dsw-alias-brand-primary);
}
.wf-toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.15s;
}
.wf-toggle-on .wf-toggle-knob {
  left: 16px;
}
.wf-input {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  padding: 4px 8px;
  width: 140px;
}
.wf-select {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  padding: 4px 8px;
  min-width: 110px;
  cursor: pointer;
}
.wf-hint {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}
`;
/** 注入插件样式（幂等）；返回清理函数，由 apply 挂到 ctx.effect。 */
function injectStyles() {
	if (typeof document === "undefined") return () => {};
	const selector = "style[data-plugin-css=\"dsh-plugin-workspace-files\"]";
	if (document.querySelector(selector) !== null) return () => document.querySelector(selector)?.remove();
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-plugin-workspace-files";
	tag.dataset.pluginCss = "dsh-plugin-workspace-files";
	tag.textContent = CSS;
	document.head.appendChild(tag);
	return () => tag.remove();
}
//#endregion
//#region src/client.ts
/**
* dsh-plugin-workspace-files — Client 半。
*
* F1 @ 文件引用（官方 input-trigger 管线 source）
* F2 修改文件点击 → 右侧预览抽屉（文档级点击拦截 + shell.overlay 自绘抽屉）
* F3 右上角项目文件夹按钮 + 浏览抽屉（header utilities + shell.overlay）
* 另含设置页（settings.section）与 zh/en 文案。
* 所有副作用挂在 ctx.effect；不 shadow 官方槽位。
*/
const inject = [
	"slots",
	"sessions",
	"inputTriggers",
	"locale"
];
function apply(ctx) {
	ctx.effect(() => injectStyles(), "workspace-files: styles");
	const slots = ctx.get("slots");
	const sessions = ctx.get("sessions");
	const inputTriggers = ctx.get("inputTriggers");
	const locale = ctx.get("locale");
	const workspaces = ctx.get("workspaces");
	bindPreviewServices(sessions, workspaces);
	bindBrowserServices(sessions, workspaces);
	bindHeaderServices(sessions);
	if (locale !== void 0) {
		const translate = locale.bind(NS);
		setTranslator((key, params) => params !== void 0 ? translate(key, params) : translate(key));
		ctx.effect(() => locale.register(NS, DICTS), "workspace-files: dictionaries");
	}
	if (inputTriggers !== void 0 && sessions !== void 0) ctx.effect(() => createFileSource(sessions, inputTriggers), "workspace-files: @ source");
	ctx.effect(() => installClickInterceptor(), "workspace-files: click interceptor");
	if (slots === void 0) return;
	ctx.effect(() => slots.inject("shell.overlay", () => slots.register({
		name: "shell.overlay",
		id: "workspace-files-preview",
		order: 60
	}, PreviewDrawer)), "workspace-files: preview overlay");
	ctx.effect(() => slots.inject("shell.overlay", () => slots.register({
		name: "shell.overlay",
		id: "workspace-files-browser",
		order: 70
	}, FolderBrowser)), "workspace-files: browser overlay");
	ctx.effect(() => slots.inject("conversation.session.header.utilities", () => slots.register({
		name: "conversation.session.header.utilities",
		id: "workspace-files-folder",
		order: 100
	}, HeaderFolderButton)), "workspace-files: header button");
	ctx.effect(() => slots.inject("settings.section", () => slots.register({
		name: "settings.section",
		id: "workspace-files",
		order: 30,
		label: () => t("settings.title")
	}, SettingsSection)), "workspace-files: settings section");
}
//#endregion
exports.apply = apply;
exports.inject = inject;

		return module.exports;
	}
});
