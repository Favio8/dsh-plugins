/**
 * 与 dsh-client-runtime 会话服务的最小结构视图。
 *
 * 只声明本项目实际读取的叶子字段，避免对整个 live 数据对象做拷贝或序列化。
 * 运行时来自 ctx.sessions（SessionRuntime）与 ctx.slots，类型仅为编译期契约。
 */

/** 会话列表行的最小结构（对应 SessionSummary，仅取所需字段）。 */
export interface SessionRowView {
  displayTitle: string
  running: boolean
  blank: boolean
  parentId?: string
}

/** sessions.list 快照的最小结构（对应 SessionListState）。 */
export interface SessionListState {
  byId: Record<string, SessionRowView | undefined>
}

/** 客户端 sessions 服务的最小结构（仅本项目用到的方法）。 */
export interface SessionsFace {
  list: {
    getSnapshot(): SessionListState
    subscribe(fn: () => void): () => void
  }
  open(id: string): void
}

/** 客户端 slots 服务的最小结构（仅本项目用到的方法）。 */
export interface SlotsFace {
  inject(key: string, callback: () => unknown): () => void
  register(
    options: { name: string; id: string; order?: number; label?: string | (() => string) },
    component: unknown,
  ): () => void
}
