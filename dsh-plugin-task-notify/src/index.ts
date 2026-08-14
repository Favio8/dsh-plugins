import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'

export const name = 'task-notify'
export const inject = ['webServer']

/**
 * dsh-plugin-task-notify — Host 半：桌面级完成通知。
 *
 * 监听 agent/status（running→idle = 一轮任务完成），任务完成时通过
 * PowerShell 弹**飞书式置顶卡片**（自定义无边框窗口，不经过 Windows 通知
 * 管道，因此系统通知总开关关闭时依然显示）——**与浏览器页面是否打开无关**。
 * 卡片样式（主题/强调色/位置/时长/字号/字体）由配置驱动，可在设置页调整。
 * 另注册 HTTP 桥，供客户端设置行/设置页调用：
 *   GET  /task-notify/config       读取完整配置
 *   POST /task-notify/config       局部更新（{ "desktop": ..., "accent": ... }）
 *   POST /task-notify/test         按当前配置立即弹一条测试卡片
 *
 * 配置持久化在 ~/.dsh/plugins/task-notify.json，默认开启。
 * 仅支持 Windows（powershell.exe + WinForms）；其他平台通道不可用但不影响启动。
 */

const THEMES = ['dark', 'light'] as const
const ACCENTS = ['green', 'blue', 'orange', 'purple'] as const
const POSITIONS = ['br', 'bl', 'tr', 'tl'] as const
const DURATIONS = [4, 6, 8, 10] as const
const FONT_SIZES = [11, 12, 13, 14] as const
const FONT_FAMILIES = ['Microsoft YaHei UI', 'Segoe UI', 'SimSun', 'SimHei', 'KaiTi'] as const

interface NotifyConfig {
  desktop: boolean
  theme: string
  accent: string
  position: string
  durationSec: number
  fontSize: number
  fontFamily: string
}

const DEFAULTS: NotifyConfig = {
  desktop: true,
  theme: 'dark',
  accent: 'green',
  position: 'br',
  durationSec: 6,
  fontSize: 12,
  fontFamily: 'Microsoft YaHei UI',
}

function isOneOf<T extends string | number>(value: unknown, list: readonly T[]): value is T {
  return list.includes(value as T)
}

function sanitizeConfig(raw: unknown): NotifyConfig {
  const src = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<NotifyConfig>
  return {
    desktop: typeof src.desktop === 'boolean' ? src.desktop : DEFAULTS.desktop,
    theme: isOneOf(src.theme, THEMES) ? src.theme : DEFAULTS.theme,
    accent: isOneOf(src.accent, ACCENTS) ? src.accent : DEFAULTS.accent,
    position: isOneOf(src.position, POSITIONS) ? src.position : DEFAULTS.position,
    durationSec: isOneOf(src.durationSec, DURATIONS) ? src.durationSec : DEFAULTS.durationSec,
    fontSize: isOneOf(src.fontSize, FONT_SIZES) ? src.fontSize : DEFAULTS.fontSize,
    fontFamily: isOneOf(src.fontFamily, FONT_FAMILIES) ? src.fontFamily : DEFAULTS.fontFamily,
  }
}

interface AgentLike {
  id: string
  status: 'idle' | 'running'
  session?: {
    header?: {
      origin?: string
      parentSession?: string
    }
  }
}

/**
 * DSH 自定义事件（agent/status、agent/disposed）由宿主包增强类型声明，
 * 本插件未依赖其类型，这里用最小结构视图定型；运行时仍是 ctx.on，
 * 生命周期与 fiber 清理行为不变。
 */
interface AgentEvents {
  on(name: 'agent/status', listener: (payload: { agent: AgentLike; status: string }) => void): () => void
  on(name: 'agent/disposed', listener: (payload: { agent: { id: string } }) => void): () => void
}

const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), '.dsh')
const CONFIG_DIR = join(DSH_HOME, 'plugins')
const CONFIG_PATH = join(CONFIG_DIR, 'task-notify.json')
const SCRIPT_PATH = join(tmpdir(), 'dsh-task-notify-popup.ps1')
const WEB_URL = 'http://127.0.0.1:3080'

// 防抖窗口：连续完成（如排队消息逐条跑完）只弹一次
const DEBOUNCE_MS = 2000

/** 会话标题过长时截断，避免卡片溢出。 */
function truncateTitle(title: string, max = 26): string {
  return title.length > max ? `${title.slice(0, max)}…` : title
}

/**
 * 飞书式弹窗：自定义无边框置顶卡片（WinForms），**不经过 Windows 通知管道**，
 * 因此系统通知总开关关闭时依然能显示（与飞书/微信桌面端同款做法）。
 * 样式由参数驱动：主题（深/浅）、强调色、位置（四角）、显示时长、字号、字体。
 * 点击卡片打开 DSH，右上角 × 可关闭，到时自动消失。
 */
const POPUP_SCRIPT = String.raw`
param(
  [string]$Title, [string]$Text, [string]$Url,
  [string]$Theme, [string]$Accent, [string]$Position,
  [int]$DurationSec, [int]$FontSize, [string]$FontFamily
)
$ErrorActionPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ── 主题色 ───────────────────────────────────────────────
if ($Theme -eq 'light') {
  $bg = [System.Drawing.Color]::White
  $fg = [System.Drawing.Color]::FromArgb(31, 35, 41)
  $sub = [System.Drawing.Color]::FromArgb(100, 106, 115)
  $closeBg = [System.Drawing.Color]::White
  $closeFg = [System.Drawing.Color]::FromArgb(140, 145, 155)
  $closeHover = [System.Drawing.Color]::FromArgb(240, 242, 245)
} else {
  $bg = [System.Drawing.Color]::FromArgb(30, 30, 36)
  $fg = [System.Drawing.Color]::White
  $sub = [System.Drawing.Color]::FromArgb(200, 200, 210)
  $closeBg = [System.Drawing.Color]::FromArgb(30, 30, 36)
  $closeFg = [System.Drawing.Color]::FromArgb(160, 160, 170)
  $closeHover = [System.Drawing.Color]::FromArgb(60, 60, 70)
}

switch ($Accent) {
  'blue'   { $accentColor = [System.Drawing.Color]::FromArgb(74, 144, 217) }
  'orange' { $accentColor = [System.Drawing.Color]::FromArgb(232, 161, 61) }
  'purple' { $accentColor = [System.Drawing.Color]::FromArgb(155, 111, 232) }
  default  { $accentColor = [System.Drawing.Color]::FromArgb(87, 180, 120) }
}

$form = New-Object System.Windows.Forms.Form
$form.Text = 'dsh-task-notify'
$form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None
$form.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$form.TopMost = $true
$form.ShowInTaskbar = $false
$form.BackColor = $bg
$form.Width = 340
$form.Height = 92
$form.Font = New-Object System.Drawing.Font($FontFamily, $FontSize)

$accent = New-Object System.Windows.Forms.Panel
$accent.Width = 4
$accent.Dock = 'Left'
$accent.BackColor = $accentColor
$form.Controls.Add($accent)

$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = $Title
$titleLabel.ForeColor = $fg
$titleLabel.Font = New-Object System.Drawing.Font($FontFamily, ($FontSize + 1), [System.Drawing.FontStyle]::Bold)
$titleLabel.Location = New-Object System.Drawing.Point(16, 10)
$titleLabel.AutoSize = $true
$form.Controls.Add($titleLabel)

$bodyLabel = New-Object System.Windows.Forms.Label
$bodyLabel.Text = $Text
$bodyLabel.ForeColor = $sub
$bodyLabel.Font = New-Object System.Drawing.Font($FontFamily, $FontSize)
$bodyLabel.Location = New-Object System.Drawing.Point(16, 38)
$bodyLabel.AutoSize = $true
$form.Controls.Add($bodyLabel)

$closeBtn = New-Object System.Windows.Forms.Button
$closeBtn.Text = 'x'
$closeBtn.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$closeBtn.FlatAppearance.BorderSize = 0
$closeBtn.FlatAppearance.MouseOverBackColor = $closeHover
$closeBtn.FlatAppearance.MouseDownBackColor = $closeHover
$closeBtn.BackColor = $closeBg
$closeBtn.ForeColor = $closeFg
$closeBtn.Font = New-Object System.Drawing.Font('Segoe UI', 12, [System.Drawing.FontStyle]::Bold)
$closeBtn.Location = New-Object System.Drawing.Point(($form.Width - 34), 2)
$closeBtn.Size = New-Object System.Drawing.Size(30, 26)
$closeBtn.Add_Click({ $form.Close() })
$form.Controls.Add($closeBtn)

$openAction = {
  try { Start-Process $Url } catch {}
  $form.Close()
}
$form.Add_Click($openAction)
$titleLabel.Add_Click($openAction)
$bodyLabel.Add_Click($openAction)
$accent.Add_Click($openAction)

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = ($DurationSec * 1000)
$timer.Add_Tick({ $timer.Stop(); $form.Close() })
$timer.Start()

$area = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
switch ($Position) {
  'bl' { $x = $area.Left + 16;      $y = $area.Bottom - $form.Height - 16 }
  'tr' { $x = $area.Right - $form.Width - 16; $y = $area.Top + 16 }
  'tl' { $x = $area.Left + 16;      $y = $area.Top + 16 }
  default { $x = $area.Right - $form.Width - 16; $y = $area.Bottom - $form.Height - 16 }
}
$form.Location = New-Object System.Drawing.Point($x, $y)

[System.Windows.Forms.Application]::Run($form)
`.trimStart()

function loadConfig(): NotifyConfig {
  try {
    if (!existsSync(CONFIG_PATH)) return { ...DEFAULTS }
    return sanitizeConfig(JSON.parse(readFileSync(CONFIG_PATH, 'utf8')))
  } catch {
    return { ...DEFAULTS }
  }
}

function saveConfig(cfg: NotifyConfig): void {
  try {
    mkdirSync(CONFIG_DIR, { recursive: true })
    writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8')
  } catch (error) {
    console.error('[task-notify] 保存配置失败:', error)
  }
}

/** 按当前配置弹飞书式置顶卡片（fire-and-forget，不阻塞宿主；不依赖系统通知开关）。 */
function showPopup(title: string, text: string, url: string = WEB_URL): void {
  if (process.platform !== 'win32') return
  try {
    writeFileSync(SCRIPT_PATH, POPUP_SCRIPT, 'utf8')
    const child = spawn(
      'powershell.exe',
      [
        '-NoProfile',
        '-WindowStyle',
        'Hidden',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        SCRIPT_PATH,
        title,
        text,
        url,
        config.theme,
        config.accent,
        config.position,
        String(config.durationSec),
        String(config.fontSize),
        config.fontFamily,
      ],
      { windowsHide: true, stdio: 'ignore' },
    )
    child.on('error', () => {
      // 弹出失败（如系统无 powershell）静默忽略，不影响宿主
    })
  } catch (error) {
    console.error('[task-notify] 弹通知失败:', error)
  }
}

function readJsonBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk: Buffer) => {
      data += chunk.toString('utf8')
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve(null)
      }
    })
    req.on('error', () => resolve(null))
  })
}

function sendJson(res: import('node:http').ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

let config = loadConfig()

export function apply(ctx: Context): void {
  const webServer = ctx.get('webServer') as { register(opts: unknown): () => void } | undefined
  const sessionTitle = ctx.get('sessionTitle') as
    | { get(session: unknown): { title: string } | undefined }
    | undefined
  const running = new Map<string, boolean>()
  let lastNotifyAt = 0
  const events = ctx as unknown as AgentEvents

  // ── 任务完成检测：agent/status running→idle ─────────────────
  events.on('agent/status', (payload) => {
    const agent = payload.agent
    // 子代理会话不提醒（避免噪声）
    const header = agent.session?.header
    if (header?.origin === 'subagent' || header?.parentSession !== undefined) return

    const id = agent.id
    const nowRunning = payload.status === 'running'
    const was = running.get(id)
    running.set(id, nowRunning)
    if (was !== true || nowRunning) return

    if (!config.desktop) return
    const now = Date.now()
    if (now - lastNotifyAt < DEBOUNCE_MS) return
    lastNotifyAt = now

    const title = truncateTitle(sessionTitle?.get(agent.session)?.title ?? 'DSH 会话')
    showPopup('DSH 任务完成', `「${title}」已完成`)
  })

  // 清理已销毁 agent 的追踪状态
  events.on('agent/disposed', (payload) => {
    running.delete(payload.agent.id)
  })

  // ── 客户端设置页/设置行的 HTTP 桥 ─────────────────────────
  if (webServer !== undefined) {
    webServer.register({
      kind: 'exact',
      path: '/task-notify/config',
      handler: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => {
        if (req.method === 'GET') {
          sendJson(res, 200, { ...config, supported: process.platform === 'win32' })
          return
        }
        if (req.method === 'POST') {
          void readJsonBody(req).then((body) => {
            const patch = (typeof body === 'object' && body !== null ? body : {}) as Partial<NotifyConfig>
            const keys = Object.keys(patch) as (keyof NotifyConfig)[]
            if (keys.length === 0) {
              sendJson(res, 400, { ok: false, error: '配置项不能为空' })
              return
            }
            const known: Record<keyof NotifyConfig, boolean> = {
              desktop: true,
              theme: true,
              accent: true,
              position: true,
              durationSec: true,
              fontSize: true,
              fontFamily: true,
            }
            for (const key of keys) {
              if (!known[key]) {
                sendJson(res, 400, { ok: false, error: `未知配置项: ${key}` })
                return
              }
            }
            const next = sanitizeConfig({ ...config, ...patch })
            // 拒绝合法但未变的值之外的“非法值静默回退”：对显式给出的键做严格校验
            for (const key of keys) {
              const value = patch[key]
              const valid =
                key === 'desktop'
                  ? typeof value === 'boolean'
                  : key === 'theme'
                    ? isOneOf(value, THEMES)
                    : key === 'accent'
                      ? isOneOf(value, ACCENTS)
                      : key === 'position'
                        ? isOneOf(value, POSITIONS)
                        : key === 'durationSec'
                          ? isOneOf(value, DURATIONS)
                          : key === 'fontSize'
                            ? isOneOf(value, FONT_SIZES)
                            : isOneOf(value, FONT_FAMILIES)
              if (!valid) {
                sendJson(res, 400, { ok: false, error: `非法值: ${key}` })
                return
              }
            }
            config = next
            saveConfig(config)
            sendJson(res, 200, { ok: true, ...config })
          })
          return
        }
        sendJson(res, 405, { ok: false, error: 'method not allowed' })
      },
    })

    webServer.register({
      kind: 'exact',
      path: '/task-notify/test',
      handler: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: 'method not allowed' })
          return
        }
        if (process.platform !== 'win32') {
          sendJson(res, 200, { ok: false, supported: false, error: '桌面通知仅支持 Windows' })
          return
        }
        showPopup('任务完成通知（测试）', '桌面通知通道工作正常 ✓')
        sendJson(res, 200, { ok: true, supported: true })
      },
    })
  }
}
