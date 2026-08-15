/**
 * Markdown 渲染：marked + DOM 级 HTML 消毒。
 * 内容来自用户自己的工作区文件，仍做基础消毒（去 script/style/iframe 等、
 * 事件属性、javascript: 协议）。浏览器端用 DOM 解析，不引入完整 sanitizer 依赖。
 */

import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'form']

function sanitizeHtml(html: string): string {
  if (typeof document === 'undefined') {
    // 非浏览器环境（理论上 client 半不会走到）：保守转义
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  const root = document.createElement('div')
  root.innerHTML = html

  for (const tag of DANGEROUS_TAGS) {
    for (const el of root.querySelectorAll(tag)) el.remove()
  }

  for (const el of root.querySelectorAll('*')) {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase()
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
        continue
      }
      if ((name === 'href' || name === 'src' || name === 'xlink:href') &&
        attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    }
  }

  return root.innerHTML
}

/** 渲染 Markdown 为消毒后的 HTML 字符串；失败时回退原文。 */
export function renderMarkdown(src: string): string {
  try {
    const out = marked.parse(src)
    return sanitizeHtml(typeof out === 'string' ? out : '')
  } catch {
    return sanitizeHtml(src.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
  }
}

/** 是否 Markdown 文件（按扩展名）。 */
export function isMarkdownPath(relPath: string): boolean {
  return /\.(md|markdown|mdown|mdx)$/i.test(relPath)
}
