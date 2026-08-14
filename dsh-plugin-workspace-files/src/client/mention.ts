/**
 * F1：@ 文件引用 source（注册进官方 input-trigger 管线）。
 *
 * - 菜单候选：最近引用（置顶）+ 当前层文件/目录；
 * - 斜杠层级导航：@src/components/ 直接进入子目录；
 * - onPick → { text: '<相对路径> ' }，随普通 prompt 发送，agent 直接可读；
 * - lexicon：返回本会话最近引用的相对路径，草稿中 @<路径> 呈 chip 装饰。
 */

import { listDir } from './bridge'
import { addRecent, getRecents, prefsStore } from './store'
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

export function createFileSource(sessions: SessionsFace, inputTriggers: InputTriggersFace): () => void {
  const source: TriggerSource = {
    trigger: '@',
    name: 'file',
    order: -10,
    async candidates(session, { query, signal }) {
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd === undefined) return []
      // 解析斜杠层级：@src/components/ → 列出 src/components
      const lastSlash = query.lastIndexOf('/')
      const dirPart = lastSlash >= 0 ? query.slice(0, lastSlash + 1) : ''
      const rest = lastSlash >= 0 ? query.slice(lastSlash + 1) : query

      const recents = dirPart === '' ? getRecents(session.sessionId, cwd) : []

      const list = await listDir(cwd, dirPart, false, signal)
      const ignore = ignoredNames()
      const entries = (list.entries ?? []).filter((e) => !ignore.has(e.name.toLowerCase()))
      const matched = entries.filter((e) =>
        e.name.toLowerCase().startsWith(rest.toLowerCase()),
      )
      const dirs = matched.filter((e) => e.kind === 'dir')
      const files = matched.filter((e) => e.kind === 'file')

      const recentCands = recents.map((rel) => ({
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
      const rel = candidate.description ?? candidate.name
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd !== undefined) addRecent(session.sessionId, cwd, rel.replace(/\/$/, ''))
      // 目录以 / 结尾 → 保持可读性；文件加空格结束 token
      return { text: `${rel} ` }
    },
    lexicon(session) {
      const cwd = cwdOf(sessions, session.sessionId)
      if (cwd === undefined) return undefined
      const recents = getRecents(session.sessionId, cwd)
      return recents.length > 0 ? recents : undefined
    },
    subscribeLexicon(_session, listener) {
      return sessions.list.subscribe(listener)
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
