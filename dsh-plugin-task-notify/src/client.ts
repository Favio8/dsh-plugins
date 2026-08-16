import * as React from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { SessionsFace, SlotsFace } from './client/types'
import { getConfig } from './client/config'
import { disposeToasts, pushToast, setOpenSession, ToastStack } from './client/toasts'
import { watchCompletions } from './client/watcher'
import { TaskNotifySettings, TaskNotifySection } from './client/settings'
import { injectStyles } from './client/styles'

export const inject = ['sessions', 'slots']

/**
 * dsh-plugin-task-notify — 任务完成通知（Client 半）。
 *
 * 机制：订阅 ctx.sessions.list 快照存储，监听顶层会话 running→idle 翻转
 * （即一轮任务完成），触发应用内 toast。**系统级桌面通知由 Host 半负责**
 * （agent/status + Windows 原生气泡，独立于浏览器页面），客户端只做页面内提示
 * 与设置行（通过 /task-notify/* HTTP 桥控制宿主开关）。
 * UI 全部走槽位：shell.overlay（toast 堆栈）+ settings.general.item（设置行）。
 */
export function apply(ctx: Context): void {
  ctx.effect(() => injectStyles(), 'task-notify: styles')

  // 卸载时清理 toast 定时器与监听
  ctx.effect(() => disposeToasts)

  const sessions = ctx.get('sessions') as unknown as SessionsFace
  const slots = ctx.get('slots') as unknown as SlotsFace

  // 点击应用内 toast → 打开对应会话
  setOpenSession((sessionId) => {
    try {
      sessions.open(sessionId)
    } catch {
      // 会话可能已不存在，忽略
    }
  })

  // 会话完成（running→idle）→ 应用内 toast（桌面通知由 Host 半负责）
  const unwatch = watchCompletions(
    sessions.list,
    (info) => {
      const cfg = getConfig()
      if (!cfg.toast) return
      const title = info.title !== '' ? info.title : '未命名会话'
      pushToast({ title, body: '任务完成', sessionId: info.sessionId })
    },
    // 等待用户输入/审批（pendingInteraction 出现）→ toast 提示
    (info) => {
      const cfg = getConfig()
      if (!cfg.toast) return
      const title = info.title !== '' ? info.title : '未命名会话'
      pushToast({ title, body: '等待你的输入/审批', sessionId: info.sessionId })
    },
  )
  ctx.effect(() => unwatch)

  // 应用内 toast 堆栈（全局浮层）
  slots.inject('shell.overlay', () =>
    slots.register({ name: 'shell.overlay', id: 'task-notify-toasts', order: 100 }, ToastStack),
  )

  // 设置行（设置页 General 一节）
  slots.inject('settings.general.item', () =>
    slots.register({ name: 'settings.general.item', id: 'task-notify', order: 30 }, TaskNotifySettings),
  )

  // 完整设置页（设置导航新增「任务完成通知」；label 用 thunk，与官方设置页写法一致）
  slots.inject('settings.section', () =>
    slots.register(
      { name: 'settings.section', id: 'task-notify', order: 25, label: () => '任务完成通知' },
      TaskNotifySection,
    ),
  )
}
