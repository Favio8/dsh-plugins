/**
 * 模块级响应式 store + 插件偏好/最近引用持久化。
 *
 * 只存叶子值（open/path/root/…），从不持有 Session、Slot props 等 live 数据。
 * 偏好与最近引用存 localStorage（源码插件可用）。
 */

/** 极简可订阅 store。 */
export interface Store<T> {
  get(): T
  set(patch: Partial<T> | ((prev: T) => Partial<T>)): void
  subscribe(fn: () => void): () => void
}

export function createStore<T>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    get: () => state,
    set: (patch) => {
      const next = typeof patch === 'function' ? patch(state) : patch
      state = { ...state, ...next }
      for (const fn of listeners) fn()
    },
    subscribe: (fn) => {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
  }
}

/** React 订阅 hook：与 useSyncExternalStore 同语义。 */
export function useStore<T>(store: Store<T>): T {
  // 由 client.ts 注入 React（bundle 运行时解析），此处用延迟 require 避免循环依赖。
  // 改为从模块导入：client.ts 把 React 实例注册进来。
  return reactUseSyncExternalStore(store.subscribe, store.get)
}

import * as React from 'react'

const reactUseSyncExternalStore = React.useSyncExternalStore

/* ── 预览抽屉状态 ─────────────────────────────────────────── */

export interface PreviewState {
  open: boolean
  /** 打开时的会话 cwd（绝对路径）。 */
  root: string
  /** 相对 cwd 的展示路径（如 src/index.ts）。 */
  relPath: string
  /** 自文件夹浏览进入时为 true（头部显示返回按钮）。 */
  fromBrowser: boolean
}

export const previewStore = createStore<PreviewState>({
  open: false,
  root: '',
  relPath: '',
  fromBrowser: false,
})

export function openPreview(root: string, relPath: string, fromBrowser: boolean): void {
  previewStore.set({ open: true, root, relPath, fromBrowser })
}

export function closePreview(): void {
  previewStore.set({ open: false })
}

/* ── 文件夹浏览抽屉状态 ───────────────────────────────────── */

export interface BrowserState {
  open: boolean
  root: string
  currentPath: string
  /** 已展开的目录（绝对路径 → 布尔）。 */
  expanded: Record<string, boolean>
  /** 刷新计数：变更时重新拉取当前层。 */
  rev: number
}

export const browserStore = createStore<BrowserState>({
  open: false,
  root: '',
  currentPath: '',
  expanded: {},
  rev: 0,
})

export function openBrowser(root: string): void {
  browserStore.set({ open: true, root, currentPath: root, expanded: {}, rev: browserStore.get().rev + 1 })
}

export function closeBrowser(): void {
  browserStore.set({ open: false })
}

/* ── 客户端偏好（localStorage） ────────────────────────────── */

export interface Prefs {
  intercept: boolean
  showHidden: boolean
  ignore: string
  recentCount: number
}

const PREFS_KEY = 'dsh-workspace-files:prefs'

const DEFAULT_PREFS: Prefs = {
  intercept: true,
  showHidden: false,
  ignore: '',
  recentCount: 5,
}

export const prefsStore = createStore<Prefs>(loadPrefs())

function loadPrefs(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') as Partial<Prefs>
    return {
      intercept: typeof raw.intercept === 'boolean' ? raw.intercept : DEFAULT_PREFS.intercept,
      showHidden: typeof raw.showHidden === 'boolean' ? raw.showHidden : DEFAULT_PREFS.showHidden,
      ignore: typeof raw.ignore === 'string' ? raw.ignore : DEFAULT_PREFS.ignore,
      recentCount:
        typeof raw.recentCount === 'number' && raw.recentCount > 0
          ? Math.min(10, Math.floor(raw.recentCount))
          : DEFAULT_PREFS.recentCount,
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function setPrefs(patch: Partial<Prefs>): void {
  const next = { ...prefsStore.get(), ...patch }
  prefsStore.set(next)
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
  } catch {
    // 隐私模式等场景静默忽略
  }
}

/* ── 最近引用（localStorage，按会话+根目录过滤） ───────────── */

interface RecentEntry {
  sessionId: string
  root: string
  relPath: string
  at: number
}

const RECENTS_KEY = 'dsh-workspace-files:recents'

function loadRecents(): RecentEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]') as RecentEntry[]
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function saveRecents(entries: RecentEntry[]): void {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(entries.slice(0, 50)))
  } catch {
    // 静默
  }
}

/** 取某会话 + 某根目录下的最近引用（新→旧）。 */
export function getRecents(sessionId: string, root: string): string[] {
  const count = prefsStore.get().recentCount
  return loadRecents()
    .filter((e) => e.sessionId === sessionId && e.root === root)
    .slice(0, count)
    .map((e) => e.relPath)
}

/** 记录一次引用（@ 选中或预览打开）。 */
export function addRecent(sessionId: string, root: string, relPath: string): void {
  const entries = loadRecents().filter(
    (e) => !(e.sessionId === sessionId && e.relPath === relPath && e.root === root),
  )
  entries.unshift({ sessionId, root, relPath, at: Date.now() })
  saveRecents(entries)
}
