/**
 * F2：修改文件点击 → 右侧预览抽屉。
 *
 * 机制：文档级捕获阶段点击委托（不 shadow 官方渲染）——命中产物 chip /
 * 文件 mention / 工具卡片路径时 stopPropagation，改为打开预览抽屉；
 * 拦截总开关关闭时完全不干预（回退官方「在系统中打开」）。
 */

import * as React from 'react'
import { readFile } from './bridge'
import { t } from './locales'
import { isMarkdownPath, renderMarkdown } from './markdown'
import { addRecent, closePreview, openPreview, prefsStore, previewStore, useStore } from './store'
import type { SessionsFace, WorkspacesFace } from './types'
import { basenameOf, isAbsolute, isPathTitle, joinAbs, relOf } from './paths'

/* ── 服务绑定（apply 时注入） ─────────────────────────────── */

let sessionsSvc: SessionsFace | undefined
let workspacesSvc: WorkspacesFace | undefined

export function bindPreviewServices(sessions: SessionsFace | undefined, workspaces: WorkspacesFace | undefined): void {
  sessionsSvc = sessions
  workspacesSvc = workspaces
}

/* ── 路径解析 ─────────────────────────────────────────────── */

function isUnder(abs: string, root: string): boolean {
  const a = abs.toLowerCase()
  const r = root.replace(/[\\/]+$/, '').toLowerCase()
  return a === r || a.startsWith(r + '\\') || a.startsWith(r + '/')
}

/** 从 title/文本解析为 cwd 内的绝对路径；无法确定时返回 null（不拦截）。 */
function resolveClickPath(cwd: string, title: string): string | null {
  if (title === '' || title === '.') return null
  if (isAbsolute(title)) return isUnder(title, cwd) ? title : null
  if (!isPathTitle(title)) return null
  const abs = joinAbs(cwd, title)
  return isUnder(abs, cwd) ? abs : null
}

/* ── 点击拦截（document capture） ─────────────────────────── */

let lastFocused: Element | null = null

export function installClickInterceptor(): () => void {
  const handler = (ev: MouseEvent): void => {
    if (!prefsStore.get().intercept) return
    if (sessionsSvc === undefined) return
    const snap = sessionsSvc.list.getSnapshot()
    const sessionId = snap.current
    if (sessionId === undefined) return
    const cwd = snap.byId[sessionId]?.cwd
    if (cwd === undefined || cwd === '') return

    const target = ev.target as Element | null
    if (target === null) return
    // 插件自身 UI（头部按钮 / 抽屉）自己处理点击，绝不拦截
    if (target.closest('.wf-folder-btn, .wf-drawer, .wf-drawer-backdrop') !== null) return
    const el = target.closest?.('button, a, [role="button"]') ?? null
    if (el === null) return
    const inProducedRow = el.closest('[data-produced-files-row]') !== null
    const title = el.getAttribute('title') ?? ''
    if (!inProducedRow && !isPathTitle(title)) return
    if (title === '') return
    const abs = resolveClickPath(cwd, title.trim())
    if (abs === null) return

    ev.preventDefault()
    ev.stopPropagation()
    lastFocused = el
    addRecent(sessionId, cwd, relOf(abs, cwd))
    openPreview(cwd, relOf(abs, cwd), false)
  }
  document.addEventListener('click', handler, true)
  return () => {
    document.removeEventListener('click', handler, true)
  }
}

/* ── 极简关键字高亮 ───────────────────────────────────────── */

const TOKEN_SRC =
  `("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)` +
  `|(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)` +
  `|\\b(import|export|from|default|const|let|var|function|return|class|interface|type|async|await|new|if|else|for|while|switch|case|break|continue|true|false|null|undefined|void|throw|try|catch|finally|this|typeof|instanceof|extends|implements|public|private|protected|static|readonly|enum|namespace|declare|as|of|in|do|yield|module|require|satisfies|keyof|infer)\\b`

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightLine(line: string): React.ReactNode[] {
  const escaped = escapeHtml(line)
  const re = new RegExp(TOKEN_SRC, 'g')
  const nodes: React.ReactNode[] = []
  let last = 0
  let i = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(escaped)) !== null) {
    if (m.index > last) nodes.push(escaped.slice(last, m.index))
    const cls = m[1] !== undefined ? 'wf-tok-str' : m[2] !== undefined ? 'wf-tok-com' : 'wf-tok-kw'
    nodes.push(React.createElement('span', { className: cls, key: i++ }, m[0]))
    last = m.index + m[0].length
  }
  if (last < escaped.length) nodes.push(escaped.slice(last))
  return nodes
}

/* ── 预览抽屉 ─────────────────────────────────────────────── */

interface LoadState {
  status: 'idle' | 'loading' | 'done' | 'error'
  content?: string
  binary?: boolean
  imageDataUrl?: string
  size?: number
  truncated?: boolean
  error?: string
  /** 当前已读字节（支持加载更多）。 */
  loadedBytes: number
}

const LOAD_CHUNK = 512 * 1024

export function PreviewDrawer(): React.ReactElement | null {
  const state = useStore(previewStore)
  const [load, setLoad] = React.useState<LoadState>({ status: 'idle', loadedBytes: 0 })
  const [copied, setCopied] = React.useState(false)
  const [mode, setMode] = React.useState<'render' | 'raw'>('render')
  const closeRef = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    if (!state.open) return
    setLoad({ status: 'loading', loadedBytes: 0 })
    setMode('render')
    const controller = new AbortController()
    void readFile(state.root, state.relPath, 0, LOAD_CHUNK, controller.signal)
      .then((r) => {
        if (r.ok) {
          setLoad({
            status: 'done',
            content: r.content,
            binary: r.binary,
            imageDataUrl: r.imageDataUrl,
            size: r.size,
            truncated: r.truncated,
            loadedBytes: r.content?.length ?? 0,
          })
        } else {
          setLoad({ status: 'error', error: r.error ?? '未知错误', loadedBytes: 0 })
        }
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setLoad({ status: 'error', error: String(error), loadedBytes: 0 })
      })
    return () => controller.abort()
  }, [state.open, state.root, state.relPath])

  // ESC 关闭 + 焦点管理
  React.useEffect(() => {
    if (!state.open) return
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') {
        ev.stopPropagation()
        closePreview()
      }
    }
    document.addEventListener('keydown', onKey, true)
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey, true)
      if (lastFocused instanceof HTMLElement) lastFocused.focus()
    }
  }, [state.open])

  if (!state.open) return null

  const rel = state.relPath
  const lines = load.content === undefined ? 0 : load.content.split('\n').length
  const md = isMarkdownPath(rel)
  const showMdRender = md && mode === 'render' && load.content !== undefined

  const loadMore = (): void => {
    const nextOffset = load.loadedBytes
    setLoad((prev) => ({ ...prev, status: 'loading' }))
    void readFile(state.root, rel, nextOffset, LOAD_CHUNK).then((r) => {
      if (r.ok) {
        setLoad((prev) => ({
          status: 'done',
          content: (prev.content ?? '') + (r.content ?? ''),
          binary: r.binary,
          imageDataUrl: r.imageDataUrl,
          size: r.size,
          truncated: r.truncated,
          loadedBytes: nextOffset + (r.content?.length ?? 0),
        }))
      } else {
        setLoad((prev) => ({ ...prev, status: 'error', error: r.error ?? '未知错误' }))
      }
    })
  }

  return React.createElement(
    'div',
    {
      className: 'wf-drawer-backdrop wf-preview-backdrop',
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) closePreview()
      },
    },
    React.createElement(
      'div',
      {
        className: 'wf-drawer wf-preview-drawer',
        role: 'dialog',
        'aria-label': t('preview.close'),
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      },
      // 头部
      React.createElement(
        'div',
        { className: 'wf-drawer-head' },
        React.createElement(
          'div',
          { className: 'wf-drawer-title' },
          basenameOf(rel),
          React.createElement('small', null, rel),
        ),
        React.createElement(
          'button',
          {
            ref: closeRef,
            type: 'button',
            className: 'wf-icon-btn',
            'aria-label': t('preview.close'),
            onClick: closePreview,
          },
          '⨯',
        ),
      ),
      // 元信息行
      React.createElement(
        'div',
        { className: 'wf-drawer-meta' },
        React.createElement(
          'span',
          { className: 'wf-meta-text' },
          load.binary === true
            ? t('preview.binary')
            : t('preview.lines', { lines: String(lines), size: formatBytes(load.size ?? 0) }),
        ),
        state.fromBrowser
          ? React.createElement('button', { type: 'button', className: 'wf-btn', onClick: closePreview }, t('preview.back'))
          : null,
        md && load.content !== undefined
          ? React.createElement(
              'button',
              {
                type: 'button',
                className: 'wf-btn',
                onClick: () => setMode((m) => (m === 'render' ? 'raw' : 'render')),
              },
              mode === 'render' ? t('preview.raw') : t('preview.rendered'),
            )
          : null,
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'wf-btn',
            onClick: () => {
              void navigator.clipboard?.writeText(rel).then(() => {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 1200)
              })
            },
          },
          copied ? t('preview.copyDone') : t('preview.copyPath'),
        ),
        workspacesSvc !== undefined
          ? React.createElement(
              'button',
              {
                type: 'button',
                className: 'wf-btn',
                onClick: () => {
                  void workspacesSvc?.openPath(joinAbs(state.root, rel)).catch(() => {})
                },
              },
              t('preview.openSystem'),
            )
          : null,
      ),
      // 正文
      load.status === 'loading'
        ? React.createElement('div', { className: 'wf-drawer-body wf-body-plain' }, React.createElement('div', { className: 'wf-body-hint' }, t('preview.loading')))
        : load.status === 'error'
          ? React.createElement(
              'div',
              { className: 'wf-drawer-body wf-body-plain' },
              React.createElement(
                'div',
                { className: 'wf-body-hint' },
                t('preview.error', { error: load.error ?? '' }),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'wf-btn',
                    onClick: () => setLoad({ status: 'idle', loadedBytes: 0 }),
                  },
                  t('preview.retry'),
                ),
              ),
            )
          : load.imageDataUrl !== undefined
            ? React.createElement('div', { className: 'wf-drawer-body wf-body-plain' }, React.createElement('img', { className: 'wf-image', src: load.imageDataUrl, alt: basenameOf(rel) }))
            : load.binary === true
              ? React.createElement(
                  'div',
                  { className: 'wf-drawer-body wf-body-plain' },
                  React.createElement(
                    'div',
                    { className: 'wf-body-hint' },
                    t('preview.binary'),
                    workspacesSvc !== undefined
                      ? React.createElement(
                          'button',
                          {
                            type: 'button',
                            className: 'wf-btn',
                            onClick: () => {
                              void workspacesSvc?.openPath(joinAbs(state.root, rel)).catch(() => {})
                            },
                          },
                          t('preview.openSystem'),
                        )
                      : null,
                  ),
                )
              : showMdRender
                ? React.createElement(
                    'div',
                    { className: 'wf-drawer-body wf-body-plain' },
                    React.createElement('div', {
                      className: 'wf-md',
                      dangerouslySetInnerHTML: { __html: renderMarkdown(load.content ?? '') },
                    }),
                  )
                : React.createElement(
                    'div',
                    { className: 'wf-drawer-body' },
                    React.createElement(
                      'pre',
                      { className: 'wf-code' },
                      (load.content ?? '').split('\n').map((line, i) =>
                        React.createElement(
                          'div',
                          { className: 'wf-code-line', key: i },
                          React.createElement('span', { className: 'wf-line-no' }, String(i + 1)),
                          React.createElement('span', { className: 'wf-line-content' }, ...highlightLine(line)),
                        ),
                      ),
                    ),
                  ),
      // 底部：加载更多
      load.status === 'done' && load.truncated === true
        ? React.createElement(
            'div',
            { className: 'wf-drawer-foot' },
            t('preview.truncated', { count: String(lines) }),
            React.createElement('button', { type: 'button', className: 'wf-btn', onClick: loadMore }, t('preview.loadMore')),
          )
        : null,
    ),
  )
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
