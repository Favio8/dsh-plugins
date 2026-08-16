/**
 * dsh-plugin-chat-jump — Client 半：对话流左侧圆点跳转条（类 Codex）。
 *
 * 机制（纯 DOM，零 shadow 官方渲染）：
 * - 对话滚动容器带官方稳定属性 `data-conversation-scroll`；
 * - 每条消息是 `div[data-chat-flow-kind="user"]`（用户消息）+ `data-chat-flow-key`（稳定 key）；
 * - MutationObserver 跟踪容器出现/消失、消息增删与文本流式更新；
 * - 滚动时 scroll-spy 高亮当前点（用户消息顺序稳定，二分查找）；
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
/** 圆点直径与间距（固定一簇的排版参数）。 */
const DOT_SIZE = 7
const DOT_GAP = 8
/** 长会话时圆点簇的最大可视高度，超出内部滚动。 */
const MAX_CLUSTER_H = 320

interface Dot {
  key: string
  el: HTMLElement
  label: string
}

export function apply(ctx: {
  get(name: string): unknown
  effect(fn: () => unknown, label?: string): void
}): void {
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
  ctx.effect(() => injectStyles(), 'chat-jump: styles')
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
    let containerRO: ResizeObserver | null = null
    let rootObserver: MutationObserver | null = null
    let raf = 0
    let scrollRaf = 0
    let userEls: HTMLElement[] = []

    const collectDots = (): Dot[] => {
      if (container === null) return []
      return Array.from(container.querySelectorAll<HTMLElement>(USER_SEL)).map((el, i) => ({
        key: el.getAttribute('data-chat-flow-key') ?? `user-${i}`,
        el,
        label: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 40),
      }))
    }

    /** 会话头「对话」视图 tab（zh: 对话 / en: Conversation）。 */
    const findChatTab = (): HTMLElement | null => {
      for (const el of document.querySelectorAll<HTMLElement>('[role="tab"]')) {
        const text = (el.textContent ?? '').trim()
        if (text === '对话' || text === 'Conversation') return el
      }
      return null
    }

    /**
     * 轨道水平位置：优先对齐会话头「对话」tab 的正下方（左缘对齐）；
     * 回退到正文列起点（取所有 flow 节点中最靠左的，避开居中的
     * compaction 摘要条等带出巨大假偏移的首节点）。
     */
    const horizontalInset = (): number => {
      if (container === null) return 24
      const cLeft = container.getBoundingClientRect().left
      const tab = findChatTab()
      if (tab !== null) {
        const tabLeft = tab.getBoundingClientRect().left - cLeft
        if (tabLeft >= 0) return tabLeft
      }
      const flows = Array.from(container.querySelectorAll<HTMLElement>('[data-chat-flow-key]'))
      if (flows.length > 0) {
        let min = Number.POSITIVE_INFINITY
        for (const el of flows) {
          min = Math.min(min, el.getBoundingClientRect().left - cLeft)
        }
        if (Number.isFinite(min) && min > 0) return min
      }
      const cs = getComputedStyle(container)
      return Number.parseFloat(cs.paddingLeft) || 24
    }

    /** 用户消息按文档流从上到下排列，二分即可，避免长会话每帧全量 getBoundingClientRect。 */
    const computeActive = (): void => {
      if (container === null) return
      const cTop = container.getBoundingClientRect().top + HEADROOM
      let current: string | null = null
      let lo = 0
      let hi = userEls.length - 1
      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        const el = userEls[mid]
        if (!el.isConnected) break
        if (el.getBoundingClientRect().top <= cTop) {
          current = el.getAttribute('data-chat-flow-key') ?? null
          lo = mid + 1
        } else {
          hi = mid - 1
        }
      }
      setActiveKey(current)
    }

    const handleScroll = (): void => {
      cancelAnimationFrame(scrollRaf)
      scrollRaf = requestAnimationFrame(computeActive)
    }

    const refresh = (): void => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (container === null) return
        const nextDots = collectDots()
        userEls = nextDots.map((d) => d.el)
        setDots((prev) => {
          if (
            prev.length === nextDots.length &&
            prev.every(
              (d, i) =>
                d.key === nextDots[i].key &&
                d.el === nextDots[i].el &&
                d.label === nextDots[i].label,
            )
          ) {
            return prev
          }
          return nextDots
        })
        const r = container.getBoundingClientRect()
        setRect({ left: r.left + horizontalInset(), top: r.top, height: r.height })
        computeActive()
      })
    }

    const attach = (c: HTMLElement): void => {
      container = c
      containerRef.current = c
      containerObserver = new MutationObserver(refresh)
      containerObserver.observe(c, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'data-chat-flow-kind', 'data-chat-flow-key'],
      })
      // 侧边栏收回/展开会改变容器尺寸与位置 → ResizeObserver 同步
      containerRO = new ResizeObserver(refresh)
      containerRO.observe(c)
      c.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', refresh)
      refresh()
    }

    const detach = (): void => {
      containerObserver?.disconnect()
      containerObserver = null
      containerRO?.disconnect()
      containerRO = null
      if (container !== null) container.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(raf)
      raf = 0
      cancelAnimationFrame(scrollRaf)
      scrollRaf = 0
      window.removeEventListener('resize', refresh)
      container = null
      containerRef.current = null
      userEls = []
      setDots([])
      setRect(null)
      setActiveKey(null)
    }

    const find = (): void => {
      // 多个会话可能同时留在 DOM 中，优先取当前可见的滚动容器。
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(SCROLL_SEL))
      const visible = candidates.find((el) => {
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      })
      const c = visible ?? candidates[0] ?? null
      if (c !== null && c !== container) {
        detach()
        attach(c)
      } else if (c === null && container !== null) {
        detach()
      } else {
        // 容器未变但布局变了（如侧边栏折叠改的是 body 类名）→ 刷新位置
        refresh()
      }
    }

    find()
    rootObserver = new MutationObserver(find)
    rootObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    })

    return () => {
      detach()
      rootObserver?.disconnect()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(scrollRaf)
    }
  }, [])

  if (rect === null || dots.length < MIN_DOTS) return null

  const jump = (dot: Dot): void => {
    const c = containerRef.current
    if (c === null || !dot.el.isConnected) return
    const target =
      dot.el.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop - HEADROOM
    c.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
  }

  // 固定一簇：集中堆叠（最早在上），整体在消息区内垂直居中；过长时簇内滚动。
  const clusterH = dots.length * DOT_SIZE + (dots.length - 1) * DOT_GAP
  const visibleH = Math.min(clusterH, MAX_CLUSTER_H)
  const clusterTop = rect.top + Math.max(0, (rect.height - visibleH) / 2)

  return React.createElement(
    'div',
    {
      className: clusterH > MAX_CLUSTER_H ? 'cj-rail cj-rail-overflow' : 'cj-rail',
      style: { left: rect.left, top: clusterTop },
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
  gap: 8px;
  width: 14px;
  z-index: 300;
  pointer-events: none;
}
.cj-rail-overflow {
  pointer-events: auto;
  overflow-y: auto;
  max-height: 320px;
  padding: 2px 1px;
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

function injectStyles(): () => void {
  if (typeof document === 'undefined') return () => {}
  const selector = 'style[data-plugin-css="dsh-plugin-chat-jump"]'
  if (document.querySelector(selector) !== null) {
    return () => document.querySelector(selector)?.remove()
  }
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-plugin-chat-jump'
  tag.dataset.pluginCss = 'dsh-plugin-chat-jump'
  tag.textContent = CSS
  document.head.appendChild(tag)
  return () => tag.remove()
}
