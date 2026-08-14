/**
 * 路径工具（浏览器端，纯字符串处理）。
 * Windows 分隔符（\\）与正斜杠均接受；显示统一用正斜杠。
 */

/** 取 basename（两套分隔符）。 */
export function basenameOf(path: string): string {
  const at = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  return at === -1 ? path : path.slice(at + 1)
}

/** 目录名（不含末尾分隔符的父路径）。 */
export function dirnameOf(path: string): string {
  const norm = path.replace(/[\\/]+$/, '')
  const at = Math.max(norm.lastIndexOf('/'), norm.lastIndexOf('\\'))
  return at === -1 ? '' : norm.slice(0, at)
}

/** 是否绝对路径（盘符或 / 开头）。 */
export function isAbsolute(path: string): boolean {
  return /^[A-Za-z]:[\\/]/.test(path) || path.startsWith('/') || path.startsWith('\\')
}

/** 绝对路径 = 拼接（仅当 rel 为相对路径时）。 */
export function joinAbs(root: string, rel: string): string {
  if (isAbsolute(rel)) return rel
  if (rel === '') return root
  const sep = root.includes('\\') ? '\\' : '/'
  const trimmed = rel.replace(/^[\\/]+/, '').replace(/[\\/]+$/, '')
  return `${root.replace(/[\\/]+$/, '')}${sep}${trimmed}`
}

/** 相对 root 的展示路径（正斜杠）。 */
export function relOf(abs: string, root: string): string {
  const normRoot = root.replace(/[\\/]+$/, '')
  if (abs === normRoot) return '.'
  const lower = abs.toLowerCase()
  const lowerRoot = normRoot.toLowerCase()
  if (lower.startsWith(lowerRoot + '\\') || lower.startsWith(lowerRoot + '/')) {
    return abs.slice(normRoot.length + 1).replace(/\\/g, '/')
  }
  return abs.replace(/\\/g, '/')
}

/** 是否「像」一个文件路径（含分隔符或点扩展名）。 */
export function looksLikePath(value: string): boolean {
  return value.includes('/') || value.includes('\\') || /^[^\\/]+\.[A-Za-z0-9]+$/.test(value)
}

/** 文件图标（按扩展名）。 */
export function fileIcon(name: string): string {
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1).toLowerCase() : ''
  switch (ext) {
    case 'md':
      return '📝'
    case 'json':
    case 'yaml':
    case 'yml':
    case 'toml':
      return '🧾'
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
    case 'svg':
      return '🖼'
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      return '📄'
    default:
      return '📄'
  }
}
