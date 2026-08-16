/**
 * task-notify 客户端文案（zh/en 双语）。
 * 全部设置 UI 文案必须走 t()，不硬编码中文。
 */

export const NS = 'task-notify'

const zh = {
  'settings.title': '任务完成通知',
  'settings.test': '测试',
  'settings.testToastTitle': '这是一条测试通知',
  'settings.testToastBody': '任务完成通知（测试）',
  'settings.testButton': '测试通知',
  'settings.connecting': '正在连接…',
  'settings.windowsOnly': '桌面通知仅支持 Windows',
  'toast.untitled': '未命名会话',
  'toast.done': '任务完成',
  'toast.wait': '等待你的输入/审批',

  'field.desktop': '桌面通知',
  'field.desktopSub': '独立于浏览器，页面关闭也能收到',
  'field.toast': '应用内提示',
  'field.toastSub': '页面右下角 toast',
  'field.sound': '提示音',
  'field.soundSub': '任务完成时播放',
  'field.error': '错误提醒',
  'field.errorSub': '任务失败时弹出红色卡片',

  'row.foot': '卡片样式、字体与音色在设置页「任务完成通知」中调整',
  'page.desc': '会话一轮任务结束时提醒你；桌面卡片为自绘置顶窗口，不依赖系统通知开关。',

  'card.channels': '通知通道',
  'card.style': '卡片样式',
  'card.font': '字体',
  'card.sound': '提示音',
  'field.theme': '主题',
  'field.accent': '强调色',
  'field.position': '位置',
  'field.duration': '显示时长',
  'field.fontSize': '字号',
  'field.fontFamily': '字体',
  'field.soundEnable': '开启提示音',
  'field.soundEnableSub': '任务完成时播放，独立于浏览器',
  'field.soundType': '提示音',
  'field.volume': '音量',
  'field.volumeFixedSub': '系统提示音不支持调节',

  'options.theme.dark': '深色',
  'options.theme.light': '浅色',
  'options.position.br': '右下',
  'options.position.bl': '左下',
  'options.position.tr': '右上',
  'options.position.tl': '左上',
  'options.duration.4': '4 秒',
  'options.duration.6': '6 秒',
  'options.duration.8': '8 秒',
  'options.duration.10': '10 秒',
  'options.fontSize.11': '小',
  'options.fontSize.12': '标准',
  'options.fontSize.13': '大',
  'options.fontSize.14': '特大',
  'options.font.yahei': '微软雅黑',
  'options.font.default': '系统默认',
  'options.font.simsun': '宋体',
  'options.font.simhei': '黑体',
  'options.font.kaiti': '楷体',
  'options.sound.apple': '苹果三全音',
  'options.sound.ding': '叮',
  'options.sound.double': '双响',
  'options.sound.system': '系统提示音',
}

const en: Record<string, string> = {
  'settings.title': 'Task Notifications',
  'settings.test': 'Test',
  'settings.testToastTitle': 'This is a test notification',
  'settings.testToastBody': 'Task notification (test)',
  'settings.testButton': 'Send Test',
  'settings.connecting': 'Connecting…',
  'settings.windowsOnly': 'Desktop notifications are only supported on Windows',
  'toast.untitled': 'Untitled session',
  'toast.done': 'Task complete',
  'toast.wait': 'Waiting for your input/approval',

  'field.desktop': 'Desktop notification',
  'field.desktopSub': 'Works independently of the browser, even when the page is closed',
  'field.toast': 'In-app toast',
  'field.toastSub': 'Bottom-right toast inside the page',
  'field.sound': 'Sound',
  'field.soundSub': 'Played when a task finishes',
  'field.error': 'Error notification',
  'field.errorSub': 'Show a red card when a task fails',

  'row.foot': 'Card style, font, and sound are configured in Task Notifications settings',
  'page.desc': 'Get notified when a session round finishes; the desktop card is a custom top-most window and does not depend on system notification settings.',

  'card.channels': 'Notification channels',
  'card.style': 'Card style',
  'card.font': 'Font',
  'card.sound': 'Sound',
  'field.theme': 'Theme',
  'field.accent': 'Accent',
  'field.position': 'Position',
  'field.duration': 'Duration',
  'field.fontSize': 'Font size',
  'field.fontFamily': 'Font',
  'field.soundEnable': 'Enable sound',
  'field.soundEnableSub': 'Plays when a task finishes, independent of the browser',
  'field.soundType': 'Sound',
  'field.volume': 'Volume',
  'field.volumeFixedSub': 'System sound does not support volume control',

  'options.theme.dark': 'Dark',
  'options.theme.light': 'Light',
  'options.position.br': 'Bottom right',
  'options.position.bl': 'Bottom left',
  'options.position.tr': 'Top right',
  'options.position.tl': 'Top left',
  'options.duration.4': '4 sec',
  'options.duration.6': '6 sec',
  'options.duration.8': '8 sec',
  'options.duration.10': '10 sec',
  'options.fontSize.11': 'Small',
  'options.fontSize.12': 'Standard',
  'options.fontSize.13': 'Large',
  'options.fontSize.14': 'X-Large',
  'options.font.yahei': 'Microsoft YaHei UI',
  'options.font.default': 'System default',
  'options.font.simsun': 'SimSun',
  'options.font.simhei': 'SimHei',
  'options.font.kaiti': 'KaiTi',
  'options.sound.apple': 'Apple tri-tone',
  'options.sound.ding': 'Ding',
  'options.sound.double': 'Double beep',
  'options.sound.system': 'System sound',
}

export const DICTS = { zh, en }

let bind: ((key: string, params?: Record<string, string | number>) => string) | undefined

/** apply 时绑定 locale.bind(NS)。 */
export function setTranslator(translate: (key: string, params?: Record<string, string | number>) => string): void {
  bind = translate
}

/** 组件内取文案；未绑定时回退到 key 本身。 */
export function t(key: string, params?: Record<string, string | number>): string {
  if (bind !== undefined) return bind(key, params)
  return key
}
