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
`

/** 注入插件样式（幂等；每次检查 DOM，插件停止后再次启用也能恢复样式）。 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return
  if (document.querySelector('style[data-plugin-css="dsh-plugin-task-notify"]') !== null) return
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-plugin-task-notify'
  tag.dataset.pluginCss = 'dsh-plugin-task-notify'
  tag.textContent = CSS
  document.head.appendChild(tag)
}
