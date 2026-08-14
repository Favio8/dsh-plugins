# relaunch-web.ps1 — 重启本机 dsh web 进程（新增/更新源码插件后必做，AGENTS.md §3）
# 用法: powershell -ExecutionPolicy Bypass -File .\relaunch-web.ps1 [-Delay 8]
# 流程: 等待 Delay 秒（给当前会话收尾）→ 杀 3080 端口旧进程 → 启动 node bin.js web
#       → 轮询 HTTP 200 → 校验 workspace-files 进入 boot manifest → 写 .relaunch-log.txt
param(
  [int]$Port = 3080,
  [int]$Delay = 8,
  [string]$PluginMarker = 'workspace-files'
)

$ErrorActionPreference = 'SilentlyContinue'
$root = $PSScriptRoot
$log = Join-Path $root '.relaunch-log.txt'
$bin = 'C:\Users\19949\AppData\Local\npm-cache\_npx\1e7f6d9597241db0\node_modules\@deepseek-ai\dsh\lib\bin.js'
$out = Join-Path $root '.dsh-web-out.txt'
$err = Join-Path $root '.dsh-web-err.txt'

function Log([string]$msg) {
  $line = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
  $line | Tee-Object -FilePath $log -Append | Out-Null
  Write-Host $line
}

Log 'relauncher start'
if ($Delay -gt 0) { Log "delay $Delay s (let the session settle)"; Start-Sleep -Seconds $Delay }

# 释放端口
$conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($conn) {
  $conn | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
    Log "killing pid $_"
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
  }
  Start-Sleep -Seconds 2
}
$free = -not (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue)
Log "port free: $free"
if (-not $free) { Log 'RESULT ok=False (port busy)'; exit 1 }

# 启动
$proc = Start-Process -FilePath 'node' -ArgumentList @($bin, 'web') -WorkingDirectory $root `
  -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError $err -PassThru
Log "dsh web pid $($proc.Id)"

# 轮询 HTTP 200
$ok = $false
for ($i = 0; $i -lt 60; $i++) {
  Start-Sleep -Milliseconds 500
  try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 3
    if ($r.StatusCode -eq 200) { $ok = $true; break }
  } catch {}
}
Log "HTTP 200: $ok"

# 校验插件进入 boot manifest
$found = $false
if ($ok) {
  try {
    $html = (Invoke-WebRequest -Uri "http://127.0.0.1:$Port/" -UseBasicParsing -TimeoutSec 6).Content
    $found = $html -match [regex]::Escape($PluginMarker)
    Log "$PluginMarker in boot manifest: $found"
  } catch { Log 'manifest check failed' }
}

$result = $ok -and $found
Log "RESULT ok=$result"
if ($result) { exit 0 } else { exit 1 }
