import * as React from 'react'

export interface ToastItem {
  id: number
  title: string
  body: string
  sessionId?: string
  createdAt: number
}

const MAX_TOASTS = 4
const AUTO_DISMISS_MS = 6000

let toasts: ToastItem[] = []
let seq = 0
const listeners = new Set<() => void>()
const timers = new Map<number, ReturnType<typeof setTimeout>>()
let openSession: (sessionId: string) => void = () => {
  /* 由 apply 注入 */
}

function emit(): void {
  for (const fn of [...listeners]) fn()
}

/** 由插件 apply 注入"点击 toast 打开会话"的实现（需要 ctx.sessions）。 */
export function setOpenSession(fn: (sessionId: string) => void): void {
  openSession = fn
}

export function pushToast(item: Omit<ToastItem, 'id' | 'createdAt'>): void {
  const id = ++seq
  toasts = [...toasts, { ...item, id, createdAt: Date.now() }].slice(-MAX_TOASTS)
  const timer = setTimeout(() => {
    timers.delete(id)
    dismissToast(id)
  }, AUTO_DISMISS_MS)
  timers.set(id, timer)
  emit()
}

export function dismissToast(id: number): void {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

export function subscribeToasts(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function getToasts(): ToastItem[] {
  return toasts
}

/** 插件卸载时清理全部定时器与监听（由 apply 的 ctx.effect 挂接）。 */
export function disposeToasts(): void {
  for (const timer of timers.values()) clearTimeout(timer)
  timers.clear()
  toasts = []
  listeners.clear()
}

/** 应用内 toast 堆栈组件（注册进 shell.overlay 槽位）。 */
export function ToastStack(): React.ReactElement | null {
  const [, force] = React.useState(0)
  React.useEffect(() => subscribeToasts(() => force((n) => n + 1)), [])
  const items = getToasts()
  if (items.length === 0) return null
  return React.createElement(
    'div',
    { className: 'tn-toast-stack' },
    items.map((t) =>
      React.createElement(
        'div',
        {
          key: t.id,
          className: 'tn-toast',
          onClick: () => {
            if (t.sessionId !== undefined) openSession(t.sessionId)
          },
        },
        React.createElement('span', { className: 'tn-toast-dot' }),
        React.createElement(
          'div',
          { className: 'tn-toast-main' },
          React.createElement('div', { className: 'tn-toast-title' }, t.title),
          React.createElement('div', { className: 'tn-toast-body' }, t.body),
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'tn-toast-close',
            'aria-label': '关闭',
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation()
              dismissToast(t.id)
            },
          },
          '×',
        ),
      ),
    ),
  )
}
