/**
 * F3：右上角「项目文件夹」→ 文件夹浏览抽屉。
 *
 * 面包屑导航 + 单层列表（目录在前，点击进入；文件点击打开预览）。
 * 根 = 当前会话 cwd；切换会话自动重根；隐藏文件开关来自设置。
 */

import * as React from 'react'
import { listDir, type ListEntry } from './bridge'
import { t } from './locales'
import { ignoredNames } from './mention'
import { basenameOf, fileIcon, joinAbs, relOf } from './paths'
import { addRecent, browserStore, closeBrowser, openPreview, prefsStore, previewStore, setPrefs, useStore } from './store'
import type { SessionsFace, WorkspacesFace } from './types'

let sessionsSvc: SessionsFace | undefined
let workspacesSvc: WorkspacesFace | undefined

export function bindBrowserServices(sessions: SessionsFace | undefined, workspaces: WorkspacesFace | undefined): void {
  sessionsSvc = sessions
  workspacesSvc = workspaces
}

interface Listing {
  entries: ListEntry[]
  truncated: boolean
  error?: string
}

export function FolderBrowser(): React.ReactElement | null {
  const state = useStore(browserStore)
  const prefs = useStore(prefsStore)
  const [listing, setListing] = React.useState<Listing>({ entries: [], truncated: false })
  const [loading, setLoading] = React.useState(false)
  const lastSession = React.useRef<string | undefined>(undefined)

  // 当前层拉取
  React.useEffect(() => {
    if (!state.open || state.root === '') return
    let cancelled = false
    const controller = new AbortController()
    setLoading(true)
    void listDir(state.root, relOf(state.currentPath, state.root), prefs.showHidden, controller.signal)
      .then((r) => {
        if (cancelled) return
        setListing(
          r.ok
            ? { entries: r.entries ?? [], truncated: r.truncated === true }
            : { entries: [], truncated: false, error: r.error },
        )
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setListing({ entries: [], truncated: false, error: 'network' })
        setLoading(false)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [state.open, state.root, state.currentPath, state.rev, prefs.showHidden])

  // 切换会话 → 自动重根
  React.useEffect(() => {
    if (!state.open || sessionsSvc === undefined) return
    const sync = (): void => {
      const snap = sessionsSvc?.list.getSnapshot()
      const cur = snap?.current
      if (cur === undefined || cur === lastSession.current) return
      lastSession.current = cur
      const cwd = snap?.byId[cur]?.cwd
      if (cwd !== undefined && cwd !== '') {
        browserStore.set({ root: cwd, currentPath: cwd, rev: browserStore.get().rev + 1 })
      }
    }
    sync()
    return sessionsSvc.list.subscribe(sync)
  }, [state.open])

  // ESC 关闭
  React.useEffect(() => {
    if (!state.open) return
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') {
        // 预览抽屉盖在浏览抽屉上时，ESC 只关闭最上层。
        if (previewStore.get().open) return
        ev.stopPropagation()
        closeBrowser()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [state.open])

  if (!state.open) return null

  const root = state.root
  const current = state.currentPath
  const crumbs = crumbsOf(root, current)
  const ignore = ignoredNames()
  const visible = (listing.entries ?? []).filter((e) => !ignore.has(e.name.toLowerCase()))

  const openFile = (entry: ListEntry): void => {
    addRecent(lastSession.current ?? '', root, relOf(entry.path, root))
    openPreview(root, relOf(entry.path, root), true)
  }

  return React.createElement(
    'div',
    {
      className: 'wf-drawer-backdrop',
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) closeBrowser()
      },
    },
    React.createElement(
      'div',
      {
        className: 'wf-drawer',
        role: 'dialog',
        'aria-label': t('browser.title'),
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      },
      // 头部
      React.createElement(
        'div',
        { className: 'wf-drawer-head' },
        React.createElement('div', { className: 'wf-drawer-title' }, t('browser.title')),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'wf-icon-btn',
            title: t('browser.refresh'),
            onClick: () => browserStore.set({ rev: browserStore.get().rev + 1 }),
          },
          '⟳',
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'wf-icon-btn',
            'aria-label': t('browser.close'),
            onClick: closeBrowser,
          },
          '⨯',
        ),
      ),
      // 面包屑
      React.createElement(
        'div',
        { className: 'wf-breadcrumb' },
        crumbs.map((path, i) => {
          const isLast = i === crumbs.length - 1
          return React.createElement(
            React.Fragment,
            { key: path },
            i > 0 ? React.createElement('span', { className: 'wf-crumb-sep' }, '›') : null,
            isLast
              ? React.createElement('span', { className: 'wf-crumb', style: { color: 'var(--dsw-alias-label-primary)', cursor: 'default' } }, basenameOf(path))
              : React.createElement(
                  'button',
                  {
                    type: 'button',
                    className: 'wf-crumb',
                    onClick: () => browserStore.set({ currentPath: path }),
                  },
                  basenameOf(path),
                ),
          )
        }),
      ),
      // 列表
      loading
        ? React.createElement('div', { className: 'wf-drawer-body wf-body-plain' }, React.createElement('div', { className: 'wf-body-hint' }, t('preview.loading')))
        : listing.error !== undefined
          ? React.createElement(
              'div',
              { className: 'wf-drawer-body wf-body-plain' },
              React.createElement('div', { className: 'wf-body-hint' }, t('preview.error', { error: listing.error })),
            )
          : visible.length === 0
            ? React.createElement(
                'div',
                { className: 'wf-drawer-body wf-body-plain' },
                React.createElement(
                  'div',
                  { className: 'wf-body-hint' },
                  t('browser.empty'),
                  workspacesSvc !== undefined
                    ? React.createElement(
                        'button',
                        {
                          type: 'button',
                          className: 'wf-btn',
                          onClick: () => {
                            void workspacesSvc?.openPath(current).catch(() => {})
                          },
                        },
                        t('browser.emptyOpen'),
                      )
                    : null,
                ),
              )
            : React.createElement(
                'div',
                { className: 'wf-drawer-body wf-body-plain', style: { padding: '4px 6px' } },
                React.createElement(
                  'div',
                  { className: 'wf-tree' },
                  visible.map((entry) =>
                    entry.kind === 'dir'
                      ? React.createElement(
                          'div',
                          {
                            key: entry.path,
                            className: 'wf-node',
                            title: entry.path,
                            onClick: () => browserStore.set({ currentPath: entry.path }),
                          },
                          React.createElement('span', { className: 'wf-node-toggle' }, '›'),
                          React.createElement('span', { className: 'wf-node-icon' }, '📁'),
                          React.createElement('span', { className: 'wf-node-name' }, entry.name),
                        )
                      : React.createElement(
                          'div',
                          {
                            key: entry.path,
                            className: 'wf-node',
                            title: entry.path,
                            onClick: () => openFile(entry),
                          },
                          React.createElement('span', { className: 'wf-node-toggle' }, ''),
                          React.createElement('span', { className: 'wf-node-icon' }, fileIcon(entry.name)),
                          React.createElement('span', { className: 'wf-node-name' }, entry.name),
                          React.createElement('span', { className: 'wf-node-size' }, formatBytes(entry.size)),
                        ),
                  ),
                  listing.truncated === true
                    ? React.createElement('div', { className: 'wf-body-hint', style: { padding: '12px' } }, '+ …')
                    : null,
                ),
              ),
      // 底部
      React.createElement(
        'div',
        { className: 'wf-browser-foot' },
        React.createElement(
          'label',
          { style: { display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' } },
          React.createElement('input', {
            type: 'checkbox',
            checked: prefs.showHidden,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPrefs({ showHidden: e.target.checked }),
          }),
          t('settings.showHidden'),
        ),
      ),
    ),
  )
}

function crumbsOf(root: string, current: string): string[] {
  if (current === root) return [root]
  const rel = relOf(current, root)
  const segs = rel.split('/').filter((s) => s !== '')
  const parts: string[] = [root]
  let acc = root
  for (const s of segs) {
    acc = joinAbs(acc, s)
    parts.push(acc)
  }
  return parts
}

function formatBytes(size?: number): string {
  if (size === undefined) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}
