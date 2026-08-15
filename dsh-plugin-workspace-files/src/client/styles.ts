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
`

/** 注入插件样式（幂等；每次检查 DOM，插件停止后再次启用也能恢复样式）。 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector('style[data-plugin-css="dsh-plugin-workspace-files"]') !== null) return
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-plugin-workspace-files'
  tag.dataset.pluginCss = 'dsh-plugin-workspace-files'
  tag.textContent = CSS
  document.head.appendChild(tag)
}
