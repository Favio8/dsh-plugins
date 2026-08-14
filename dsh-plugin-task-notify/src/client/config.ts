/**
 * 客户端配置：仅"应用内提示"开关（toast），持久化在 localStorage。
 * 系统级"桌面通知"开关由 Host 半管理（~/.dsh/plugins/task-notify.json），
 * 客户端设置行通过 /task-notify/* HTTP 桥读写。
 */

export interface NotifyConfig {
  /** 应用内 toast（shell.overlay）。 */
  toast: boolean
}

const STORAGE_KEY = 'dsh-plugin-task-notify.config'
const DEFAULTS: NotifyConfig = { toast: true }

let config: NotifyConfig = load()
const listeners = new Set<() => void>()

function load(): NotifyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw) as Partial<NotifyConfig>
    return {
      toast: typeof parsed.toast === 'boolean' ? parsed.toast : DEFAULTS.toast,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export function getConfig(): NotifyConfig {
  return config
}

export function setConfig(patch: Partial<NotifyConfig>): NotifyConfig {
  config = { ...config, ...patch }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch {
    // 存储不可用时忽略（如隐私模式），内存态仍然生效。
  }
  for (const fn of [...listeners]) fn()
  return config
}

export function subscribeConfig(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
