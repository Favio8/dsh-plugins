/**
 * 插件文案（zh/en 双语）。全部文案必须走 t()，不硬编码中文。
 */

export const NS = 'workspace-files'

const zh = {
  'settings.title': '工作区文件',
  'settings.desc': '输入框 @ 引用文件、修改文件点击侧边栏预览、右上角项目文件夹浏览。',
  'settings.intercept': '点击文件打开预览',
  'settings.interceptSub': '产物 / 文件提及 / 工具卡片中的文件路径点击后在此预览（关闭后恢复系统打开）',
  'settings.showHidden': '显示隐藏文件',
  'settings.showHiddenSub': '文件夹浏览中显示点开头的文件与目录',
  'settings.ignore': '忽略规则',
  'settings.ignoreSub': '逗号分隔的目录/文件名；与内置 node_modules/.git 等合并生效',
  'settings.maxPreview': '预览大小上限',
  'settings.maxPreviewSub': '文本预览单次读取上限（服务端强制）',
  'settings.outside': '允许浏览工作区之外',
  'settings.outsideSub': '放宽读取边界到主目录（谨慎）',
  'settings.recentCount': '最近引用条数',
  'settings.recentCountSub': '@ 菜单置顶显示的最近文件数量',
  'settings.hostHint': '宿主桥未连接，安全参数无法保存',
  'preview.copyPath': '复制路径',
  'preview.copyDone': '已复制',
  'preview.openSystem': '在系统中打开',
  'preview.rendered': '渲染',
  'preview.raw': '原文',
  'preview.back': '← 返回文件夹',
  'preview.binary': '二进制文件，暂不支持预览',
  'preview.imageTooLarge': '图片超过预览大小上限',
  'preview.truncated': '内容较长，已显示前 {count} 行',
  'preview.loadMore': '加载更多',
  'preview.loading': '加载中…',
  'preview.error': '读取失败：{error}',
  'preview.retry': '重试',
  'preview.lines': '{lines} 行 · {size}',
  'preview.close': '关闭预览',
  'browser.title': '项目文件夹',
  'browser.refresh': '刷新',
  'browser.close': '关闭',
  'browser.empty': '此目录为空',
  'browser.emptyOpen': '在系统中打开',
  'browser.folder': '📁 {name}',
  'browser.folderTooltip': '当前会话工作目录：{path}',
  'browser.noCwd': '当前会话无工作目录',
  'mention.recent': '最近引用',
}

const en: Record<string, string> = {
  'settings.title': 'Workspace Files',
  'settings.desc': 'Mention files with @, preview modified files in the sidebar, and browse the project folder.',
  'settings.intercept': 'Open file preview on click',
  'settings.interceptSub': 'Produced files, mentions, and tool-card paths preview here (system open restored when off)',
  'settings.showHidden': 'Show hidden files',
  'settings.showHiddenSub': 'Show dot-prefixed files and directories in the folder browser',
  'settings.ignore': 'Ignore rules',
  'settings.ignoreSub': 'Comma-separated names; merged with built-in node_modules/.git etc.',
  'settings.maxPreview': 'Preview size limit',
  'settings.maxPreviewSub': 'Max bytes per text preview read (enforced host-side)',
  'settings.outside': 'Allow browsing outside workspace',
  'settings.outsideSub': 'Relax the read boundary to the home directory (use with care)',
  'settings.recentCount': 'Recent count',
  'settings.recentCountSub': 'Number of recent files pinned at the top of the @ menu',
  'settings.hostHint': 'Host bridge unreachable; security settings cannot be saved',
  'preview.copyPath': 'Copy path',
  'preview.copyDone': 'Copied',
  'preview.openSystem': 'Open in system',
  'preview.rendered': 'Rendered',
  'preview.raw': 'Raw',
  'preview.back': '← Back to folder',
  'preview.binary': 'Binary file — preview not supported',
  'preview.imageTooLarge': 'Image exceeds the preview size limit',
  'preview.truncated': 'Long content — showing first {count} lines',
  'preview.loadMore': 'Load more',
  'preview.loading': 'Loading…',
  'preview.error': 'Read failed: {error}',
  'preview.retry': 'Retry',
  'preview.lines': '{lines} lines · {size}',
  'preview.close': 'Close preview',
  'browser.title': 'Project Folder',
  'browser.refresh': 'Refresh',
  'browser.close': 'Close',
  'browser.empty': 'This folder is empty',
  'browser.emptyOpen': 'Open in system',
  'browser.folder': '📁 {name}',
  'browser.folderTooltip': 'Current session working directory: {path}',
  'browser.noCwd': 'Current session has no working directory',
  'mention.recent': 'Recent',
}

/** 全部字典。 */
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
