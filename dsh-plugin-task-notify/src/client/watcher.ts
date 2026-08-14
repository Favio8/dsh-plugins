import type { SessionListState } from './types'

export interface CompletionInfo {
  sessionId: string
  title: string
}

/**
 * 监听顶层会话的运行/等待状态变化：
 * - running→idle：一轮任务完成（onComplete）。
 * - pendingInteraction 从无到有：会话在等用户输入/审批（onWaitStart），
 *   期间 agent 状态保持 running，完成通知不会触发，需要单独检测。
 *
 * - 只关心顶层会话（parentId 为空），子代理会话不提醒，避免噪声。
 * - blank（从未发过消息）的会话不参与。
 * - 首次调用只播种当前状态，不触发任何通知。
 *
 * @param list sessions.list 快照存储（getSnapshot + subscribe）。
 * @param onComplete 会话完成回调。
 * @param onWaitStart 会话等待用户输入/审批回调。
 * @returns 取消订阅函数，插件卸载时应调用。
 */
export function watchCompletions(
  list: { getSnapshot(): SessionListState; subscribe(fn: () => void): () => void },
  onComplete: (info: CompletionInfo) => void,
  onWaitStart?: (info: CompletionInfo) => void,
): () => void {
  const running = new Map<string, boolean>()
  const waiting = new Set<string>()

  const check = (): void => {
    const byId = list.getSnapshot().byId

    // 清理已从列表消失的会话
    for (const id of [...running.keys()]) {
      if (byId[id] === undefined) running.delete(id)
    }
    for (const id of [...waiting]) {
      if (byId[id] === undefined) waiting.delete(id)
    }

    for (const id of Object.keys(byId)) {
      const row = byId[id]
      if (row === undefined) continue
      // 子代理会话不提醒
      if (row.parentId !== undefined) continue
      // 空会话（从未发过消息）不参与
      if (row.blank) {
        running.delete(id)
        waiting.delete(id)
        continue
      }

      // 等待用户输入：pendingInteraction 从无到有
      if (row.pendingInteraction !== undefined) {
        if (!waiting.has(id)) {
          waiting.add(id)
          onWaitStart?.({ sessionId: id, title: row.displayTitle })
        }
      } else {
        waiting.delete(id)
      }

      // 完成：running→idle
      const was = running.get(id)
      const now = row.running
      if (was === true && now === false) {
        running.set(id, false)
        onComplete({ sessionId: id, title: row.displayTitle })
      } else {
        running.set(id, now)
      }
    }
  }

  // 首次播种：只记录当前状态，不触发通知
  check()
  return list.subscribe(check)
}
