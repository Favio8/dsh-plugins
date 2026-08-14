/**
 * 与 dsh-client-runtime / dsh-client-ui-input-trigger 的最小结构视图。
 *
 * 只声明本项目实际读取的叶子字段，避免对整个 live 数据对象做拷贝或序列化。
 * 类型仅为编译期契约；运行时对象来自官方服务。
 */

/** 会话列表行的最小结构（对应 SessionSummary，仅取所需字段）。 */
export interface SessionRowView {
  displayTitle: string
  running: boolean
  cwd?: string
  parentId?: string
}

/** sessions.list 快照的最小结构（对应 SessionListState）。 */
export interface SessionListState {
  ids: string[]
  byId: Record<string, SessionRowView | undefined>
  current: string | undefined
}

/** 客户端 sessions 服务的最小结构（仅本项目用到的方法）。 */
export interface SessionsFace {
  list: {
    getSnapshot(): SessionListState
    subscribe(fn: () => void): () => void
  }
  open(id: string): void
}

/** 客户端 workspaces 服务的最小结构（仅「在系统中打开」）。 */
export interface WorkspacesFace {
  openPath(path: string): Promise<void>
}

/** 客户端 slots 服务的最小结构（仅本项目用到的方法）。 */
export interface SlotsFace {
  inject(key: string, callback: () => unknown): () => void
  register(
    options: {
      name: string
      id: string
      order?: number
      label?: string | (() => string)
    },
    component: unknown,
  ): () => void
}

/** 客户端 locale 服务的最小结构。 */
export interface LocaleFace {
  register(ns: string, dicts: Record<string, Record<string, string>>): () => void
  bind(ns: string): (key: string, params?: Record<string, string | number>) => string
}

/** 输入触发管线 source（对应官方 InputTriggerSource，仅本项目用到字段）。 */
export interface TriggerSource {
  trigger: '/' | '@'
  name: string
  order?: number
  candidates(
    session: { sessionId: string },
    req: { query: string; position: 'leading' | 'inline'; signal: AbortSignal },
  ): Promise<readonly { name: string; description?: string; icon?: string; hint?: string }[]>
  onPick(pick: {
    candidate: { name: string; description?: string; icon?: string; hint?: string }
    session: { sessionId: string }
    position: 'leading' | 'inline'
    via: 'menu' | 'space' | 'enter'
  }): unknown
  lexicon?(session: { sessionId: string }): readonly string[] | undefined
  subscribeLexicon?(session: { sessionId: string }, listener: () => void): () => void
  warm?(session: { sessionId: string }): void
}

/** ctx.inputTriggers 服务的最小结构。 */
export interface InputTriggersFace {
  registerSource(source: TriggerSource): () => void
}
