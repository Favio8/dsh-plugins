/**
 * @file chip 悬浮提示：官方 backdrop 是 pointer-events:none，chip 的 title
 * 永远不会被浏览器原生 tooltip 触发。这里用坐标命中检测 + 自绘 tooltip，
 * 不拦截鼠标事件，不影响 textarea 的光标/点击行为。
 */

const CHIP_SEL = 'span[data-decoration="chip"][title^="@"]'

/** 命中当前鼠标位置下的 @file chip，返回标题文本；未命中返回 null。 */
function hitChip(x: number, y: number): string | null {
  for (const el of document.querySelectorAll<HTMLElement>(CHIP_SEL)) {
    const r = el.getBoundingClientRect()
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
      const title = el.getAttribute('title')
      if (title !== null && title !== '') return title
      return el.textContent ?? ''
    }
  }
  return null
}

function showTip(el: HTMLElement, x: number, y: number, text: string): void {
  el.textContent = text
  el.style.visibility = 'hidden'
  el.style.left = '0px'
  el.style.top = '0px'
  document.body.appendChild(el)
  const rect = el.getBoundingClientRect()
  const pad = 8
  const left = Math.max(pad, Math.min(x - rect.width / 2, window.innerWidth - rect.width - pad))
  let top = y - rect.height - 8
  if (top < pad) top = y + 12
  el.style.left = `${Math.round(left)}px`
  el.style.top = `${Math.round(top)}px`
  el.style.visibility = 'visible'
}

function hideTip(el: HTMLElement | null): void {
  if (el === null) return
  el.style.visibility = 'hidden'
  el.remove()
}

/** 安装 chip 悬浮提示；返回 disposer。 */
export function installChipTooltip(): () => void {
  if (typeof document === 'undefined') return () => {}
  let tip: HTMLElement | null = null
  let raf = 0
  let lastX = Number.NaN
  let lastY = Number.NaN

  const ensureTip = (): HTMLElement => {
    if (tip !== null) return tip
    tip = document.createElement('div')
    tip.className = 'wf-chip-tip'
    tip.setAttribute('aria-hidden', 'true')
    return tip
  }

  const scan = (): void => {
    raf = 0
    const title = hitChip(lastX, lastY)
    if (title === null) {
      hideTip(tip)
      tip = null
      return
    }
    showTip(ensureTip(), lastX, lastY, title)
  }

  const onMove = (event: MouseEvent): void => {
    lastX = event.clientX
    lastY = event.clientY
    if (raf !== 0) return
    raf = requestAnimationFrame(scan)
  }

  const onOut = (event: MouseEvent): void => {
    if (event.relatedTarget === null || (event.relatedTarget instanceof Node && !document.body.contains(event.relatedTarget))) {
      if (raf !== 0) cancelAnimationFrame(raf)
      raf = 0
      hideTip(tip)
      tip = null
    }
  }

  document.addEventListener('mousemove', onMove, true)
  document.addEventListener('mouseout', onOut, true)
  return () => {
    document.removeEventListener('mousemove', onMove, true)
    document.removeEventListener('mouseout', onOut, true)
    if (raf !== 0) cancelAnimationFrame(raf)
    hideTip(tip)
    tip = null
  }
}
