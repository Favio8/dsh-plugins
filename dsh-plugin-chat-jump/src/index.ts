import type { Context } from '@deepseek-ai/cordis'

export const name = 'chat-jump'

/**
 * dsh-plugin-chat-jump — Host 半：占位空插件。
 * 功能全部在 Client 半（对话流左侧圆点跳转条，纯 DOM/UI），无需 Host 服务。
 */
export function apply(_ctx: Context): void {
  // 无宿主逻辑
}
