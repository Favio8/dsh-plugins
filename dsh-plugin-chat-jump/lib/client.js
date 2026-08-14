window.__ModuleLoader__.load({
	id: "dsh-plugin-chat-jump",
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
//#region src/client.ts
/**
* dsh-plugin-chat-jump — Client 半：对话流左侧圆点跳转条（类 Codex）。
*
* 机制（纯 DOM，零 shadow 官方渲染）：
* - 对话滚动容器带官方稳定属性 `data-conversation-scroll`；
* - 每条消息是 `div[data-chat-flow-kind="user"]`（用户消息）+ `data-chat-flow-key`（稳定 key）；
* - MutationObserver 跟踪容器出现/消失与消息增删；滚动时 scroll-spy 高亮当前点；
* - 点击圆点平滑滚动定位到该条用户消息；hover 显示消息预览。
* UI 注册在 shell.overlay（自备 id，不占用官方槽位）。
*/
const inject = ["slots"];
const SCROLL_SEL = "[data-conversation-scroll]";
const USER_SEL = "[data-chat-flow-kind=\"user\"]";
/** 「当前」判定阈值：距容器顶部 120px 内视为已到达。 */
const HEADROOM = 120;
/** 少于该数量用户消息时隐藏跳转条，避免噪音。 */
const MIN_DOTS = 2;
function apply(ctx) {
	injectStyles();
	const slots = ctx.get("slots");
	if (slots === void 0) return;
	ctx.effect(() => slots.inject("shell.overlay", () => slots.register({
		name: "shell.overlay",
		id: "chat-jump-rail",
		order: 90
	}, ChatJumpRail)), "chat-jump: rail overlay");
}
function ChatJumpRail() {
	const [dots, setDots] = react.useState([]);
	const [activeKey, setActiveKey] = react.useState(null);
	const [rect, setRect] = react.useState(null);
	const containerRef = react.useRef(null);
	react.useEffect(() => {
		let container = null;
		let containerObserver = null;
		let rootObserver = null;
		let raf = 0;
		const collectDots = () => {
			if (container === null) return [];
			const cRect = container.getBoundingClientRect();
			return Array.from(container.querySelectorAll(USER_SEL)).map((el, i) => {
				const rect = el.getBoundingClientRect();
				return {
					key: el.getAttribute("data-chat-flow-key") ?? `user-${i}`,
					el,
					label: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40),
					y: rect.top - cRect.top
				};
			});
		};
		/** 轨道水平位置 = 对话内容列起点（容器 padding 或首条消息节点左偏移）。 */
		const contentInset = () => {
			if (container === null) return 24;
			const flowEl = container.querySelector("[data-chat-flow-key]");
			if (flowEl !== null) {
				const inset = flowEl.getBoundingClientRect().left - container.getBoundingClientRect().left;
				if (inset > 0) return inset;
			}
			const cs = getComputedStyle(container);
			return Number.parseFloat(cs.paddingLeft) || 24;
		};
		const computeActive = () => {
			if (container === null) return;
			const cTop = container.getBoundingClientRect().top + HEADROOM;
			let current = null;
			for (const el of container.querySelectorAll(USER_SEL)) if (el.getBoundingClientRect().top <= cTop) current = el.getAttribute("data-chat-flow-key") ?? null;
			else break;
			setActiveKey(current);
		};
		const refresh = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				if (container === null) return;
				setDots(collectDots());
				const r = container.getBoundingClientRect();
				setRect({
					left: r.left + contentInset(),
					top: r.top,
					height: r.height
				});
				computeActive();
			});
		};
		const attach = (c) => {
			container = c;
			containerRef.current = c;
			containerObserver = new MutationObserver(refresh);
			containerObserver.observe(c, {
				childList: true,
				subtree: true
			});
			c.addEventListener("scroll", refresh, { passive: true });
			window.addEventListener("resize", refresh);
			refresh();
		};
		const detach = () => {
			containerObserver?.disconnect();
			containerObserver = null;
			if (container !== null) container.removeEventListener("scroll", refresh);
			window.removeEventListener("resize", refresh);
			container = null;
			containerRef.current = null;
			setDots([]);
			setRect(null);
			setActiveKey(null);
		};
		const find = () => {
			const c = document.querySelector(SCROLL_SEL);
			if (c !== null && c !== container) {
				detach();
				attach(c);
			} else if (c === null && container !== null) detach();
		};
		find();
		rootObserver = new MutationObserver(find);
		rootObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
		return () => {
			detach();
			rootObserver?.disconnect();
			cancelAnimationFrame(raf);
		};
	}, []);
	if (rect === null || dots.length < MIN_DOTS) return null;
	const jump = (dot) => {
		const c = containerRef.current;
		if (c === null) return;
		const target = dot.el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - HEADROOM;
		c.scrollTo({
			top: Math.max(0, target),
			behavior: "smooth"
		});
	};
	return react.createElement("div", {
		className: "cj-rail",
		style: {
			left: rect.left,
			top: rect.top,
			height: rect.height
		}
	}, dots.map((dot) => react.createElement("button", {
		key: dot.key,
		type: "button",
		style: { top: dot.y },
		className: dot.key === activeKey ? "cj-dot cj-dot-active" : "cj-dot",
		title: dot.label,
		"aria-label": dot.label,
		onClick: () => jump(dot)
	})));
}
const CSS = `
.cj-rail {
  position: fixed;
  width: 14px;
  overflow: hidden;
  z-index: 300;
  pointer-events: none;
}
.cj-dot {
  pointer-events: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 7px;
  height: 7px;
  border: 0;
  border-radius: 50%;
  padding: 0;
  background: var(--dsw-alias-fill-l3, var(--dsw-alias-border-l2));
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.cj-dot:hover {
  background: var(--dsw-alias-label-secondary);
  transform: translateX(-50%) scale(1.35);
}
.cj-dot:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.cj-dot-active {
  background: var(--dsw-alias-brand-primary);
  transform: translateX(-50%) scale(1.2);
}
`;
let injected = false;
function injectStyles() {
	if (injected) return;
	if (typeof document === "undefined") return;
	if (document.querySelector("style[data-plugin-css=\"dsh-plugin-chat-jump\"]") !== null) {
		injected = true;
		return;
	}
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-plugin-chat-jump";
	tag.dataset.pluginCss = "dsh-plugin-chat-jump";
	tag.textContent = CSS;
	document.head.appendChild(tag);
	injected = true;
}
//#endregion
exports.ChatJumpRail = ChatJumpRail;
exports.apply = apply;
exports.inject = inject;

		return module.exports;
	}
});
