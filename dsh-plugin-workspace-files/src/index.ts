import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { lstat, open, readdir, realpath, stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { homedir } from 'node:os'
import { extname, join, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'

export const name = 'workspace-files'
export const inject = ['webServer', 'sessions']

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
    // 配置损坏时回退默认值，并尝试原子重建，避免每次请求都重复解析失败。
    const fallback = { ...DEFAULTS }
    try {
      saveConfig(fallback)
    } catch {
      // 重建失败仍以默认值运行
    }
    return fallback
  }
}

function pickInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(max, Math.max(min, Math.floor(value)))
}

let config = loadConfig()

function saveConfig(next: HostConfig): void {
  const tempPath = `${CONFIG_PATH}.tmp`
  try {
    mkdirSync(CONFIG_DIR, { recursive: true })
    writeFileSync(tempPath, JSON.stringify(next, null, 2), 'utf8')
    renameSync(tempPath, CONFIG_PATH)
  } catch (error) {
    try {
      unlinkSync(tempPath)
    } catch {
      // 临时文件可能不存在，忽略
    }
    console.error('[workspace-files] 保存配置失败:', error)
  }
}

interface HostSessionLike {
  header?: {
    cwd?: string
  }
}

interface SessionStoreLike {
  list(): HostSessionLike[]
}

let liveSessions: SessionStoreLike | undefined

/** 路径守卫结果：ok 时 abs 为解析后的绝对路径（可能不存在，由调用方 stat 判定）。 */
type GuardResult = { ok: true; abs: string } | { ok: false; status: number; error: string }

/** Windows 文件系统大小写不敏感，路径比较前统一归一化。 */
function comparePath(path: string): string {
  return process.platform === 'win32' ? path.toLowerCase() : path
}

/** candidate 是否位于 parent 内（或与 parent 相同）；盘符根也正确。 */
function isWithin(parent: string, candidate: string): boolean {
  const p = comparePath(parent)
  const c = comparePath(candidate)
  if (c === p) return true
  const prefix = p.endsWith(sep) ? p : p + sep
  return c.startsWith(prefix)
}

/** 取真实路径；目标不存在时回退为词法绝对路径（调用方会按 404 处理）。 */
async function canonicalPath(path: string): Promise<string> {
  try {
    return await realpath(path)
  } catch {
    return resolve(path)
  }
}

/**
 * root 不允许客户端任意指定：必须是当前 host sessions 中某个会话的 cwd。
 * 这补上了旧实现“root 即边界”的漏洞——否则请求方传 root=D:\secret 即可读任意目录。
 */
async function isRegisteredRoot(root: string): Promise<boolean> {
  const canonicalRoot = comparePath(await canonicalPath(root))
  for (const session of liveSessions?.list() ?? []) {
    const cwd = session.header?.cwd
    if (typeof cwd !== 'string' || cwd === '') continue
    if (comparePath(await canonicalPath(cwd)) === canonicalRoot) return true
  }
  return false
}

/**
 * 校验目标路径位于边界内。
 * 边界：root 必须是已注册会话 cwd；allowOutsideCwd=true 时额外允许宿主主目录。
 * root 与目标都先 canonicalPath：支持 cwd 本身是符号链接/大小写差异，
 * 且符号链接逃逸会因 realpath 落在边界外而被拒绝。
 */
async function guardPath(root: string, target: string): Promise<GuardResult> {
  if (!(await isRegisteredRoot(root))) {
    return { ok: false, status: 403, error: 'root 不是当前已注册会话的工作目录' }
  }
  const absRoot = await canonicalPath(root)
  const abs = resolve(absRoot, target)
  const home = await canonicalPath(resolve(homedir()))

  const withinRoot = (candidate: string): boolean => isWithin(absRoot, candidate)
  const withinHome = (candidate: string): boolean =>
    config.allowOutsideCwd && isWithin(home, candidate)

  if (!withinRoot(abs) && !withinHome(abs)) {
    return { ok: false, status: 403, error: '越权：路径超出允许范围' }
  }
  try {
    const real = await realpath(abs)
    if (!withinRoot(real) && !withinHome(real)) {
      return { ok: false, status: 403, error: '越权：符号链接指向允许范围之外' }
    }
    return { ok: true, abs: real }
  } catch {
    // 目标不存在：由调用方按 404/400 处理
    return { ok: true, abs }
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: number; error: string }

function readJsonBody(req: IncomingMessage): Promise<JsonBodyResult> {
  return new Promise((resolveBody) => {
    let data = ''
    let settled = false
    req.on('data', (chunk: Buffer) => {
      if (settled) return
      data += chunk.toString('utf8')
      if (Buffer.byteLength(data, 'utf8') > MAX_JSON_BODY_BYTES) {
        settled = true
        req.pause()
        resolveBody({ ok: false, status: 413, error: '请求体过大' })
      }
    })
    req.on('end', () => {
      if (settled) return
      settled = true
      try {
        resolveBody({ ok: true, value: JSON.parse(data) })
      } catch {
        resolveBody({ ok: false, status: 400, error: '请求体不是合法 JSON' })
      }
    })
    req.on('error', () => {
      if (settled) return
      settled = true
      resolveBody({ ok: false, status: 400, error: '请求体读取失败' })
    })
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

const IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
}

/**
 * 多字节 UTF-8 字符可能跨 offset/limit 边界：若 chunk 末尾截断了字符，
 * 把 bytesRead 回退到该字符起点，下一段从合法边界续读。
 */
function completeUtf8Prefix(chunk: Buffer, hasMore: boolean): number {
  if (!hasMore || chunk.length === 0) return chunk.length
  let end = chunk.length - 1
  if ((chunk[end] & 0x80) === 0) return chunk.length
  let start = end
  while (start > 0 && (chunk[start] & 0xc0) === 0x80) start--
  const lead = chunk[start]
  const expected =
    lead < 0x80 ? 1 : lead < 0xe0 ? 2 : lead < 0xf0 ? 3 : 4
  return end - start + 1 < expected ? start : chunk.length
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
          const s = await lstat(full)
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
        const mime = IMAGE_MIME[ext] ?? `image/${ext.slice(1)}`
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
      // 多读最多 3 字节，保证跨 chunk 的 UTF-8 字符能在本段完整收尾。
      const readLimit = Math.min(limit + 3, size - offset)
      const buf = Buffer.alloc(readLimit)
      const read = await handle.read(buf, 0, readLimit, offset)
      const safeBytes = completeUtf8Prefix(buf.subarray(0, read.bytesRead), offset + read.bytesRead < size)
      const chunk = buf.subarray(0, safeBytes)
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
        bytesRead: safeBytes,
        truncated: offset + safeBytes < size,
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
    void readJsonBody(req).then((result) => {
      if (!result.ok) {
        sendJson(res, result.status, { ok: false, error: result.error })
        return
      }
      const body = result.value
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
        if (!Object.hasOwn(known, key)) {
          sendJson(res, 400, { ok: false, error: `未知配置项: ${key}` })
          return
        }
        const value = patch[key]
        if (
          (key === 'allowOutsideCwd' && typeof value !== 'boolean') ||
          (key !== 'allowOutsideCwd' && (typeof value !== 'number' || !Number.isInteger(value))) ||
          (key === 'maxPreviewBytes' && (value as number) < 64 * 1024) ||
          (key === 'maxPreviewBytes' && (value as number) > 8 * 1024 * 1024) ||
          (key === 'imageMaxBytes' && (value as number) < 64 * 1024) ||
          (key === 'imageMaxBytes' && (value as number) > 16 * 1024 * 1024)
        ) {
          sendJson(res, 400, { ok: false, error: `非法值: ${key}` })
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
  liveSessions = ctx.get('sessions') as SessionStoreLike | undefined
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
