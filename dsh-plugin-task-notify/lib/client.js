window.__ModuleLoader__.load({
	id: "dsh-plugin-task-notify",
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
//#region src/client/config.ts
const STORAGE_KEY = "dsh-plugin-task-notify.config";
const DEFAULTS = { toast: true };
let config = load();
const listeners$1 = /* @__PURE__ */ new Set();
function load() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		const parsed = JSON.parse(raw);
		return { toast: typeof parsed.toast === "boolean" ? parsed.toast : DEFAULTS.toast };
	} catch {
		return { ...DEFAULTS };
	}
}
function getConfig() {
	return config;
}
function setConfig(patch) {
	config = {
		...config,
		...patch
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {}
	for (const fn of [...listeners$1]) fn();
	return config;
}
function subscribeConfig(fn) {
	listeners$1.add(fn);
	return () => {
		listeners$1.delete(fn);
	};
}
//#endregion
//#region src/client/toasts.ts
const MAX_TOASTS = 4;
const AUTO_DISMISS_MS = 6e3;
let toasts = [];
let seq = 0;
const listeners = /* @__PURE__ */ new Set();
const timers = /* @__PURE__ */ new Map();
let openSession = () => {};
function emit() {
	for (const fn of [...listeners]) fn();
}
/** 由插件 apply 注入"点击 toast 打开会话"的实现（需要 ctx.sessions）。 */
function setOpenSession(fn) {
	openSession = fn;
}
function pushToast(item) {
	const id = ++seq;
	if (toasts.length >= MAX_TOASTS) {
		const evicted = toasts[0];
		const evictedTimer = timers.get(evicted.id);
		if (evictedTimer !== void 0) {
			clearTimeout(evictedTimer);
			timers.delete(evicted.id);
		}
	}
	toasts = [...toasts, {
		...item,
		id,
		createdAt: Date.now()
	}].slice(-4);
	const timer = setTimeout(() => {
		timers.delete(id);
		dismissToast(id);
	}, AUTO_DISMISS_MS);
	timers.set(id, timer);
	emit();
}
function dismissToast(id) {
	const timer = timers.get(id);
	if (timer !== void 0) {
		clearTimeout(timer);
		timers.delete(id);
	}
	toasts = toasts.filter((t) => t.id !== id);
	emit();
}
function subscribeToasts(fn) {
	listeners.add(fn);
	return () => {
		listeners.delete(fn);
	};
}
function getToasts() {
	return toasts;
}
/** 插件卸载时清理全部定时器与监听（由 apply 的 ctx.effect 挂接）。 */
function disposeToasts() {
	for (const timer of timers.values()) clearTimeout(timer);
	timers.clear();
	toasts = [];
	listeners.clear();
}
/** 应用内 toast 堆栈组件（注册进 shell.overlay 槽位）。 */
function ToastStack() {
	const [, force] = react.useState(0);
	react.useEffect(() => subscribeToasts(() => force((n) => n + 1)), []);
	const items = getToasts();
	if (items.length === 0) return null;
	return react.createElement("div", { className: "tn-toast-stack" }, items.map((t) => react.createElement("div", {
		key: t.id,
		className: "tn-toast",
		onClick: () => {
			if (t.sessionId !== void 0) openSession(t.sessionId);
			dismissToast(t.id);
		}
	}, react.createElement("span", { className: "tn-toast-dot" }), react.createElement("div", { className: "tn-toast-main" }, react.createElement("div", { className: "tn-toast-title" }, t.title), react.createElement("div", { className: "tn-toast-body" }, t.body)), react.createElement("button", {
		type: "button",
		className: "tn-toast-close",
		"aria-label": "关闭",
		onClick: (e) => {
			e.stopPropagation();
			dismissToast(t.id);
		}
	}, "×"))));
}
//#endregion
//#region src/client/watcher.ts
/**
* 监听顶层会话的运行/等待状态变化：
* - running→idle：一轮任务完成（onComplete）。
* - pendingInteraction 从无到有：会话在等用户输入/审批（onWaitStart），
*   期间 agent 状态保持 running，完成通知不会触发，需要单独检测。
*
* - 只关心顶层会话（parentId 为空），子代理会话不提醒，避免噪声。
* - blank（从未发过消息）的会话不参与。
* - 首次调用只播种当前状态，不触发任何通知。
*
* @param list sessions.list 快照存储（getSnapshot + subscribe）。
* @param onComplete 会话完成回调。
* @param onWaitStart 会话等待用户输入/审批回调。
* @returns 取消订阅函数，插件卸载时应调用。
*/
function watchCompletions(list, onComplete, onWaitStart) {
	const running = /* @__PURE__ */ new Map();
	const waiting = /* @__PURE__ */ new Set();
	const check = () => {
		const byId = list.getSnapshot().byId;
		for (const id of [...running.keys()]) if (byId[id] === void 0) running.delete(id);
		for (const id of [...waiting]) if (byId[id] === void 0) waiting.delete(id);
		for (const id of Object.keys(byId)) {
			const row = byId[id];
			if (row === void 0) continue;
			if (row.parentId !== void 0) continue;
			if (row.blank) {
				running.delete(id);
				waiting.delete(id);
				continue;
			}
			if (row.pendingInteraction !== void 0) {
				if (!waiting.has(id)) {
					waiting.add(id);
					onWaitStart?.({
						sessionId: id,
						title: row.displayTitle
					});
				}
			} else waiting.delete(id);
			const was = running.get(id);
			const now = row.running;
			if (was === true && now === false) {
				running.set(id, false);
				onComplete({
					sessionId: id,
					title: row.displayTitle
				});
			} else running.set(id, now);
		}
	};
	check();
	return list.subscribe(check);
}
//#endregion
//#region src/client/locales.ts
/**
* task-notify 客户端文案（zh/en 双语）。
* 全部设置 UI 文案必须走 t()，不硬编码中文。
*/
const NS = "task-notify";
const DICTS = {
	zh: {
		"settings.title": "任务完成通知",
		"settings.test": "测试",
		"settings.testToastTitle": "这是一条测试通知",
		"settings.testToastBody": "任务完成通知（测试）",
		"settings.testButton": "测试通知",
		"settings.connecting": "正在连接…",
		"settings.windowsOnly": "桌面通知仅支持 Windows",
		"toast.untitled": "未命名会话",
		"toast.done": "任务完成",
		"toast.wait": "等待你的输入/审批",
		"field.desktop": "桌面通知",
		"field.desktopSub": "独立于浏览器，页面关闭也能收到",
		"field.toast": "应用内提示",
		"field.toastSub": "页面右下角 toast",
		"field.sound": "提示音",
		"field.soundSub": "任务完成时播放",
		"field.error": "错误提醒",
		"field.errorSub": "任务失败时弹出红色卡片",
		"row.foot": "卡片样式、字体与音色在设置页「任务完成通知」中调整",
		"page.desc": "会话一轮任务结束时提醒你；桌面卡片为自绘置顶窗口，不依赖系统通知开关。",
		"card.channels": "通知通道",
		"card.style": "卡片样式",
		"card.font": "字体",
		"card.sound": "提示音",
		"field.theme": "主题",
		"field.accent": "强调色",
		"field.position": "位置",
		"field.duration": "显示时长",
		"field.fontSize": "字号",
		"field.fontFamily": "字体",
		"field.soundEnable": "开启提示音",
		"field.soundEnableSub": "任务完成时播放，独立于浏览器",
		"field.soundType": "提示音",
		"field.volume": "音量",
		"field.volumeFixedSub": "系统提示音不支持调节",
		"options.theme.dark": "深色",
		"options.theme.light": "浅色",
		"options.position.br": "右下",
		"options.position.bl": "左下",
		"options.position.tr": "右上",
		"options.position.tl": "左上",
		"options.duration.4": "4 秒",
		"options.duration.6": "6 秒",
		"options.duration.8": "8 秒",
		"options.duration.10": "10 秒",
		"options.fontSize.11": "小",
		"options.fontSize.12": "标准",
		"options.fontSize.13": "大",
		"options.fontSize.14": "特大",
		"options.font.yahei": "微软雅黑",
		"options.font.default": "系统默认",
		"options.font.simsun": "宋体",
		"options.font.simhei": "黑体",
		"options.font.kaiti": "楷体",
		"options.sound.apple": "苹果三全音",
		"options.sound.ding": "叮",
		"options.sound.double": "双响",
		"options.sound.system": "系统提示音"
	},
	en: {
		"settings.title": "Task Notifications",
		"settings.test": "Test",
		"settings.testToastTitle": "This is a test notification",
		"settings.testToastBody": "Task notification (test)",
		"settings.testButton": "Send Test",
		"settings.connecting": "Connecting…",
		"settings.windowsOnly": "Desktop notifications are only supported on Windows",
		"toast.untitled": "Untitled session",
		"toast.done": "Task complete",
		"toast.wait": "Waiting for your input/approval",
		"field.desktop": "Desktop notification",
		"field.desktopSub": "Works independently of the browser, even when the page is closed",
		"field.toast": "In-app toast",
		"field.toastSub": "Bottom-right toast inside the page",
		"field.sound": "Sound",
		"field.soundSub": "Played when a task finishes",
		"field.error": "Error notification",
		"field.errorSub": "Show a red card when a task fails",
		"row.foot": "Card style, font, and sound are configured in Task Notifications settings",
		"page.desc": "Get notified when a session round finishes; the desktop card is a custom top-most window and does not depend on system notification settings.",
		"card.channels": "Notification channels",
		"card.style": "Card style",
		"card.font": "Font",
		"card.sound": "Sound",
		"field.theme": "Theme",
		"field.accent": "Accent",
		"field.position": "Position",
		"field.duration": "Duration",
		"field.fontSize": "Font size",
		"field.fontFamily": "Font",
		"field.soundEnable": "Enable sound",
		"field.soundEnableSub": "Plays when a task finishes, independent of the browser",
		"field.soundType": "Sound",
		"field.volume": "Volume",
		"field.volumeFixedSub": "System sound does not support volume control",
		"options.theme.dark": "Dark",
		"options.theme.light": "Light",
		"options.position.br": "Bottom right",
		"options.position.bl": "Bottom left",
		"options.position.tr": "Top right",
		"options.position.tl": "Top left",
		"options.duration.4": "4 sec",
		"options.duration.6": "6 sec",
		"options.duration.8": "8 sec",
		"options.duration.10": "10 sec",
		"options.fontSize.11": "Small",
		"options.fontSize.12": "Standard",
		"options.fontSize.13": "Large",
		"options.fontSize.14": "X-Large",
		"options.font.yahei": "Microsoft YaHei UI",
		"options.font.default": "System default",
		"options.font.simsun": "SimSun",
		"options.font.simhei": "SimHei",
		"options.font.kaiti": "KaiTi",
		"options.sound.apple": "Apple tri-tone",
		"options.sound.ding": "Ding",
		"options.sound.double": "Double beep",
		"options.sound.system": "System sound"
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
//#region src/client/settings.ts
const themeOptions = () => [{
	value: "dark",
	label: t("options.theme.dark")
}, {
	value: "light",
	label: t("options.theme.light")
}];
const ACCENT_COLORS = {
	green: "#57B478",
	blue: "#4A90D9",
	orange: "#E8A13D",
	purple: "#9B6FE8"
};
const positionOptions = () => [
	{
		value: "br",
		label: t("options.position.br")
	},
	{
		value: "bl",
		label: t("options.position.bl")
	},
	{
		value: "tr",
		label: t("options.position.tr")
	},
	{
		value: "tl",
		label: t("options.position.tl")
	}
];
const durationOptions = () => [
	{
		value: 4,
		label: t("options.duration.4")
	},
	{
		value: 6,
		label: t("options.duration.6")
	},
	{
		value: 8,
		label: t("options.duration.8")
	},
	{
		value: 10,
		label: t("options.duration.10")
	}
];
const fontSizeOptions = () => [
	{
		value: 11,
		label: t("options.fontSize.11")
	},
	{
		value: 12,
		label: t("options.fontSize.12")
	},
	{
		value: 13,
		label: t("options.fontSize.13")
	},
	{
		value: 14,
		label: t("options.fontSize.14")
	}
];
const fontOptions = () => [
	{
		value: "Microsoft YaHei UI",
		label: t("options.font.yahei")
	},
	{
		value: "Segoe UI",
		label: t("options.font.default")
	},
	{
		value: "SimSun",
		label: t("options.font.simsun")
	},
	{
		value: "SimHei",
		label: t("options.font.simhei")
	},
	{
		value: "KaiTi",
		label: t("options.font.kaiti")
	}
];
const soundTypeOptions = () => [
	{
		value: "apple",
		label: t("options.sound.apple")
	},
	{
		value: "ding",
		label: t("options.sound.ding")
	},
	{
		value: "double",
		label: t("options.sound.double")
	},
	{
		value: "system",
		label: t("options.sound.system")
	}
];
async function fetchHostConfig() {
	try {
		const res = await fetch("/task-notify/config");
		if (!res.ok) return null;
		const body = await res.json();
		if (body.ok === false) return null;
		return body;
	} catch {
		return null;
	}
}
async function patchHostConfig(patch) {
	try {
		const res = await fetch("/task-notify/config", {
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
/** 加载宿主配置到组件状态（卸载安全），并返回打补丁函数（失败回滚，乱序响应丢弃）。 */
function useHostConfig() {
	const [host, setHost] = react.useState(null);
	const latestSeq = react.useRef(0);
	const lastGood = react.useRef(null);
	react.useEffect(() => {
		let cancelled = false;
		fetchHostConfig().then((h) => {
			if (cancelled || h === null) return;
			lastGood.current = h;
			setHost(h);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	return [host, react.useCallback((p) => {
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
	}, [])];
}
/** 按当前开关触发测试（桌面卡片 + 应用内 toast）。 */
function fireTest(host, toastOn) {
	if (toastOn) pushToast({
		title: t("settings.testToastTitle"),
		body: t("settings.testToastBody")
	});
	if (host?.desktop === true || host?.sound === true) fetch("/task-notify/test", { method: "POST" }).catch(() => {});
}
/** 音量滑杆：拖动只改本地值，停顿 250ms 或失焦后再写宿主，避免拖动期间刷请求。 */
function VolumeSlider(props) {
	const [draft, setDraft] = react.useState(props.value);
	const timer = react.useRef(null);
	react.useEffect(() => {
		setDraft(props.value);
		if (timer.current !== null) {
			clearTimeout(timer.current);
			timer.current = null;
		}
	}, [props.value]);
	react.useEffect(() => () => {
		if (timer.current !== null) clearTimeout(timer.current);
	}, []);
	const commit = (value) => {
		setDraft(value);
		if (timer.current !== null) clearTimeout(timer.current);
		timer.current = setTimeout(() => {
			timer.current = null;
			props.onChange(value);
		}, 250);
	};
	return react.createElement("div", { className: "tn-volume" }, react.createElement("input", {
		type: "range",
		min: 0,
		max: 100,
		step: 5,
		value: draft,
		disabled: props.disabled,
		className: "tn-range",
		onChange: (e) => commit(Number(e.target.value)),
		onBlur: () => {
			if (timer.current !== null) {
				clearTimeout(timer.current);
				timer.current = null;
			}
			props.onChange(draft);
		}
	}), react.createElement("span", { className: "tn-volume-value" }, `${draft}%`));
}
/**
* settings.general.item 设置行（重做版）：紧凑卡片，快速开关 + 测试。
* 完整样式选项在设置页「任务完成通知」。
*/
function TaskNotifySettings() {
	const [, force] = react.useState(0);
	react.useEffect(() => subscribeConfig(() => force((n) => n + 1)), []);
	const cfg = getConfig();
	const [host, patchHost] = useHostConfig();
	return react.createElement("div", { className: "tn-row" }, react.createElement("div", { className: "tn-row-head" }, react.createElement("span", { className: "tn-row-title" }, t("settings.title")), react.createElement("button", {
		type: "button",
		className: "tn-btn",
		onClick: () => fireTest(host, cfg.toast)
	}, t("settings.test"))), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.desktop")), react.createElement("span", { className: "tn-field-sub" }, t("field.desktopSub"))), react.createElement(Toggle, {
		checked: host?.desktop === true,
		onChange: (v) => patchHost({ desktop: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.toast")), react.createElement("span", { className: "tn-field-sub" }, t("field.toastSub"))), react.createElement(Toggle, {
		checked: cfg.toast,
		onChange: (v) => setConfig({ toast: v })
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.sound")), react.createElement("span", { className: "tn-field-sub" }, t("field.soundSub"))), react.createElement(Toggle, {
		checked: host?.sound === true,
		onChange: (v) => patchHost({ sound: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.error")), react.createElement("span", { className: "tn-field-sub" }, t("field.errorSub"))), react.createElement(Toggle, {
		checked: host?.errorNotify === true,
		onChange: (v) => patchHost({ errorNotify: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-row-foot" }, t("row.foot")));
}
/**
* settings.section 设置页「任务完成通知」：完整配置（通道 + 卡片样式 + 字体）+ 测试预览。
*/
function TaskNotifySection(_props) {
	const [, force] = react.useState(0);
	react.useEffect(() => subscribeConfig(() => force((n) => n + 1)), []);
	const cfg = getConfig();
	const [host, patchHost] = useHostConfig();
	const supported = host?.supported !== false;
	const hint = host === null ? t("settings.connecting") : supported ? null : t("settings.windowsOnly");
	return react.createElement("div", { className: "tn-page" }, react.createElement("div", { className: "tn-page-title" }, t("settings.title")), react.createElement("div", { className: "tn-page-desc" }, t("page.desc")), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, t("card.channels")), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.desktop")), react.createElement("span", { className: "tn-field-sub" }, t("field.desktopSub"))), react.createElement(Toggle, {
		checked: host?.desktop === true,
		onChange: (v) => patchHost({ desktop: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.toast")), react.createElement("span", { className: "tn-field-sub" }, t("field.toastSub"))), react.createElement(Toggle, {
		checked: cfg.toast,
		onChange: (v) => setConfig({ toast: v })
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.error")), react.createElement("span", { className: "tn-field-sub" }, t("field.errorSub"))), react.createElement(Toggle, {
		checked: host?.errorNotify === true,
		onChange: (v) => patchHost({ errorNotify: v }),
		disabled: host === null
	}))), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, t("card.style")), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.theme")), react.createElement(Segmented, {
		value: host?.theme ?? "dark",
		options: themeOptions(),
		onChange: (v) => patchHost({ theme: String(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.accent")), react.createElement(Swatches, {
		value: host?.accent ?? "green",
		onChange: (v) => patchHost({ accent: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.position")), react.createElement(Segmented, {
		value: host?.position ?? "br",
		options: positionOptions(),
		onChange: (v) => patchHost({ position: String(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.duration")), react.createElement(Segmented, {
		value: host?.durationSec ?? 6,
		options: durationOptions(),
		onChange: (v) => patchHost({ durationSec: Number(v) }),
		disabled: host === null
	}))), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, t("card.font")), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.fontSize")), react.createElement(Segmented, {
		value: host?.fontSize ?? 12,
		options: fontSizeOptions(),
		onChange: (v) => patchHost({ fontSize: Number(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.fontFamily")), react.createElement("select", {
		className: "tn-select",
		value: host?.fontFamily ?? "Microsoft YaHei UI",
		disabled: host === null,
		onChange: (e) => patchHost({ fontFamily: e.target.value })
	}, fontOptions().map((f) => react.createElement("option", {
		key: f.value,
		value: f.value
	}, f.label))))), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, t("card.sound")), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.soundEnable")), react.createElement("span", { className: "tn-field-sub" }, t("field.soundEnableSub"))), react.createElement(Toggle, {
		checked: host?.sound === true,
		onChange: (v) => patchHost({ sound: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, t("field.soundType")), react.createElement(Segmented, {
		value: host?.soundType ?? "apple",
		options: soundTypeOptions(),
		onChange: (v) => patchHost({ soundType: String(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, t("field.volume")), host?.soundType === "system" ? react.createElement("span", { className: "tn-field-sub" }, t("field.volumeFixedSub")) : null), react.createElement(VolumeSlider, {
		value: host?.volume ?? 80,
		disabled: host === null || host?.soundType === "system",
		onChange: (v) => patchHost({ volume: v })
	}))), react.createElement("div", { className: "tn-page-actions" }, react.createElement("button", {
		type: "button",
		className: "tn-btn tn-btn-primary",
		onClick: () => fireTest(host, cfg.toast)
	}, t("settings.testButton")), hint !== null ? react.createElement("span", { className: "tn-settings-hint" }, hint) : null));
}
function Toggle(props) {
	return react.createElement("button", {
		type: "button",
		role: "switch",
		"aria-checked": props.checked,
		disabled: props.disabled === true,
		className: props.checked ? "tn-toggle tn-toggle-on" : "tn-toggle",
		onClick: () => props.onChange(!props.checked)
	}, react.createElement("span", { className: "tn-toggle-knob" }));
}
function Segmented(props) {
	return react.createElement("div", { className: "tn-seg" }, props.options.map((o) => react.createElement("button", {
		key: String(o.value),
		type: "button",
		disabled: props.disabled === true,
		className: o.value === props.value ? "tn-seg-item tn-seg-active" : "tn-seg-item",
		onClick: () => props.onChange(o.value)
	}, o.label)));
}
function Swatches(props) {
	return react.createElement("div", { className: "tn-swatches" }, Object.entries(ACCENT_COLORS).map(([key, color]) => react.createElement("button", {
		key,
		type: "button",
		title: key,
		disabled: props.disabled === true,
		className: key === props.value ? "tn-swatch tn-swatch-active" : "tn-swatch",
		style: { background: color },
		onClick: () => props.onChange(key)
	})));
}
//#endregion
//#region src/client/styles.ts
/**
* 插件样式：一次性注入，卸载时由客户端运行时的 style 清理机制移除。
* 颜色全部使用 DSH 主题变量（--dsw-alias-* / --dsw-shadow-*），跟随深浅色主题。
*/
const CSS = `
/* ── 应用内 toast 堆栈（shell.overlay） ───────────────────── */
.tn-toast-stack {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}
.tn-toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-overlay);
  box-shadow: var(--dsw-shadow-lv3);
  cursor: pointer;
  animation: tn-toast-in 0.18s ease-out;
}
.tn-toast:hover {
  border-color: var(--dsw-alias-border-l1);
}
.tn-toast-dot {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--dsw-alias-state-success-primary);
}
.tn-toast-main {
  min-width: 0;
  flex: 1;
}
.tn-toast-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tn-toast-body {
  margin-top: 2px;
  font-size: 12px;
  line-height: 16px;
  color: var(--dsw-alias-label-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tn-toast-close {
  flex: none;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  font-size: 16px;
  line-height: 1;
  padding: 2px;
  cursor: pointer;
}
.tn-toast-close:hover {
  color: var(--dsw-alias-label-primary);
}
@keyframes tn-toast-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}

/* ── 通用控件 ─────────────────────────────────────────────── */
.tn-toggle {
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
.tn-toggle:disabled {
  opacity: 0.5;
  cursor: default;
}
.tn-toggle-on {
  background: var(--dsw-alias-brand-primary);
}
.tn-toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.15s;
}
.tn-toggle-on .tn-toggle-knob {
  left: 16px;
}

.tn-btn {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  padding: 2px 10px;
  cursor: pointer;
}
.tn-btn:hover {
  color: var(--dsw-alias-label-primary);
  border-color: var(--dsw-alias-brand-primary);
}
.tn-btn-primary {
  background: var(--dsw-alias-brand-primary);
  border-color: var(--dsw-alias-brand-primary);
  color: #fff;
  padding: 5px 16px;
  font-size: 13px;
  line-height: 20px;
}
.tn-btn-primary:hover {
  color: #fff;
  opacity: 0.9;
}

.tn-settings-hint {
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

/* ── 设置行（settings.general.item） ───────────────────────── */
.tn-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0;
  min-width: 0;
}
.tn-row-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tn-row-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.tn-row-foot {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

/* ── 字段行（label 左，控件右） ────────────────────────────── */
.tn-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
}
.tn-field-label {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.tn-field-label > span:first-child {
  font-size: 13px;
  color: var(--dsw-alias-label-primary);
}
.tn-field-sub {
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}

/* ── 设置页（settings.section） ────────────────────────────── */
.tn-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 560px;
  padding: 4px 2px;
}
.tn-page-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.tn-page-desc {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  margin-top: -6px;
}
.tn-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  padding: 12px 14px;
}
.tn-card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-tertiary);
}
.tn-card .tn-field + .tn-field {
  border-top: 1px solid var(--dsw-alias-border-l1);
  padding-top: 8px;
}
.tn-page-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 分段选择 */
.tn-seg {
  display: inline-flex;
  gap: 2px;
  background: var(--dsw-alias-fill-l2);
  border-radius: 8px;
  padding: 2px;
}
.tn-seg-item {
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
  padding: 2px 10px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.tn-seg-item:hover {
  color: var(--dsw-alias-label-primary);
}
.tn-seg-item:disabled {
  opacity: 0.5;
  cursor: default;
}
.tn-seg-active {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

/* 强调色色板 */
.tn-swatches {
  display: inline-flex;
  gap: 8px;
}
.tn-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
}
.tn-swatch:disabled {
  opacity: 0.5;
  cursor: default;
}
.tn-swatch-active {
  box-shadow:
    0 0 0 2px var(--dsw-alias-bg-layer-1),
    0 0 0 3.5px var(--dsw-alias-brand-primary);
}

/* 字体下拉 */
.tn-select {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 6px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  padding: 4px 8px;
  min-width: 110px;
  cursor: pointer;
}
.tn-select:disabled {
  opacity: 0.5;
  cursor: default;
}

/* 音量滑块 */
.tn-volume {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tn-range {
  width: 120px;
  height: 18px;
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
}
.tn-range:disabled {
  opacity: 0.5;
  cursor: default;
}
.tn-volume-value {
  min-width: 34px;
  text-align: right;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}
`;
/** 注入插件样式（幂等）；返回清理函数，由 apply 挂到 ctx.effect。 */
function injectStyles() {
	if (typeof document === "undefined") return () => {};
	if (document.querySelector("style[data-plugin-css=\"dsh-plugin-task-notify\"]") !== null) return () => document.querySelector("style[data-plugin-css=\"dsh-plugin-task-notify\"]")?.remove();
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-plugin-task-notify";
	tag.dataset.pluginCss = "dsh-plugin-task-notify";
	tag.textContent = CSS;
	document.head.appendChild(tag);
	return () => tag.remove();
}
//#endregion
//#region src/client.ts
const inject = [
	"sessions",
	"slots",
	"locale"
];
/**
* dsh-plugin-task-notify — 任务完成通知（Client 半）。
*
* 机制：订阅 ctx.sessions.list 快照存储，监听顶层会话 running→idle 翻转
* （即一轮任务完成），触发应用内 toast。**系统级桌面通知由 Host 半负责**
* （agent/status + Windows 原生气泡，独立于浏览器页面），客户端只做页面内提示
* 与设置行（通过 /task-notify/* HTTP 桥控制宿主开关）。
* UI 全部走槽位：shell.overlay（toast 堆栈）+ settings.general.item（设置行）。
*/
function apply(ctx) {
	ctx.effect(() => injectStyles(), "task-notify: styles");
	ctx.effect(() => disposeToasts);
	const sessions = ctx.get("sessions");
	const slots = ctx.get("slots");
	const locale = ctx.get("locale");
	if (locale !== void 0) {
		const translate = locale.bind(NS);
		setTranslator((key, params) => params !== void 0 ? translate(key, params) : translate(key));
		ctx.effect(() => locale.register(NS, DICTS), "task-notify: dictionaries");
	}
	setOpenSession((sessionId) => {
		try {
			sessions.open(sessionId);
		} catch {}
	});
	const unwatch = watchCompletions(sessions.list, (info) => {
		if (!getConfig().toast) return;
		pushToast({
			title: info.title !== "" ? info.title : t("toast.untitled"),
			body: t("toast.done"),
			sessionId: info.sessionId
		});
	}, (info) => {
		if (!getConfig().toast) return;
		pushToast({
			title: info.title !== "" ? info.title : t("toast.untitled"),
			body: t("toast.wait"),
			sessionId: info.sessionId
		});
	});
	ctx.effect(() => unwatch);
	slots.inject("shell.overlay", () => slots.register({
		name: "shell.overlay",
		id: "task-notify-toasts",
		order: 100
	}, ToastStack));
	slots.inject("settings.general.item", () => slots.register({
		name: "settings.general.item",
		id: "task-notify",
		order: 30
	}, TaskNotifySettings));
	slots.inject("settings.section", () => slots.register({
		name: "settings.section",
		id: "task-notify",
		order: 25,
		label: () => t("settings.title")
	}, TaskNotifySection));
}
//#endregion
exports.apply = apply;
exports.inject = inject;

		return module.exports;
	}
});
