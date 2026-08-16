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
//#region src/client/settings.ts
const THEME_OPTIONS = [{
	value: "dark",
	label: "深色"
}, {
	value: "light",
	label: "浅色"
}];
const ACCENT_COLORS = {
	green: "#57B478",
	blue: "#4A90D9",
	orange: "#E8A13D",
	purple: "#9B6FE8"
};
const POSITION_OPTIONS = [
	{
		value: "br",
		label: "右下"
	},
	{
		value: "bl",
		label: "左下"
	},
	{
		value: "tr",
		label: "右上"
	},
	{
		value: "tl",
		label: "左上"
	}
];
const DURATION_OPTIONS = [
	{
		value: 4,
		label: "4 秒"
	},
	{
		value: 6,
		label: "6 秒"
	},
	{
		value: 8,
		label: "8 秒"
	},
	{
		value: 10,
		label: "10 秒"
	}
];
const FONT_SIZE_OPTIONS = [
	{
		value: 11,
		label: "小"
	},
	{
		value: 12,
		label: "标准"
	},
	{
		value: 13,
		label: "大"
	},
	{
		value: 14,
		label: "特大"
	}
];
const FONT_OPTIONS = [
	{
		value: "Microsoft YaHei UI",
		label: "微软雅黑"
	},
	{
		value: "Segoe UI",
		label: "系统默认"
	},
	{
		value: "SimSun",
		label: "宋体"
	},
	{
		value: "SimHei",
		label: "黑体"
	},
	{
		value: "KaiTi",
		label: "楷体"
	}
];
const SOUND_TYPE_OPTIONS = [
	{
		value: "apple",
		label: "苹果三全音"
	},
	{
		value: "ding",
		label: "叮"
	},
	{
		value: "double",
		label: "双响"
	},
	{
		value: "system",
		label: "系统提示音"
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
		title: "这是一条测试通知",
		body: "任务完成通知（测试）"
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
	return react.createElement("div", { className: "tn-row" }, react.createElement("div", { className: "tn-row-head" }, react.createElement("span", { className: "tn-row-title" }, "任务完成通知"), react.createElement("button", {
		type: "button",
		className: "tn-btn",
		onClick: () => fireTest(host, cfg.toast)
	}, "测试")), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "桌面通知"), react.createElement("span", { className: "tn-field-sub" }, "独立于浏览器，页面关闭也能收到")), react.createElement(Toggle, {
		checked: host?.desktop === true,
		onChange: (v) => patchHost({ desktop: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "应用内提示"), react.createElement("span", { className: "tn-field-sub" }, "页面右下角 toast")), react.createElement(Toggle, {
		checked: cfg.toast,
		onChange: (v) => setConfig({ toast: v })
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "提示音"), react.createElement("span", { className: "tn-field-sub" }, "任务完成时播放")), react.createElement(Toggle, {
		checked: host?.sound === true,
		onChange: (v) => patchHost({ sound: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-row-foot" }, "卡片样式、字体与音色在设置页「任务完成通知」中调整"));
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
	const hint = host === null ? "正在连接…" : supported ? null : "桌面通知仅支持 Windows";
	return react.createElement("div", { className: "tn-page" }, react.createElement("div", { className: "tn-page-title" }, "任务完成通知"), react.createElement("div", { className: "tn-page-desc" }, "会话一轮任务结束时提醒你；桌面卡片为自绘置顶窗口，不依赖系统通知开关。"), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, "通知通道"), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "桌面通知"), react.createElement("span", { className: "tn-field-sub" }, "独立于浏览器，页面关闭也能收到")), react.createElement(Toggle, {
		checked: host?.desktop === true,
		onChange: (v) => patchHost({ desktop: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "应用内提示"), react.createElement("span", { className: "tn-field-sub" }, "页面右下角 toast")), react.createElement(Toggle, {
		checked: cfg.toast,
		onChange: (v) => setConfig({ toast: v })
	}))), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, "卡片样式"), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "主题"), react.createElement(Segmented, {
		value: host?.theme ?? "dark",
		options: THEME_OPTIONS,
		onChange: (v) => patchHost({ theme: String(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "强调色"), react.createElement(Swatches, {
		value: host?.accent ?? "green",
		onChange: (v) => patchHost({ accent: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "位置"), react.createElement(Segmented, {
		value: host?.position ?? "br",
		options: POSITION_OPTIONS,
		onChange: (v) => patchHost({ position: String(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "显示时长"), react.createElement(Segmented, {
		value: host?.durationSec ?? 6,
		options: DURATION_OPTIONS,
		onChange: (v) => patchHost({ durationSec: Number(v) }),
		disabled: host === null
	}))), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, "字体"), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "字号"), react.createElement(Segmented, {
		value: host?.fontSize ?? 12,
		options: FONT_SIZE_OPTIONS,
		onChange: (v) => patchHost({ fontSize: Number(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "字体"), react.createElement("select", {
		className: "tn-select",
		value: host?.fontFamily ?? "Microsoft YaHei UI",
		disabled: host === null,
		onChange: (e) => patchHost({ fontFamily: e.target.value })
	}, FONT_OPTIONS.map((f) => react.createElement("option", {
		key: f.value,
		value: f.value
	}, f.label))))), react.createElement("div", { className: "tn-card" }, react.createElement("div", { className: "tn-card-title" }, "提示音"), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "开启提示音"), react.createElement("span", { className: "tn-field-sub" }, "任务完成时播放，独立于浏览器")), react.createElement(Toggle, {
		checked: host?.sound === true,
		onChange: (v) => patchHost({ sound: v }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, "提示音"), react.createElement(Segmented, {
		value: host?.soundType ?? "apple",
		options: SOUND_TYPE_OPTIONS,
		onChange: (v) => patchHost({ soundType: String(v) }),
		disabled: host === null
	})), react.createElement("div", { className: "tn-field" }, react.createElement("div", { className: "tn-field-label" }, react.createElement("span", null, "音量"), host?.soundType === "system" ? react.createElement("span", { className: "tn-field-sub" }, "系统提示音不支持调节") : null), react.createElement(VolumeSlider, {
		value: host?.volume ?? 80,
		disabled: host === null || host?.soundType === "system",
		onChange: (v) => patchHost({ volume: v })
	}))), react.createElement("div", { className: "tn-page-actions" }, react.createElement("button", {
		type: "button",
		className: "tn-btn tn-btn-primary",
		onClick: () => fireTest(host, cfg.toast)
	}, "测试通知"), hint !== null ? react.createElement("span", { className: "tn-settings-hint" }, hint) : null));
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
const inject = ["sessions", "slots"];
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
	setOpenSession((sessionId) => {
		try {
			sessions.open(sessionId);
		} catch {}
	});
	const unwatch = watchCompletions(sessions.list, (info) => {
		if (!getConfig().toast) return;
		pushToast({
			title: info.title !== "" ? info.title : "未命名会话",
			body: "任务完成",
			sessionId: info.sessionId
		});
	}, (info) => {
		if (!getConfig().toast) return;
		pushToast({
			title: info.title !== "" ? info.title : "未命名会话",
			body: "等待你的输入/审批",
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
		label: () => "任务完成通知"
	}, TaskNotifySection));
}
//#endregion
exports.apply = apply;
exports.inject = inject;

		return module.exports;
	}
});
