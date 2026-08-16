/**
 * F1：@ 文件引用 source（注册进官方 input-trigger 管线）。
 *
 * - 菜单候选：最近引用（置顶，按 query 过滤）+ 当前层文件/目录；
 * - 斜杠层级导航：@src/components/ 直接进入子目录；
 * - onPick → { text: '<相对路径> ' }，随普通 prompt 发送，agent 直接可读；
 * - lexicon：返回本会话最近引用的相对路径，草稿中 @<路径> 呈 chip 装饰。
 */

import { listDir } from './bridge'
import { addRecent, getRecents, prefsStore, subscribeRecents } from './store'
import type { InputTriggersFace, SessionsFace, TriggerSource } from './types'
import { basenameOf, fileIcon, joinAbs, relOf } from './paths'
import { t } from './locales'

/** 忽略规则：内置 + 用户自定义（逗号分隔，大小写不敏感）。 */
export function ignoredNames(): Set<string> {
  const builtin = ['node_modules', '.git', 'dist', 'build', 'out', '.next']
  const extra = (prefsStore.get().ignore ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '')
  return new Set([...builtin, ...extra].map((s) => s.toLowerCase()))
}

function cwdOf(sessions: SessionsFace, sessionId: string): string | undefined {
  return sessions.list.getSnapshot().byId[sessionId]?.cwd
}

/** list 请求短 TTL 缓存：@ 菜单连续输入时避免重复请求同一目录。 */
type CachedListResult = Awaited<ReturnType<typeof listDir>>
const listCache = new Map<string, { at: number; result: CachedListResult }>()
const LIST_CACHE_TTL_MS = 2000

async function cachedList(root: string, rel: string, signal?: AbortSignal): Promise<CachedListResult> {
  const key = `${root}\u0000${rel}`
  const cached = listCache.get(key)
  const now = Date.now()
  if (cached !== undefined && now - cached.at < LIST_CACHE_TTL_MS) return cached.result
  const result = await listDir(root, rel, false, signal)
  if (result.ok) listCache.set(key, { at: now, result })
  return result
}

export function createFileSource(sessions: SessionsFace, inputTriggers: InputTriggersFace): () => void {
  const source: TriggerSource = {
    trigger: '@',
    name: 'file',
    order: -10,
    async candidates(session, { query, signal }) {
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd === undefined) return []
      // 解析层级：@src/components/ 或 @src\components\ → 列出对应目录
      const lastSlash = Math.max(query.lastIndexOf('/'), query.lastIndexOf('\\'))
      const dirPart = lastSlash >= 0 ? query.slice(0, lastSlash + 1) : ''
      const rest = lastSlash >= 0 ? query.slice(lastSlash + 1) : query

      const recents = dirPart === '' ? getRecents(session.sessionId, cwd) : []

      const list = await cachedList(cwd, dirPart.replace(/\\/g, '/'), signal)
      const ignore = ignoredNames()
      const entries = (list.entries ?? []).filter((e) => !ignore.has(e.name.toLowerCase()))
      const matched = entries.filter((e) =>
        e.name.toLowerCase().startsWith(rest.toLowerCase()),
      )
      const dirs = matched.filter((e) => e.kind === 'dir')
      const files = matched.filter((e) => e.kind === 'file')

      const recentCands = recents
        .filter((rel) => {
          const target = rest.toLowerCase()
          return target === '' || rel.toLowerCase().includes(target) || basenameOf(rel).toLowerCase().includes(target)
        })
        .map((rel) => ({
          name: basenameOf(rel),
          description: rel,
          icon: '🕘',
          hint: t('mention.recent'),
        }))
      const dirCands = dirs.map((d) => ({
        name: d.name,
        description: `${relOf(d.path, cwd)}/`,
        icon: '📁',
      }))
      const fileCands = files.map((f) => ({
        name: f.name,
        description: relOf(f.path, cwd),
        icon: fileIcon(f.name),
      }))
      return [...recentCands, ...dirCands, ...fileCands]
    },
    onPick({ candidate, session }) {
      const raw = candidate.description ?? candidate.name
      const isDir = raw.endsWith('/')
      const rel = raw.replace(/\/$/, '')
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd !== undefined) addRecent(session.sessionId, cwd, rel)
      // insert 型 chip：草稿中是一个真实引用块。label 以 @ 开头，供插件 CSS 精确命中；
      // label 使用完整相对路径，视觉超长省略，hover tooltip 可显示完整路径。
      return {
        insert: {
          source: 'file',
          ref: isDir ? `${rel}/` : rel,
          label: `@${rel}${isDir ? '/' : ''}`,
          clipboardText: `@${rel}${isDir ? '/' : ''}`,
        },
      }
    },
    codec: {
      clipboardText: (ref) => `@${ref}`,
      serialize: (ref) => Promise.resolve(`@${ref}`),
    },
    lexicon(session) {
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd === undefined) return undefined
      const recents = getRecents(session.sessionId, cwd)
      return recents.length > 0 ? recents : undefined
    },
    subscribeLexicon(_session, listener) {
      const offSessions = sessions.list.subscribe(listener)
      const offPrefs = prefsStore.subscribe(listener)
      const offRecents = subscribeRecents(listener)
      return () => {
        offSessions()
        offPrefs()
        offRecents()
      }
    },
    warm(session) {
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd !== undefined) void cachedList(cwd, '')
    },
  }
  return inputTriggers.registerSource(source)
}

/** 供预览抽屉等记录最近引用（复用 addRecent 语义）。 */
export { addRecent }

/** 供点击拦截/预览解析路径：相对 → 绝对。 */
export function resolveToAbsolute(root: string, rel: string): string {
  return joinAbs(root, rel)
}
