import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { open, readdir, realpath, stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir } from 'node:os'
import { extname, join, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'

export const name = 'workspace-files'
export const inject = ['webServer']

/**
 * dsh-plugin-workspace-files — Host 半：工作区文件 HTTP 桥。
 *
 * 只读能力，供客户端 @ 文件菜单、侧边栏预览、项目文件夹浏览取数：
 *   GET  /workspace-files/list?root=&path=&hidden=  列一层目录（文件+目录）
 *   GET  /workspace-files/read?root=&path=&offset=&limit=  读文件片段（文本/二进制/图片）
 *   GET  /workspace-files/config                     读取安全配置
 *   POST /workspace-files/config                     更新安全配置
 *
 * 安全（服务端强制，客户端不可绕过）：
 * - 只读：不提供任何写接口；
 * - root guard：目标路径 resolve 后必须位于边界之内（默认 = 请求 root，
 *   开启 allowOutsideCwd 后放宽为主目录），realpath 复核防符号链接逃逸；
 * - 大小上限：文本读取按 offset/limit 分段，上限由配置强制；
 * - webServer 绑定 127.0.0.1。
 * 配置持久化在 ~/.dsh/plugins/workspace-files.json。
 */

interface HostConfig {
  maxPreviewBytes: number
  imageMaxBytes: number
  allowOutsideCwd: boolean
}

const DEFAULTS: HostConfig = {
  maxPreviewBytes: 512 * 1024,
  imageMaxBytes: 2 * 1024 * 1024,
  allowOutsideCwd: false,
}

/** 菜单/浏览中始终忽略的目录名（大小写不敏感比较）。 */
const IGNORED_NAMES = ['node_modules', '.git', 'dist', 'build', 'out', '.next']

/** 明确按二进制处理的扩展名（不含图片——图片单独走 dataURL）。 */
const BINARY_EXTS = new Set([
  '.pdf', '.zip', '.gz', '.tgz', '.tar', '.7z', '.rar', '.xz', '.bz2',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.dat', '.db', '.sqlite', '.sqlite3',
  '.woff', '.woff2', '.ttf', '.otf', '.wasm', '.class', '.pyc', '.o', '.a',
  '.ico', '.mp3', '.mp4', '.mov', '.avi', '.mkv', '.webm',
])

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'])

const LIST_CAP = 200

/** HTTP 桥 JSON body 大小上限（本地接口，防止异常请求占用内存）。 */
const MAX_JSON_BODY_BYTES = 64 * 1024

const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), '.dsh')
const CONFIG_DIR = join(DSH_HOME, 'plugins')
const CONFIG_PATH = join(CONFIG_DIR, 'workspace-files.json')

function loadConfig(): HostConfig {
  try {
    if (!existsSync(CONFIG_PATH)) return { ...DEFAULTS }
    const raw = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as Partial<HostConfig>
    return {
      maxPreviewBytes: pickInt(raw.maxPreviewBytes, DEFAULTS.maxPreviewBytes, 64 * 1024, 8 * 1024 * 1024),
      imageMaxBytes: pickInt(raw.imageMaxBytes, DEFAULTS.imageMaxBytes, 64 * 1024, 16 * 1024 * 1024),
      allowOutsideCwd: typeof raw.allowOutsideCwd === 'boolean' ? raw.allowOutsideCwd : DEFAULTS.allowOutsideCwd,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

function pickInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.floor(value)))
}

let config = loadConfig()

function saveConfig(next: HostConfig): void {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true })
    writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2), 'utf8')
  } catch (error) {
    console.error('[workspace-files] 保存配置失败:', error)
  }
}

/** 路径守卫结果：ok 时 abs 为解析后的绝对路径（可能不存在，由调用方 stat 判定）。 */
type GuardResult = { ok: true; abs: string } | { ok: false; status: number; error: string }

/**
 * 校验目标路径位于边界内。
 * 边界：默认 = root 本身；allowOutsideCwd=true 时 = root 本身 + 宿主主目录。
 * 这样即使工作区不在主目录下（如 D:\code\project），开启“允许浏览工作区之外”
 * 也不会把原本工作区内的合法访问误杀。
 * realpath 复核：目标存在时解析符号链接，链接指向边界外一律拒绝。
 */
async function guardPath(root: string, target: string): Promise<GuardResult> {
  const absRoot = resolve(root)
  const abs = resolve(absRoot, target)
  const home = resolve(homedir())

  const withinRoot = (candidate: string): boolean =>
    candidate === absRoot || candidate.startsWith(absRoot + sep)
  const withinHome = (candidate: string): boolean =>
    config.allowOutsideCwd && (candidate === home || candidate.startsWith(home + sep))

  if (!withinRoot(abs) && !withinHome(abs)) {
    return { ok: false, status: 403, error: '越权：路径超出允许范围' }
  }
  try {
    const real = await realpath(abs)
    if (!withinRoot(real) && !withinHome(real)) {
      return { ok: false, status: 403, error: '越权：符号链接指向允许范围之外' }
    }
  } catch {
    // 目标不存在：由调用方按 404/400 处理
  }
  return { ok: true, abs }
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolveBody) => {
    let data = ''
    let tooLarge = false
    req.on('data', (chunk: Buffer) => {
      if (tooLarge) return
      data += chunk.toString('utf8')
      if (Buffer.byteLength(data, 'utf8') > MAX_JSON_BODY_BYTES) {
        tooLarge = true
        resolveBody(null)
        req.destroy()
      }
    })
    req.on('end', () => {
      if (tooLarge) return
      try {
        resolveBody(JSON.parse(data))
      } catch {
        resolveBody(null)
      }
    })
    req.on('error', () => resolveBody(null))
  })
}

function parseQuery(req: IncomingMessage): URLSearchParams {
  return new URL(req.url ?? '/', 'http://localhost').searchParams
}

interface ListEntry {
  name: string
  path: string
  kind: 'file' | 'dir'
  size?: number
  mtime?: number
}

async function handleList(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    sendJson(res, 405, { ok: false, error: 'method not allowed' })
    return
  }
  const params = parseQuery(req)
  const root = params.get('root') ?? ''
  const rel = params.get('path') ?? '.'
  const showHidden = params.get('hidden') === '1'
  if (root === '') {
    sendJson(res, 400, { ok: false, error: '缺少 root 参数' })
    return
  }
  const guarded = await guardPath(root, rel)
  if (!guarded.ok) {
    sendJson(res, guarded.status, { ok: false, error: guarded.error })
    return
  }
  try {
    const dirents = await readdir(guarded.abs, { withFileTypes: true })
    const visible = dirents.filter((d) => {
      if (IGNORED_NAMES.includes(d.name.toLowerCase())) return false
      if (!showHidden && d.name.startsWith('.')) return false
      return true
    })
    const withStat = await Promise.all(
      visible.map(async (d): Promise<ListEntry> => {
        const full = join(guarded.abs, d.name)
        try {
          const s = await stat(full)
          return {
            name: d.name,
            path: full,
            kind: d.isDirectory() ? 'dir' : 'file',
            size: s.size,
            mtime: s.mtimeMs,
          }
        } catch {
          return { name: d.name, path: full, kind: d.isDirectory() ? 'dir' : 'file' }
        }
      }),
    )
    withStat.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    const truncated = withStat.length > LIST_CAP
    sendJson(res, 200, { ok: true, path: guarded.abs, entries: withStat.slice(0, LIST_CAP), truncated })
  } catch {
    sendJson(res, 404, { ok: false, error: '目录不存在或不可读' })
  }
}

async function handleRead(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'GET') {
    sendJson(res, 405, { ok: false, error: 'method not allowed' })
    return
  }
  const params = parseQuery(req)
  const root = params.get('root') ?? ''
  const rel = params.get('path') ?? ''
  if (root === '' || rel === '') {
    sendJson(res, 400, { ok: false, error: '缺少 root/path 参数' })
    return
  }
  const guarded = await guardPath(root, rel)
  if (!guarded.ok) {
    sendJson(res, guarded.status, { ok: false, error: guarded.error })
    return
  }
  let info
  try {
    info = await stat(guarded.abs)
  } catch {
    sendJson(res, 404, { ok: false, error: '文件不存在' })
    return
  }
  if (info.isDirectory()) {
    sendJson(res, 400, { ok: false, error: '目标是一个目录' })
    return
  }
  const ext = extname(guarded.abs).toLowerCase()
  const size = info.size

  // 图片：整读 → dataURL（受 imageMaxBytes 约束）
  if (IMAGE_EXTS.has(ext)) {
    if (size > config.imageMaxBytes) {
      sendJson(res, 200, {
        ok: true,
        path: guarded.abs,
        size,
        binary: true,
        error: '图片超过预览大小上限',
      })
      return
    }
    try {
      const handle = await open(guarded.abs, 'r')
      try {
        const buf = await handle.readFile()
        const mime = ext === '.svg' ? 'image/svg+xml' : `image/${ext.slice(1)}`
        sendJson(res, 200, {
          ok: true,
          path: guarded.abs,
          size,
          binary: false,
          imageDataUrl: `data:${mime};base64,${buf.toString('base64')}`,
        })
      } finally {
        await handle.close()
      }
      return
    } catch {
      sendJson(res, 500, { ok: false, error: '图片读取失败' })
      return
    }
  }

  // 明确二进制扩展名：不读内容
  if (BINARY_EXTS.has(ext)) {
    sendJson(res, 200, { ok: true, path: guarded.abs, size, binary: true })
    return
  }

  // 文本：分段读取
  const offset = Math.max(0, Number.parseInt(params.get('offset') ?? '0', 10) || 0)
  const limitRaw = Number.parseInt(params.get('limit') ?? '', 10)
  const limit = Number.isFinite(limitRaw) && limitRaw > 0
    ? Math.min(limitRaw, config.maxPreviewBytes)
    : config.maxPreviewBytes
  if (offset >= size) {
    sendJson(res, 200, { ok: true, path: guarded.abs, size, content: '', bytesRead: 0, truncated: false, encoding: 'utf8' })
    return
  }
  try {
    const handle = await open(guarded.abs, 'r')
    try {
      const buf = Buffer.alloc(limit)
      const { bytesRead } = await handle.read(buf, 0, limit, offset)
      const chunk = buf.subarray(0, bytesRead)
      // 二进制嗅探：前 4KB 含 NUL 视为二进制
      if (chunk.subarray(0, 4096).includes(0)) {
        sendJson(res, 200, { ok: true, path: guarded.abs, size, binary: true })
        return
      }
      sendJson(res, 200, {
        ok: true,
        path: guarded.abs,
        size,
        content: chunk.toString('utf8'),
        bytesRead,
        truncated: offset + bytesRead < size,
        encoding: 'utf8',
      })
    } finally {
      await handle.close()
    }
  } catch {
    sendJson(res, 500, { ok: false, error: '文件读取失败' })
  }
}

function handleConfig(req: IncomingMessage, res: ServerResponse): void {
  if (req.method === 'GET') {
    sendJson(res, 200, { ok: true, ...config })
    return
  }
  if (req.method === 'POST') {
    void readJsonBody(req).then((body) => {
      const patch = (typeof body === 'object' && body !== null ? body : {}) as Partial<HostConfig>
      const keys = Object.keys(patch) as (keyof HostConfig)[]
      if (keys.length === 0) {
        sendJson(res, 400, { ok: false, error: '配置项不能为空' })
        return
      }
      const known: Record<keyof HostConfig, boolean> = {
        maxPreviewBytes: true,
        imageMaxBytes: true,
        allowOutsideCwd: true,
      }
      for (const key of keys) {
        if (!known[key]) {
          sendJson(res, 400, { ok: false, error: `未知配置项: ${key}` })
          return
        }
      }
      const next: HostConfig = {
        maxPreviewBytes: keys.includes('maxPreviewBytes')
          ? pickInt(patch.maxPreviewBytes, config.maxPreviewBytes, 64 * 1024, 8 * 1024 * 1024)
          : config.maxPreviewBytes,
        imageMaxBytes: keys.includes('imageMaxBytes')
          ? pickInt(patch.imageMaxBytes, config.imageMaxBytes, 64 * 1024, 16 * 1024 * 1024)
          : config.imageMaxBytes,
        allowOutsideCwd: keys.includes('allowOutsideCwd')
          ? typeof patch.allowOutsideCwd === 'boolean'
            ? patch.allowOutsideCwd
            : config.allowOutsideCwd
          : config.allowOutsideCwd,
      }
      config = next
      saveConfig(config)
      sendJson(res, 200, { ok: true, ...config })
    })
    return
  }
  sendJson(res, 405, { ok: false, error: 'method not allowed' })
}

export function apply(ctx: Context): void {
  const webServer = ctx.get('webServer') as
    | { register(route: { kind: 'exact'; path: string; handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }): () => void }
    | undefined
  if (webServer === undefined) return

  ctx.effect(() =>
    webServer.register({ kind: 'exact', path: '/workspace-files/list', handler: handleList }),
  )
  ctx.effect(() =>
    webServer.register({ kind: 'exact', path: '/workspace-files/read', handler: handleRead }),
  )
  ctx.effect(() =>
    webServer.register({ kind: 'exact', path: '/workspace-files/config', handler: handleConfig }),
  )
}
