/**
 * Host 桥封装：同源相对 fetch（与 task-notify 的 /task-notify/* 同款通道）。
 * 所有请求带 AbortSignal；错误归一为 { ok:false, error }。
 */

export interface ListEntry {
  name: string
  path: string
  kind: 'file' | 'dir'
  size?: number
  mtime?: number
}

export interface ListResult {
  ok: boolean
  path?: string
  entries?: ListEntry[]
  truncated?: boolean
  error?: string
}

export interface ReadResult {
  ok: boolean
  path?: string
  content?: string
  /** 本次实际读取的字节数（用于“加载更多”精确续读；UTF-8 多字节场景不能依赖 content.length）。 */
  bytesRead?: number
  binary?: boolean
  truncated?: boolean
  size?: number
  encoding?: string
  imageDataUrl?: string
  error?: string
}

export interface HostConfig {
  maxPreviewBytes: number
  imageMaxBytes: number
  allowOutsideCwd: boolean
}

function q(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, String(v))
  }
  const s = sp.toString()
  return s === '' ? '' : `?${s}`
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const res = await fetch(url, { signal })
    if (!res.ok) {
      try {
        const body = (await res.json()) as { error?: string }
        return { ok: false, error: body.error ?? `HTTP ${res.status}` } as T
      } catch {
        return { ok: false, error: `HTTP ${res.status}` } as T
      }
    }
    return (await res.json()) as T
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    return { ok: false, error: '无法连接宿主桥' } as T
  }
}

/** 列一层目录。rel 为相对 root 的路径（'' = root）。 */
export function listDir(
  root: string,
  rel: string,
  showHidden: boolean,
  signal?: AbortSignal,
): Promise<ListResult> {
  return getJson<ListResult>(
    `/workspace-files/list${q({ root, path: rel, hidden: showHidden ? 1 : undefined })}`,
    signal,
  )
}

/** 读文件片段。 */
export function readFile(
  root: string,
  rel: string,
  offset: number,
  limit: number,
  signal?: AbortSignal,
): Promise<ReadResult> {
  return getJson<ReadResult>(
    `/workspace-files/read${q({ root, path: rel, offset, limit })}`,
    signal,
  )
}

export function getHostConfig(signal?: AbortSignal): Promise<HostConfig | null> {
  return getJson<HostConfig>(`/workspace-files/config`, signal)
}

export async function patchHostConfig(patch: Partial<HostConfig>): Promise<HostConfig | null> {
  try {
    const res = await fetch('/workspace-files/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    })
    return (await res.json()) as HostConfig
  } catch {
    return null
  }
}
