import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
//#region src/sound.ts
const SOUND_TYPES = [
	"apple",
	"ding",
	"double",
	"system"
];
const SAMPLE_RATE = 44100;
/** 正弦 + attack 防爆音 + 指数衰减包络。 */
function synthTone(freq, durationSec, volume) {
	const n = Math.max(1, Math.round(durationSec * SAMPLE_RATE));
	const out = new Float32Array(n);
	const attack = Math.min(.008, durationSec / 6);
	for (let i = 0; i < n; i++) {
		const t = i / SAMPLE_RATE;
		const atk = t < attack ? t / attack : 1;
		const env = Math.exp(-4.2 * (t / durationSec));
		out[i] = Math.sin(2 * Math.PI * freq * t) * atk * env * volume;
	}
	return out;
}
function mixTones(tones) {
	const total = Math.round(Math.max(...tones.map((t) => t.startSec + t.durationSec)) * SAMPLE_RATE);
	const out = new Float32Array(total);
	for (const tone of tones) {
		const seg = synthTone(tone.freq, tone.durationSec, tone.volume ?? .5);
		const offset = Math.round(tone.startSec * SAMPLE_RATE);
		for (let i = 0; i < seg.length && offset + i < total; i++) out[offset + i] += seg[i];
	}
	for (let i = 0; i < out.length; i++) if (out[i] > 1) out[i] = 1;
	else if (out[i] < -1) out[i] = -1;
	return out;
}
function buildWav(samples) {
	const dataLen = samples.length * 2;
	const buf = Buffer.alloc(44 + dataLen);
	buf.write("RIFF", 0);
	buf.writeUInt32LE(36 + dataLen, 4);
	buf.write("WAVE", 8);
	buf.write("fmt ", 12);
	buf.writeUInt32LE(16, 16);
	buf.writeUInt16LE(1, 20);
	buf.writeUInt16LE(1, 22);
	buf.writeUInt32LE(SAMPLE_RATE, 24);
	buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
	buf.writeUInt16LE(2, 32);
	buf.writeUInt16LE(16, 34);
	buf.write("data", 36);
	buf.writeUInt32LE(dataLen, 40);
	for (let i = 0; i < samples.length; i++) {
		const v = Math.max(-1, Math.min(1, samples[i]));
		buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
	}
	return buf;
}
/** 合成指定音色（system 无合成产物）。volumePercent 0..100 为主音量增益。 */
function synthSound(type, volumePercent) {
	const gain = Math.max(0, Math.min(100, volumePercent)) / 100;
	const applyGain = (samples) => {
		const out = new Float32Array(samples.length);
		for (let i = 0; i < samples.length; i++) out[i] = samples[i] * gain;
		return out;
	};
	switch (type) {
		case "apple": return buildWav(applyGain(mixTones([
			{
				freq: 523.25,
				durationSec: .4,
				startSec: 0
			},
			{
				freq: 659.25,
				durationSec: .42,
				startSec: .18
			},
			{
				freq: 783.99,
				durationSec: .5,
				startSec: .36
			}
		])));
		case "ding": return buildWav(applyGain(mixTones([{
			freq: 783.99,
			durationSec: .7,
			startSec: 0
		}])));
		case "double": return buildWav(applyGain(mixTones([{
			freq: 660,
			durationSec: .15,
			startSec: 0
		}, {
			freq: 660,
			durationSec: .18,
			startSec: .25
		}])));
	}
}
//#endregion
//#region src/index.ts
const name = "task-notify";
const inject = ["webServer"];
/**
* dsh-plugin-task-notify — Host 半：桌面级完成通知。
*
* 监听 agent/status（running→idle = 一轮任务完成），任务完成时通过
* PowerShell 弹**飞书式置顶卡片**（自定义无边框窗口，不经过 Windows 通知
* 管道，因此系统通知总开关关闭时依然显示）——**与浏览器页面是否打开无关**。
* 卡片样式（主题/强调色/位置/时长/字号/字体）由配置驱动，可在设置页调整。
* 提示音：任务完成时播放可选提示音（默认苹果三全音，宿主合成 WAV，
* 经 SoundPlayer 播放；系统通知/页面是否打开均不影响），可开关、可选音色。
* 另注册 HTTP 桥，供客户端设置行/设置页调用：
*   GET  /task-notify/config       读取完整配置
*   POST /task-notify/config       局部更新（{ "desktop": ..., "accent": ... }）
*   POST /task-notify/test         按当前配置立即弹一条测试卡片
*
* 配置持久化在 ~/.dsh/plugins/task-notify.json，默认开启。
* 仅支持 Windows（powershell.exe + WinForms）；其他平台通道不可用但不影响启动。
*/
const THEMES = ["dark", "light"];
const ACCENTS = [
	"green",
	"blue",
	"orange",
	"purple"
];
const POSITIONS = [
	"br",
	"bl",
	"tr",
	"tl"
];
const DURATIONS = [
	4,
	6,
	8,
	10
];
const FONT_SIZES = [
	11,
	12,
	13,
	14
];
const FONT_FAMILIES = [
	"Microsoft YaHei UI",
	"Segoe UI",
	"SimSun",
	"SimHei",
	"KaiTi"
];
const DEFAULTS = {
	desktop: true,
	theme: "dark",
	accent: "green",
	position: "br",
	durationSec: 6,
	fontSize: 12,
	fontFamily: "Microsoft YaHei UI",
	sound: true,
	soundType: "apple",
	volume: 80
};
function isOneOf(value, list) {
	return list.includes(value);
}
function sanitizeConfig(raw) {
	const src = typeof raw === "object" && raw !== null ? raw : {};
	return {
		desktop: typeof src.desktop === "boolean" ? src.desktop : DEFAULTS.desktop,
		theme: isOneOf(src.theme, THEMES) ? src.theme : DEFAULTS.theme,
		accent: isOneOf(src.accent, ACCENTS) ? src.accent : DEFAULTS.accent,
		position: isOneOf(src.position, POSITIONS) ? src.position : DEFAULTS.position,
		durationSec: isOneOf(src.durationSec, DURATIONS) ? src.durationSec : DEFAULTS.durationSec,
		fontSize: isOneOf(src.fontSize, FONT_SIZES) ? src.fontSize : DEFAULTS.fontSize,
		fontFamily: isOneOf(src.fontFamily, FONT_FAMILIES) ? src.fontFamily : DEFAULTS.fontFamily,
		sound: typeof src.sound === "boolean" ? src.sound : DEFAULTS.sound,
		soundType: isOneOf(src.soundType, SOUND_TYPES) ? src.soundType : DEFAULTS.soundType,
		volume: typeof src.volume === "number" && Number.isFinite(src.volume) ? Math.max(0, Math.min(100, Math.round(src.volume))) : DEFAULTS.volume
	};
}
/** 子代理会话（origin=subagent 或存在 parentSession）不提醒，避免噪声。 */
function isSubagentSession(session) {
	const header = session?.header;
	return header?.origin === "subagent" || header?.parentSession !== void 0;
}
const DSH_HOME = process.env.DSH_HOME ?? join(homedir(), ".dsh");
const CONFIG_DIR = join(DSH_HOME, "plugins");
const CONFIG_PATH = join(CONFIG_DIR, "task-notify.json");
const SOUND_DIR = join(tmpdir(), "dsh-task-notify-sound");
let WEB_URL = process.env.DSH_WEB_URL ?? "http://127.0.0.1:3080";
const DEBOUNCE_MS = 2e3;
/** HTTP 桥 JSON body 大小上限（本地接口，防止异常请求占用内存）。 */
const MAX_JSON_BODY_BYTES = 65536;
/** 会话标题过长时截断，避免卡片溢出。 */
function truncateTitle(title, max = 26) {
	return title.length > max ? `${title.slice(0, max)}…` : title;
}
/** 阻塞等待用户输入/审批的工具：出现 tool/call 即代表等待开始。 */
const BLOCKING_TOOLS = /* @__PURE__ */ new Set(["ask_user_question", "exit_plan_mode"]);
/** 从 tool/call 参数里提取可读的等待说明（问题文本 / 计划标题）。 */
function waitBody(name, argsRaw) {
	try {
		const args = argsRaw ? JSON.parse(argsRaw) : {};
		if (name === "ask_user_question") {
			const first = (Array.isArray(args.questions) ? args.questions : [])[0];
			const text = first?.header ?? first?.question;
			if (typeof text === "string" && text !== "") return truncateTitle(text, 40);
			return "智能体向你提出了一个问题，需要你回答";
		}
		if (name === "exit_plan_mode") {
			const plan = typeof args.plan === "string" ? args.plan : "";
			const match = /^#{1,6}\s+(.+?)\s*$/m.exec(plan);
			if (match?.[1] !== void 0) return `计划「${truncateTitle(match[1], 26)}」等待审批`;
			return "智能体提交了计划，等待你审批";
		}
	} catch {}
	return name === "ask_user_question" ? "智能体向你提出了一个问题，需要你回答" : "智能体提交了计划，等待你审批";
}
/** 等待输入/审批提醒：与完成通知共用通道（卡片+声音），独立防抖。 */
function createWaitNotifier() {
	let lastWaitNotifyAt = 0;
	return (title, body) => {
		if (!config.desktop && !config.sound) return;
		const now = Date.now();
		if (now - lastWaitNotifyAt < DEBOUNCE_MS) return;
		lastWaitNotifyAt = now;
		if (config.desktop) showPopup(title, body, WEB_URL, config.sound, config.soundType);
		else if (config.sound) playSoundOnly(config.soundType);
	};
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
  [int]$DurationSec, [int]$FontSize, [string]$FontFamily,
  [string]$SoundOn, [string]$SoundType, [string]$SoundPath
)
$ErrorActionPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# ── 提示音（弹窗前播放；进程在窗口存活期内保持，异步 Play 可自然播完） ──
if ($SoundOn -eq 'true') {
  if ($SoundType -eq 'system') {
    [System.Media.SystemSounds]::Asterisk.Play()
  } elseif ($SoundPath -ne '') {
    try {
      $player = New-Object System.Media.SoundPlayer $SoundPath
      $player.Play()
    } catch {}
  }
}

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
$form.Width = [Math]::Max(340, [Math]::Min(640, 44 + ([Math]::Max($Title.Length, $Text.Length) * $FontSize)))
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
$titleLabel.MaximumSize = New-Object System.Drawing.Size(($form.Width - 46), 0)
$titleLabel.Location = New-Object System.Drawing.Point(16, 10)
$titleLabel.AutoSize = $true
$form.Controls.Add($titleLabel)

$bodyLabel = New-Object System.Windows.Forms.Label
$bodyLabel.Text = $Text
$bodyLabel.ForeColor = $sub
$bodyLabel.Font = New-Object System.Drawing.Font($FontFamily, $FontSize)
$bodyLabel.MaximumSize = New-Object System.Drawing.Size(($form.Width - 48), 0)
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
`.trimStart();
function loadConfig() {
	try {
		if (!existsSync(CONFIG_PATH)) return { ...DEFAULTS };
		return sanitizeConfig(JSON.parse(readFileSync(CONFIG_PATH, "utf8")));
	} catch {
		const fallback = { ...DEFAULTS };
		try {
			saveConfig(fallback);
		} catch {}
		return fallback;
	}
}
function saveConfig(cfg) {
	const tempPath = `${CONFIG_PATH}.tmp`;
	try {
		mkdirSync(CONFIG_DIR, { recursive: true });
		writeFileSync(tempPath, JSON.stringify(cfg, null, 2), "utf8");
		renameSync(tempPath, CONFIG_PATH);
	} catch (error) {
		try {
			unlinkSync(tempPath);
		} catch {}
		console.error("[task-notify] 保存配置失败:", error);
	}
}
/** 确保提示音 WAV 已生成（首用合成缓存到临时目录，文件名含音量），返回路径；失败返回空串。 */
function ensureSoundFile(type) {
	if (type === "system") return "";
	try {
		const file = join(SOUND_DIR, `${type}-${config.volume}.wav`);
		if (!existsSync(file)) {
			mkdirSync(SOUND_DIR, { recursive: true });
			writeFileSync(file, synthSound(type, config.volume));
			for (const old of readdirSync(SOUND_DIR)) {
				if (old === `${type}-${config.volume}.wav`) continue;
				if (!old.startsWith(`${type}-`) || !old.endsWith(".wav")) continue;
				try {
					unlinkSync(join(SOUND_DIR, old));
				} catch {}
			}
		}
		return file;
	} catch {
		return "";
	}
}
/** 仅播放提示音（桌面卡片关闭但提示音开启时；fire-and-forget，PlaySync 阻塞播放完）。 */
function playSoundOnly(soundType) {
	if (process.platform !== "win32") return;
	try {
		if (soundType === "system") {
			spawnHiddenPowerShell(`[System.Media.SystemSounds]::Asterisk.Play(); Start-Sleep -Milliseconds 900`);
			return;
		}
		const soundPath = ensureSoundFile(soundType);
		if (soundPath === "") return;
		spawnHiddenPowerShell(Buffer.from(`$p = New-Object System.Media.SoundPlayer $env:DSH_TASK_NOTIFY_SOUND_PATH; $p.PlaySync()`, "utf16le").toString("base64"), { DSH_TASK_NOTIFY_SOUND_PATH: soundPath }, true);
	} catch (error) {
		console.error("[task-notify] 播放提示音失败:", error);
	}
}
/** 以隐藏窗口启动 PowerShell，返回已 unref 的 child（失败静默）。 */
function spawnHiddenPowerShell(commandOrEncoded, extraEnv = {}, encoded = false) {
	const child = spawn("powershell.exe", encoded ? [
		"-NoProfile",
		"-WindowStyle",
		"Hidden",
		"-EncodedCommand",
		commandOrEncoded
	] : [
		"-NoProfile",
		"-WindowStyle",
		"Hidden",
		"-Command",
		commandOrEncoded
	], {
		windowsHide: true,
		stdio: "ignore",
		env: {
			...process.env,
			...extraEnv
		}
	});
	child.unref();
	child.on("error", () => {});
}
/** 按当前配置弹飞书式置顶卡片（fire-and-forget，不阻塞宿主；不依赖系统通知开关）。 */
function showPopup(title, text, url = WEB_URL, soundOn = false, soundType = "apple") {
	if (process.platform !== "win32") return;
	const scriptPath = join(tmpdir(), `dsh-task-notify-popup-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.ps1`);
	const removeScript = () => {
		try {
			unlinkSync(scriptPath);
		} catch {}
	};
	try {
		writeFileSync(scriptPath, `﻿${POPUP_SCRIPT}`, "utf8");
		const child = spawn("powershell.exe", [
			"-NoProfile",
			"-WindowStyle",
			"Hidden",
			"-ExecutionPolicy",
			"Bypass",
			"-File",
			scriptPath,
			title,
			text,
			url,
			config.theme,
			config.accent,
			config.position,
			String(config.durationSec),
			String(config.fontSize),
			config.fontFamily,
			soundOn ? "true" : "false",
			soundType,
			soundOn && soundType !== "system" ? ensureSoundFile(soundType) : ""
		], {
			windowsHide: true,
			stdio: "ignore"
		});
		child.unref();
		child.on("error", () => {
			removeScript();
		});
		child.on("exit", removeScript);
	} catch (error) {
		console.error("[task-notify] 弹通知失败:", error);
		removeScript();
	}
}
function readJsonBody(req) {
	return new Promise((resolve) => {
		let data = "";
		let settled = false;
		req.on("data", (chunk) => {
			if (settled) return;
			data += chunk.toString("utf8");
			if (Buffer.byteLength(data, "utf8") > MAX_JSON_BODY_BYTES) {
				settled = true;
				req.pause();
				resolve({
					ok: false,
					status: 413,
					error: "请求体过大"
				});
			}
		});
		req.on("end", () => {
			if (settled) return;
			settled = true;
			try {
				resolve({
					ok: true,
					value: JSON.parse(data)
				});
			} catch {
				resolve({
					ok: false,
					status: 400,
					error: "请求体不是合法 JSON"
				});
			}
		});
		req.on("error", () => {
			if (settled) return;
			settled = true;
			resolve({
				ok: false,
				status: 400,
				error: "请求体读取失败"
			});
		});
	});
}
function sendJson(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
let config = loadConfig();
function apply(ctx) {
	const webServer = ctx.get("webServer");
	const sessionTitle = ctx.get("sessionTitle");
	const running = /* @__PURE__ */ new Map();
	let lastNotifyAt = 0;
	const fireWaitNotify = createWaitNotifier();
	const events = ctx;
	events.on("agent/status", (payload) => {
		const agent = payload.agent;
		const header = agent.session?.header;
		if (header?.origin === "subagent" || header?.parentSession !== void 0) return;
		const id = agent.id;
		const nowRunning = payload.status === "running";
		const was = running.get(id);
		running.set(id, nowRunning);
		if (was !== true || nowRunning) return;
		if (!config.desktop && !config.sound) return;
		const now = Date.now();
		if (now - lastNotifyAt < DEBOUNCE_MS) return;
		lastNotifyAt = now;
		const title = truncateTitle(sessionTitle?.get(agent.session)?.title ?? "DSH 会话");
		if (config.desktop) showPopup("DSH 任务完成", `「${title}」已完成`, WEB_URL, config.sound, config.soundType);
		else if (config.sound) playSoundOnly(config.soundType);
	});
	events.on("agent/disposed", (payload) => {
		running.delete(payload.agent.id);
	});
	if (process.env.DSH_WEB_URL === void 0 && webServer !== void 0 && typeof webServer.port === "number") WEB_URL = `http://127.0.0.1:${webServer.port}`;
	events.on("session/event", (session, event) => {
		if (isSubagentSession(session)) return;
		if (event?.type !== "tool/call") return;
		const name = event.data?.name;
		if (name === void 0 || !BLOCKING_TOOLS.has(name)) return;
		if (name === "ask_user_question") fireWaitNotify("需要你回答", waitBody(name, event.data?.arguments));
		else fireWaitNotify("计划等待审批", waitBody(name, event.data?.arguments));
	});
	events.on("approval/request", (req, next) => {
		if (!isSubagentSession(req.agent?.session)) fireWaitNotify("等待操作审批", "有一项操作等待你审批");
		return next();
	});
	if (webServer !== void 0) {
		ctx.effect(() => webServer.register({
			kind: "exact",
			path: "/task-notify/config",
			handler: (req, res) => {
				if (req.method === "GET") {
					sendJson(res, 200, {
						...config,
						supported: process.platform === "win32"
					});
					return;
				}
				if (req.method === "POST") {
					readJsonBody(req).then((result) => {
						if (!result.ok) {
							sendJson(res, result.status, {
								ok: false,
								error: result.error
							});
							return;
						}
						const body = result.value;
						const patch = typeof body === "object" && body !== null ? body : {};
						const keys = Object.keys(patch);
						if (keys.length === 0) {
							sendJson(res, 400, {
								ok: false,
								error: "配置项不能为空"
							});
							return;
						}
						const known = {
							desktop: true,
							theme: true,
							accent: true,
							position: true,
							durationSec: true,
							fontSize: true,
							fontFamily: true,
							sound: true,
							soundType: true,
							volume: true
						};
						for (const key of keys) if (!Object.hasOwn(known, key)) {
							sendJson(res, 400, {
								ok: false,
								error: `未知配置项: ${key}`
							});
							return;
						}
						const next = sanitizeConfig({
							...config,
							...patch
						});
						for (const key of keys) {
							const value = patch[key];
							if (!(key === "desktop" ? typeof value === "boolean" : key === "theme" ? isOneOf(value, THEMES) : key === "accent" ? isOneOf(value, ACCENTS) : key === "position" ? isOneOf(value, POSITIONS) : key === "durationSec" ? isOneOf(value, DURATIONS) : key === "fontSize" ? isOneOf(value, FONT_SIZES) : key === "fontFamily" ? isOneOf(value, FONT_FAMILIES) : key === "sound" ? typeof value === "boolean" : key === "soundType" ? isOneOf(value, SOUND_TYPES) : typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100)) {
								sendJson(res, 400, {
									ok: false,
									error: `非法值: ${key}`
								});
								return;
							}
						}
						config = next;
						saveConfig(config);
						sendJson(res, 200, {
							ok: true,
							...config
						});
					});
					return;
				}
				sendJson(res, 405, {
					ok: false,
					error: "method not allowed"
				});
			}
		}));
		ctx.effect(() => webServer.register({
			kind: "exact",
			path: "/task-notify/test",
			handler: (req, res) => {
				if (req.method !== "POST") {
					sendJson(res, 405, {
						ok: false,
						error: "method not allowed"
					});
					return;
				}
				if (process.platform !== "win32") {
					sendJson(res, 200, {
						ok: false,
						supported: false,
						error: "桌面通知仅支持 Windows"
					});
					return;
				}
				if (!config.desktop && !config.sound) {
					sendJson(res, 200, {
						ok: false,
						supported: true,
						error: "桌面通知与提示音都已关闭"
					});
					return;
				}
				if (config.desktop) showPopup("任务完成通知（测试）", "桌面通知通道工作正常 ✓", WEB_URL, config.sound, config.soundType);
				else if (config.sound) playSoundOnly(config.soundType);
				sendJson(res, 200, {
					ok: true,
					supported: true,
					channels: {
						desktop: config.desktop,
						sound: config.sound
					}
				});
			}
		}));
	}
}
//#endregion
export { apply, inject, name };
