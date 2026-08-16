/**
 * Markdown 渲染：marked 生成 HTML，DOMPurify 做浏览器端消毒。
 * 工作区文件可能来自 clone 的第三方仓库，因此不能信任 marked 的原样 HTML 透传；
 * DOMPurify 会处理 script/事件属性/javascript: 及控制字符混淆等绕过。
 */

import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

/** 渲染 Markdown 为消毒后的 HTML 字符串；失败时回退为转义后的原文。 */
export function renderMarkdown(src: string): string {
  try {
    const out = marked.parse(src)
    if (typeof out !== 'string') return ''
    return DOMPurify.sanitize(out, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
      FORBID_ATTR: ['style'],
    })
  } catch {
    return src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
}

/** 是否 Markdown 文件（按扩展名）。 */
export function isMarkdownPath(relPath: string): boolean {
  return /\.(md|markdown|mdown|mdx)$/i.test(relPath)
}
