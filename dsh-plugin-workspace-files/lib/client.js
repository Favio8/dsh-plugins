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
		"settings.outside": "允许浏览工作区之外",
		"settings.outsideSub": "放宽读取边界到主目录（谨慎）",
		"settings.recentCount": "最近引用条数",
		"settings.recentCountSub": "@ 菜单置顶显示的最近文件数量",
		"settings.hostHint": "宿主桥未连接，安全参数无法保存",
		"preview.copyPath": "复制路径",
		"preview.copyDone": "已复制",
		"preview.openSystem": "在系统中打开",
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
		"settings.outside": "Allow browsing outside workspace",
		"settings.outsideSub": "Relax the read boundary to the home directory (use with care)",
		"settings.recentCount": "Recent count",
		"settings.recentCountSub": "Number of recent files pinned at the top of the @ menu",
		"settings.hostHint": "Host bridge unreachable; security settings cannot be saved",
		"preview.copyPath": "Copy path",
		"preview.copyDone": "Copied",
		"preview.openSystem": "Open in system",
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
function q(params) {
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
	return getJson(`/workspace-files/list${q({
		root,
		path: rel,
		hidden: showHidden ? 1 : void 0
	})}`, signal);
}
/** 读文件片段。 */
function readFile(root, rel, offset, limit, signal) {
	return getJson(`/workspace-files/read${q({
		root,
		path: rel,
		offset,
		limit
	})}`, signal);
}
function getHostConfig(signal) {
	return getJson(`/workspace-files/config`, signal);
}
async function patchHostConfig(patch) {
	try {
		return await (await fetch("/workspace-files/config", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(patch)
		})).json();
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
	expanded: {},
	rev: 0
});
function openBrowser(root) {
	browserStore.set({
		open: true,
		root,
		currentPath: root,
		expanded: {},
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
		return Array.isArray(raw) ? raw : [];
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
/** 是否「像」一个文件路径（含分隔符或点扩展名）。 */
function looksLikePath(value) {
	return value.includes("/") || value.includes("\\") || /^[^\\/]+\.[A-Za-z0-9]+$/.test(value);
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
* - 菜单候选：最近引用（置顶）+ 当前层文件/目录；
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
function createFileSource(sessions, inputTriggers) {
	return inputTriggers.registerSource({
		trigger: "@",
		name: "file",
		order: -10,
		async candidates(session, { query, signal }) {
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd === void 0) return [];
			const lastSlash = query.lastIndexOf("/");
			const dirPart = lastSlash >= 0 ? query.slice(0, lastSlash + 1) : "";
			const rest = lastSlash >= 0 ? query.slice(lastSlash + 1) : query;
			const recents = dirPart === "" ? getRecents(session.sessionId, cwd) : [];
			const list = await listDir(cwd, dirPart, false, signal);
			const ignore = ignoredNames();
			const matched = (list.entries ?? []).filter((e) => !ignore.has(e.name.toLowerCase())).filter((e) => e.name.toLowerCase().startsWith(rest.toLowerCase()));
			const dirs = matched.filter((e) => e.kind === "dir");
			const files = matched.filter((e) => e.kind === "file");
			const recentCands = recents.map((rel) => ({
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
			const rel = candidate.description ?? candidate.name;
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd !== void 0) addRecent(session.sessionId, cwd, rel.replace(/\/$/, ""));
			return { text: `${rel} ` };
		},
		lexicon(session) {
			const cwd = cwdOf(sessions, session.sessionId);
			if (cwd === void 0) return void 0;
			const recents = getRecents(session.sessionId, cwd);
			return recents.length > 0 ? recents : void 0;
		},
		subscribeLexicon(_session, listener) {
			return sessions.list.subscribe(listener);
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
		setLoading(true);
		listDir(state.root, relOf(state.currentPath, state.root), prefs.showHidden).then((r) => {
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
				expanded: {},
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
	if (!looksLikePath(title)) return null;
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
		const el = target.closest?.("button, a, [role=\"button\"]") ?? null;
		if (el === null) return;
		const inProducedRow = el.closest("[data-produced-files-row]") !== null;
		const title = el.getAttribute("title") ?? "";
		if (!inProducedRow && !looksLikePath(title)) return;
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
function highlightLine(line) {
	const escaped = escapeHtml(line);
	const re = new RegExp(TOKEN_SRC, "g");
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
	const closeRef = react.useRef(null);
	react.useEffect(() => {
		if (!state.open) return;
		setLoad({
			status: "loading",
			loadedBytes: 0
		});
		const controller = new AbortController();
		readFile(state.root, state.relPath, 0, LOAD_CHUNK, controller.signal).then((r) => {
			if (r.ok) setLoad({
				status: "done",
				content: r.content,
				binary: r.binary,
				imageDataUrl: r.imageDataUrl,
				size: r.size,
				truncated: r.truncated,
				loadedBytes: r.content?.length ?? 0
			});
			else setLoad({
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
		return () => controller.abort();
	}, [
		state.open,
		state.root,
		state.relPath
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
	const loadMore = () => {
		const nextOffset = load.loadedBytes;
		setLoad((prev) => ({
			...prev,
			status: "loading"
		}));
		readFile(state.root, rel, nextOffset, LOAD_CHUNK).then((r) => {
			if (r.ok) setLoad((prev) => ({
				status: "done",
				content: (prev.content ?? "") + (r.content ?? ""),
				binary: r.binary,
				imageDataUrl: r.imageDataUrl,
				size: r.size,
				truncated: r.truncated,
				loadedBytes: nextOffset + (r.content?.length ?? 0)
			}));
			else setLoad((prev) => ({
				...prev,
				status: "error",
				error: r.error ?? "未知错误"
			}));
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
		"aria-label": t("preview.close"),
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
	}, t("preview.back")) : null, react.createElement("button", {
		type: "button",
		className: "wf-btn",
		onClick: () => {
			navigator.clipboard?.writeText(rel).then(() => {
				setCopied(true);
				window.setTimeout(() => setCopied(false), 1200);
			});
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
		onClick: () => setLoad({
			status: "idle",
			loadedBytes: 0
		})
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
	}, t("preview.openSystem")) : null)) : react.createElement("div", { className: "wf-drawer-body" }, react.createElement("pre", { className: "wf-code" }, (load.content ?? "").split("\n").map((line, i) => react.createElement("div", {
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
	react.useEffect(() => {
		let cancelled = false;
		getHostConfig().then((h) => {
			if (!cancelled && h !== null) setHost(h);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const patchHost = (p) => {
		setHost((prev) => prev === null ? prev : {
			...prev,
			...p
		});
		patchHostConfig(p).then((h) => {
			if (h !== null) setHost(h);
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
let injected = false;
/** 注入插件样式（幂等；重复注入有 data-plugin-css 守卫）。 */
function injectStyles() {
	if (injected) return;
	if (typeof document === "undefined") return;
	if (document.querySelector("style[data-plugin-css=\"dsh-plugin-workspace-files\"]") !== null) {
		injected = true;
		return;
	}
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-plugin-workspace-files";
	tag.dataset.pluginCss = "dsh-plugin-workspace-files";
	tag.textContent = CSS;
	document.head.appendChild(tag);
	injected = true;
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
	injectStyles();
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
