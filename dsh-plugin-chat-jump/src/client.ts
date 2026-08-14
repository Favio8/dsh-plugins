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

import * as React from 'react'

export const inject = ['slots']

const SCROLL_SEL = '[data-conversation-scroll]'
const USER_SEL = '[data-chat-flow-kind="user"]'
/** 「当前」判定阈值：距容器顶部 120px 内视为已到达。 */
const HEADROOM = 120
/** 少于该数量用户消息时隐藏跳转条，避免噪音。 */
const MIN_DOTS = 2

interface Dot {
  key: string
  el: HTMLElement
  label: string
}

export function apply(ctx: {
  get(name: string): unknown
  effect(fn: () => unknown, label?: string): void
}): void {
  injectStyles()
  const slots = ctx.get('slots') as
    | {
        inject(key: string, callback: () => unknown): () => void
        register(
          options: { name: string; id: string; order?: number },
          component: unknown,
        ): () => void
      }
    | undefined
  if (slots === undefined) return
  ctx.effect(
    () =>
      slots.inject('shell.overlay', () =>
        slots.register({ name: 'shell.overlay', id: 'chat-jump-rail', order: 90 }, ChatJumpRail),
      ),
    'chat-jump: rail overlay',
  )
}

export function ChatJumpRail(): React.ReactElement | null {
  const [dots, setDots] = React.useState<Dot[]>([])
  const [activeKey, setActiveKey] = React.useState<string | null>(null)
  const [rect, setRect] = React.useState<{ left: number; top: number; height: number } | null>(null)
  const containerRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    let container: HTMLElement | null = null
    let containerObserver: MutationObserver | null = null
    let rootObserver: MutationObserver | null = null
    let raf = 0

    const collectDots = (): Dot[] => {
      if (container === null) return []
      return Array.from(container.querySelectorAll<HTMLElement>(USER_SEL)).map((el, i) => ({
        key: el.getAttribute('data-chat-flow-key') ?? `user-${i}`,
        el,
        label: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40),
      }))
    }

    const computeActive = (): void => {
      if (container === null) return
      const cTop = container.getBoundingClientRect().top + HEADROOM
      let current: string | null = null
      for (const el of container.querySelectorAll<HTMLElement>(USER_SEL)) {
        if (el.getBoundingClientRect().top <= cTop) {
          current = el.getAttribute('data-chat-flow-key') ?? null
        } else {
          break
        }
      }
      setActiveKey(current)
    }

    const refresh = (): void => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (container === null) return
        setDots(collectDots())
        const r = container.getBoundingClientRect()
        setRect({ left: r.left, top: r.top, height: r.height })
        computeActive()
      })
    }

    const attach = (c: HTMLElement): void => {
      container = c
      containerRef.current = c
      containerObserver = new MutationObserver(refresh)
      containerObserver.observe(c, { childList: true, subtree: true })
      c.addEventListener('scroll', computeActive, { passive: true })
      window.addEventListener('resize', refresh)
      refresh()
    }

    const detach = (): void => {
      containerObserver?.disconnect()
      containerObserver = null
      if (container !== null) container.removeEventListener('scroll', computeActive)
      window.removeEventListener('resize', refresh)
      container = null
      containerRef.current = null
      setDots([])
      setRect(null)
      setActiveKey(null)
    }

    const find = (): void => {
      const c = document.querySelector<HTMLElement>(SCROLL_SEL)
      if (c !== null && c !== container) {
        detach()
        attach(c)
      } else if (c === null && container !== null) {
        detach()
      }
    }

    find()
    rootObserver = new MutationObserver(find)
    rootObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      detach()
      rootObserver?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  if (rect === null || dots.length < MIN_DOTS) return null

  const jump = (dot: Dot): void => {
    const c = containerRef.current
    if (c === null) return
    const target =
      dot.el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - HEADROOM
    c.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
  }

  return React.createElement(
    'div',
    {
      className: 'cj-rail',
      style: { left: Math.max(6, rect.left - 24), top: rect.top, height: rect.height },
    },
    dots.map((dot) =>
      React.createElement('button', {
        key: dot.key,
        type: 'button',
        className: dot.key === activeKey ? 'cj-dot cj-dot-active' : 'cj-dot',
        title: dot.label,
        'aria-label': dot.label,
        onClick: () => jump(dot),
      }),
    ),
  )
}

const CSS = `
.cj-rail {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 14px;
  padding-top: 96px;
  z-index: 300;
  pointer-events: none;
}
.cj-dot {
  pointer-events: auto;
  flex: none;
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
  transform: scale(1.35);
}
.cj-dot:focus-visible {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 2px;
}
.cj-dot-active {
  background: var(--dsw-alias-brand-primary);
  transform: scale(1.2);
}
`

let injected = false

function injectStyles(): void {
  if (injected) return
  if (typeof document === 'undefined') return
  if (document.querySelector('style[data-plugin-css="dsh-plugin-chat-jump"]') !== null) {
    injected = true
    return
  }
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-plugin-chat-jump'
  tag.dataset.pluginCss = 'dsh-plugin-chat-jump'
  tag.textContent = CSS
  document.head.appendChild(tag)
  injected = true
}
