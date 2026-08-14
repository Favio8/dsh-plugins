/**
 * Markdown 渲染：marked + 轻量 HTML 消毒。
 * 内容来自用户自己的工作区文件，仍做基础消毒（去 script/style/iframe 等、
 * 事件属性、javascript: 协议），不引入完整 sanitizer 依赖。
 */

import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'form']

function sanitizeHtml(html: string): string {
  let out = html
  for (const tag of DANGEROUS_TAGS) {
    out = out.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi'), '')
    out = out.replace(new RegExp(`<${tag}[^>]*\\/?>`, 'gi'), '')
  }
  // 事件属性
  out = out.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  // javascript: 协议
  out = out.replace(/\s(href|src)\s*=\s*(?:"|')?\s*javascript:[^"'>\s]*/gi, '')
  return out
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
