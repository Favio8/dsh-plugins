import * as React from 'react'
import { getConfig, setConfig, subscribeConfig } from './config'
import { pushToast } from './toasts'

/** 宿主侧配置（~/.dsh/plugins/task-notify.json），经 /task-notify/* HTTP 桥读写。 */
interface HostConfig {
  desktop: boolean
  theme: string
  accent: string
  position: string
  durationSec: number
  fontSize: number
  fontFamily: string
  sound: boolean
  soundType: string
  volume: number
  supported?: boolean
}

const THEME_OPTIONS = [
  { value: 'dark', label: '深色' },
  { value: 'light', label: '浅色' },
]

const ACCENT_COLORS: Record<string, string> = {
  green: '#57B478',
  blue: '#4A90D9',
  orange: '#E8A13D',
  purple: '#9B6FE8',
}

const POSITION_OPTIONS = [
  { value: 'br', label: '右下' },
  { value: 'bl', label: '左下' },
  { value: 'tr', label: '右上' },
  { value: 'tl', label: '左上' },
]

const DURATION_OPTIONS = [
  { value: 4, label: '4 秒' },
  { value: 6, label: '6 秒' },
  { value: 8, label: '8 秒' },
  { value: 10, label: '10 秒' },
]

const FONT_SIZE_OPTIONS = [
  { value: 11, label: '小' },
  { value: 12, label: '标准' },
  { value: 13, label: '大' },
  { value: 14, label: '特大' },
]

const FONT_OPTIONS = [
  { value: 'Microsoft YaHei UI', label: '微软雅黑' },
  { value: 'Segoe UI', label: '系统默认' },
  { value: 'SimSun', label: '宋体' },
  { value: 'SimHei', label: '黑体' },
  { value: 'KaiTi', label: '楷体' },
]

const SOUND_TYPE_OPTIONS = [
  { value: 'apple', label: '苹果三全音' },
  { value: 'ding', label: '叮' },
  { value: 'double', label: '双响' },
  { value: 'system', label: '系统提示音' },
]

async function fetchHostConfig(): Promise<HostConfig | null> {
  try {
    const res = await fetch('/task-notify/config')
    return (await res.json()) as HostConfig
  } catch {
    return null
  }
}

async function patchHostConfig(patch: Partial<HostConfig>): Promise<HostConfig | null> {
  try {
    const res = await fetch('/task-notify/config', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    })
    return (await res.json()) as HostConfig
  } catch {
    return null
  }
}

/** 加载宿主配置到组件状态（卸载安全），并返回打补丁函数。 */
function useHostConfig(): [HostConfig | null, (patch: Partial<HostConfig>) => void] {
  const [host, setHost] = React.useState<HostConfig | null>(null)
  React.useEffect(() => {
    let cancelled = false
    void fetchHostConfig().then((h) => {
      if (!cancelled) setHost(h)
    })
    return () => {
      cancelled = true
    }
  }, [])
  const patch = React.useCallback((p: Partial<HostConfig>) => {
    setHost((prev) => (prev === null ? prev : { ...prev, ...p }))
    void patchHostConfig(p).then((h) => {
      if (h !== null) setHost(h)
    })
  }, [])
  return [host, patch]
}

/** 按当前开关触发测试（桌面卡片 + 应用内 toast）。 */
function fireTest(host: HostConfig | null, toastOn: boolean): void {
  if (toastOn) {
    pushToast({ title: '这是一条测试通知', body: '任务完成通知（测试）' })
  }
  if (host?.desktop === true) {
    void fetch('/task-notify/test', { method: 'POST' }).catch(() => {
      /* 静默：宿主侧不可达时仅 toast 生效 */
    })
  }
}

/**
 * settings.general.item 设置行（重做版）：紧凑卡片，快速开关 + 测试。
 * 完整样式选项在设置页「任务完成通知」。
 */
export function TaskNotifySettings(): React.ReactElement {
  const [, force] = React.useState(0)
  React.useEffect(() => subscribeConfig(() => force((n) => n + 1)), [])
  const cfg = getConfig()
  const [host, patchHost] = useHostConfig()

  return React.createElement(
    'div',
    { className: 'tn-row' },
    React.createElement(
      'div',
      { className: 'tn-row-head' },
      React.createElement('span', { className: 'tn-row-title' }, '任务完成通知'),
      React.createElement(
        'button',
        { type: 'button', className: 'tn-btn', onClick: () => fireTest(host, cfg.toast) },
        '测试',
      ),
    ),
    React.createElement(
      'div',
      { className: 'tn-field' },
      React.createElement(
        'div',
        { className: 'tn-field-label' },
        React.createElement('span', null, '桌面通知'),
        React.createElement('span', { className: 'tn-field-sub' }, '独立于浏览器，页面关闭也能收到'),
      ),
      React.createElement(Toggle, {
        checked: host?.desktop === true,
        onChange: (v) => patchHost({ desktop: v }),
        disabled: host === null,
      }),
    ),
    React.createElement(
      'div',
      { className: 'tn-field' },
      React.createElement(
        'div',
        { className: 'tn-field-label' },
        React.createElement('span', null, '应用内提示'),
        React.createElement('span', { className: 'tn-field-sub' }, '页面右下角 toast'),
      ),
      React.createElement(Toggle, { checked: cfg.toast, onChange: (v) => setConfig({ toast: v }) }),
    ),
    React.createElement(
      'div',
      { className: 'tn-field' },
      React.createElement(
        'div',
        { className: 'tn-field-label' },
        React.createElement('span', null, '提示音'),
        React.createElement('span', { className: 'tn-field-sub' }, '任务完成时播放'),
      ),
      React.createElement(Toggle, {
        checked: host?.sound === true,
        onChange: (v) => patchHost({ sound: v }),
        disabled: host === null,
      }),
    ),
    React.createElement('div', { className: 'tn-row-foot' }, '卡片样式、字体与音色在设置页「任务完成通知」中调整'),
  )
}

/**
 * settings.section 设置页「任务完成通知」：完整配置（通道 + 卡片样式 + 字体）+ 测试预览。
 */
export function TaskNotifySection(_props: { close: () => void }): React.ReactElement {
  const [, force] = React.useState(0)
  React.useEffect(() => subscribeConfig(() => force((n) => n + 1)), [])
  const cfg = getConfig()
  const [host, patchHost] = useHostConfig()

  const supported = host?.supported !== false
  const hint = host === null ? '正在连接…' : supported ? null : '桌面通知仅支持 Windows'

  return React.createElement(
    'div',
    { className: 'tn-page' },
    React.createElement('div', { className: 'tn-page-title' }, '任务完成通知'),
    React.createElement(
      'div',
      { className: 'tn-page-desc' },
      '会话一轮任务结束时提醒你；桌面卡片为自绘置顶窗口，不依赖系统通知开关。',
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, '通知通道'),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, '桌面通知'),
          React.createElement('span', { className: 'tn-field-sub' }, '独立于浏览器，页面关闭也能收到'),
        ),
        React.createElement(Toggle, {
          checked: host?.desktop === true,
          onChange: (v) => patchHost({ desktop: v }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, '应用内提示'),
          React.createElement('span', { className: 'tn-field-sub' }, '页面右下角 toast'),
        ),
        React.createElement(Toggle, { checked: cfg.toast, onChange: (v) => setConfig({ toast: v }) }),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, '卡片样式'),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '主题'),
        React.createElement(Segmented, {
          value: host?.theme ?? 'dark',
          options: THEME_OPTIONS,
          onChange: (v) => patchHost({ theme: String(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '强调色'),
        React.createElement(Swatches, {
          value: host?.accent ?? 'green',
          onChange: (v) => patchHost({ accent: v }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '位置'),
        React.createElement(Segmented, {
          value: host?.position ?? 'br',
          options: POSITION_OPTIONS,
          onChange: (v) => patchHost({ position: String(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '显示时长'),
        React.createElement(Segmented, {
          value: host?.durationSec ?? 6,
          options: DURATION_OPTIONS,
          onChange: (v) => patchHost({ durationSec: Number(v) }),
          disabled: host === null,
        }),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, '字体'),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '字号'),
        React.createElement(Segmented, {
          value: host?.fontSize ?? 12,
          options: FONT_SIZE_OPTIONS,
          onChange: (v) => patchHost({ fontSize: Number(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '字体'),
        React.createElement(
          'select',
          {
            className: 'tn-select',
            value: host?.fontFamily ?? 'Microsoft YaHei UI',
            disabled: host === null,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => patchHost({ fontFamily: e.target.value }),
          },
          FONT_OPTIONS.map((f) => React.createElement('option', { key: f.value, value: f.value }, f.label)),
        ),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, '提示音'),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, '开启提示音'),
          React.createElement('span', { className: 'tn-field-sub' }, '任务完成时播放，独立于浏览器'),
        ),
        React.createElement(Toggle, {
          checked: host?.sound === true,
          onChange: (v) => patchHost({ sound: v }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, '提示音'),
        React.createElement(Segmented, {
          value: host?.soundType ?? 'apple',
          options: SOUND_TYPE_OPTIONS,
          onChange: (v) => patchHost({ soundType: String(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, '音量'),
          host?.soundType === 'system'
            ? React.createElement('span', { className: 'tn-field-sub' }, '系统提示音不支持调节')
            : null,
        ),
        React.createElement(
          'div',
          { className: 'tn-volume' },
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: 100,
            step: 5,
            value: host?.volume ?? 80,
            disabled: host === null || host?.soundType === 'system',
            className: 'tn-range',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => patchHost({ volume: Number(e.target.value) }),
          }),
          React.createElement('span', { className: 'tn-volume-value' }, `${host?.volume ?? 80}%`),
        ),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-page-actions' },
      React.createElement(
        'button',
        { type: 'button', className: 'tn-btn tn-btn-primary', onClick: () => fireTest(host, cfg.toast) },
        '测试通知',
      ),
      hint !== null ? React.createElement('span', { className: 'tn-settings-hint' }, hint) : null,
    ),
  )
}

function Toggle(props: {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}): React.ReactElement {
  return React.createElement(
    'button',
    {
      type: 'button',
      role: 'switch',
      'aria-checked': props.checked,
      disabled: props.disabled === true,
      className: props.checked ? 'tn-toggle tn-toggle-on' : 'tn-toggle',
      onClick: () => props.onChange(!props.checked),
    },
    React.createElement('span', { className: 'tn-toggle-knob' }),
  )
}

function Segmented(props: {
  value: string | number
  options: { value: string | number; label: string }[]
  onChange: (value: string | number) => void
  disabled?: boolean
}): React.ReactElement {
  return React.createElement(
    'div',
    { className: 'tn-seg' },
    props.options.map((o) =>
      React.createElement(
        'button',
        {
          key: String(o.value),
          type: 'button',
          disabled: props.disabled === true,
          className: o.value === props.value ? 'tn-seg-item tn-seg-active' : 'tn-seg-item',
          onClick: () => props.onChange(o.value),
        },
        o.label,
      ),
    ),
  )
}

function Swatches(props: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}): React.ReactElement {
  return React.createElement(
    'div',
    { className: 'tn-swatches' },
    Object.entries(ACCENT_COLORS).map(([key, color]) =>
      React.createElement('button', {
        key,
        type: 'button',
        title: key,
        disabled: props.disabled === true,
        className: key === props.value ? 'tn-swatch tn-swatch-active' : 'tn-swatch',
        style: { background: color },
        onClick: () => props.onChange(key),
      }),
    ),
  )
}
