import * as React from 'react'
import { getConfig, setConfig, subscribeConfig } from './config'
import { t } from './locales'
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
  errorNotify: boolean
  supported?: boolean
}

const themeOptions = (): { value: string; label: string }[] => [
  { value: 'dark', label: t('options.theme.dark') },
  { value: 'light', label: t('options.theme.light') },
]

const ACCENT_COLORS: Record<string, string> = {
  green: '#57B478',
  blue: '#4A90D9',
  orange: '#E8A13D',
  purple: '#9B6FE8',
}

const positionOptions = (): { value: string; label: string }[] => [
  { value: 'br', label: t('options.position.br') },
  { value: 'bl', label: t('options.position.bl') },
  { value: 'tr', label: t('options.position.tr') },
  { value: 'tl', label: t('options.position.tl') },
]

const durationOptions = (): { value: number; label: string }[] => [
  { value: 4, label: t('options.duration.4') },
  { value: 6, label: t('options.duration.6') },
  { value: 8, label: t('options.duration.8') },
  { value: 10, label: t('options.duration.10') },
]

const fontSizeOptions = (): { value: number; label: string }[] => [
  { value: 11, label: t('options.fontSize.11') },
  { value: 12, label: t('options.fontSize.12') },
  { value: 13, label: t('options.fontSize.13') },
  { value: 14, label: t('options.fontSize.14') },
]

const fontOptions = (): { value: string; label: string }[] => [
  { value: 'Microsoft YaHei UI', label: t('options.font.yahei') },
  { value: 'Segoe UI', label: t('options.font.default') },
  { value: 'SimSun', label: t('options.font.simsun') },
  { value: 'SimHei', label: t('options.font.simhei') },
  { value: 'KaiTi', label: t('options.font.kaiti') },
]

const soundTypeOptions = (): { value: string; label: string }[] => [
  { value: 'apple', label: t('options.sound.apple') },
  { value: 'ding', label: t('options.sound.ding') },
  { value: 'double', label: t('options.sound.double') },
  { value: 'system', label: t('options.sound.system') },
]

async function fetchHostConfig(): Promise<HostConfig | null> {
  try {
    const res = await fetch('/task-notify/config')
    if (!res.ok) return null
    const body = (await res.json()) as HostConfig & { ok?: boolean; error?: string }
    if (body.ok === false) return null
    return body
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
    if (!res.ok) return null
    const body = (await res.json()) as HostConfig & { ok?: boolean; error?: string }
    if (body.ok === false) return null
    return body
  } catch {
    return null
  }
}

/** 加载宿主配置到组件状态（卸载安全），并返回打补丁函数（失败回滚，乱序响应丢弃）。 */
function useHostConfig(): [HostConfig | null, (patch: Partial<HostConfig>) => void] {
  const [host, setHost] = React.useState<HostConfig | null>(null)
  const latestSeq = React.useRef(0)
  const lastGood = React.useRef<HostConfig | null>(null)
  React.useEffect(() => {
    let cancelled = false
    void fetchHostConfig().then((h) => {
      if (cancelled || h === null) return
      lastGood.current = h
      setHost(h)
    })
    return () => {
      cancelled = true
    }
  }, [])
  const patch = React.useCallback((p: Partial<HostConfig>) => {
    setHost((prev) => {
      if (prev === null) return prev
      lastGood.current = prev
      return { ...prev, ...p }
    })
    const seq = ++latestSeq.current
    void patchHostConfig(p).then((h) => {
      if (seq !== latestSeq.current) return
      if (h === null) {
        setHost(lastGood.current)
      } else {
        lastGood.current = h
        setHost(h)
      }
    })
  }, [])
  return [host, patch]
}

/** 按当前开关触发测试（桌面卡片 + 应用内 toast）。 */
function fireTest(host: HostConfig | null, toastOn: boolean): void {
  if (toastOn) {
    pushToast({ title: t('settings.testToastTitle'), body: t('settings.testToastBody') })
  }
  if (host?.desktop === true || host?.sound === true) {
    void fetch('/task-notify/test', { method: 'POST' }).catch(() => {
      /* 静默：宿主侧不可达时仅 toast 生效 */
    })
  }
}

/** 音量滑杆：拖动只改本地值，停顿 250ms 或失焦后再写宿主，避免拖动期间刷请求。 */
function VolumeSlider(props: {
  value: number
  disabled?: boolean
  onChange: (value: number) => void
}): React.ReactElement {
  const [draft, setDraft] = React.useState(props.value)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  React.useEffect(() => {
    setDraft(props.value)
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
  }, [props.value])
  React.useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current)
  }, [])
  const commit = (value: number): void => {
    setDraft(value)
    if (timer.current !== null) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      timer.current = null
      props.onChange(value)
    }, 250)
  }
  return React.createElement(
    'div',
    { className: 'tn-volume' },
    React.createElement('input', {
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
      value: draft,
      disabled: props.disabled,
      className: 'tn-range',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => commit(Number(e.target.value)),
      onBlur: () => {
        if (timer.current !== null) {
          clearTimeout(timer.current)
          timer.current = null
        }
        props.onChange(draft)
      },
    }),
    React.createElement('span', { className: 'tn-volume-value' }, `${draft}%`),
  )
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
      React.createElement('span', { className: 'tn-row-title' }, t('settings.title')),
      React.createElement(
        'button',
        { type: 'button', className: 'tn-btn', onClick: () => fireTest(host, cfg.toast) },
        t('settings.test'),
      ),
    ),
    React.createElement(
      'div',
      { className: 'tn-field' },
      React.createElement(
        'div',
        { className: 'tn-field-label' },
        React.createElement('span', null, t('field.desktop')),
        React.createElement('span', { className: 'tn-field-sub' }, t('field.desktopSub')),
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
        React.createElement('span', null, t('field.toast')),
        React.createElement('span', { className: 'tn-field-sub' }, t('field.toastSub')),
      ),
      React.createElement(Toggle, { checked: cfg.toast, onChange: (v) => setConfig({ toast: v }) }),
    ),
    React.createElement(
      'div',
      { className: 'tn-field' },
      React.createElement(
        'div',
        { className: 'tn-field-label' },
        React.createElement('span', null, t('field.sound')),
        React.createElement('span', { className: 'tn-field-sub' }, t('field.soundSub')),
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
      React.createElement(
        'div',
        { className: 'tn-field-label' },
        React.createElement('span', null, t('field.error')),
        React.createElement('span', { className: 'tn-field-sub' }, t('field.errorSub')),
      ),
      React.createElement(Toggle, {
        checked: host?.errorNotify === true,
        onChange: (v) => patchHost({ errorNotify: v }),
        disabled: host === null,
      }),
    ),
    React.createElement('div', { className: 'tn-row-foot' }, t('row.foot')),
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
  const hint = host === null ? t('settings.connecting') : supported ? null : t('settings.windowsOnly')

  return React.createElement(
    'div',
    { className: 'tn-page' },
    React.createElement('div', { className: 'tn-page-title' }, t('settings.title')),
    React.createElement(
      'div',
      { className: 'tn-page-desc' },
      t('page.desc'),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, t('card.channels')),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, t('field.desktop')),
          React.createElement('span', { className: 'tn-field-sub' }, t('field.desktopSub')),
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
          React.createElement('span', null, t('field.toast')),
          React.createElement('span', { className: 'tn-field-sub' }, t('field.toastSub')),
        ),
        React.createElement(Toggle, { checked: cfg.toast, onChange: (v) => setConfig({ toast: v }) }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, t('field.error')),
          React.createElement('span', { className: 'tn-field-sub' }, t('field.errorSub')),
        ),
        React.createElement(Toggle, {
          checked: host?.errorNotify === true,
          onChange: (v) => patchHost({ errorNotify: v }),
          disabled: host === null,
        }),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, t('card.style')),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, t('field.theme')),
        React.createElement(Segmented, {
          value: host?.theme ?? 'dark',
          options: themeOptions(),
          onChange: (v) => patchHost({ theme: String(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, t('field.accent')),
        React.createElement(Swatches, {
          value: host?.accent ?? 'green',
          onChange: (v) => patchHost({ accent: v }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, t('field.position')),
        React.createElement(Segmented, {
          value: host?.position ?? 'br',
          options: positionOptions(),
          onChange: (v) => patchHost({ position: String(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, t('field.duration')),
        React.createElement(Segmented, {
          value: host?.durationSec ?? 6,
          options: durationOptions(),
          onChange: (v) => patchHost({ durationSec: Number(v) }),
          disabled: host === null,
        }),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, t('card.font')),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, t('field.fontSize')),
        React.createElement(Segmented, {
          value: host?.fontSize ?? 12,
          options: fontSizeOptions(),
          onChange: (v) => patchHost({ fontSize: Number(v) }),
          disabled: host === null,
        }),
      ),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement('div', { className: 'tn-field-label' }, t('field.fontFamily')),
        React.createElement(
          'select',
          {
            className: 'tn-select',
            value: host?.fontFamily ?? 'Microsoft YaHei UI',
            disabled: host === null,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => patchHost({ fontFamily: e.target.value }),
          },
          fontOptions().map((f) => React.createElement('option', { key: f.value, value: f.value }, f.label)),
        ),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-card' },
      React.createElement('div', { className: 'tn-card-title' }, t('card.sound')),
      React.createElement(
        'div',
        { className: 'tn-field' },
        React.createElement(
          'div',
          { className: 'tn-field-label' },
          React.createElement('span', null, t('field.soundEnable')),
          React.createElement('span', { className: 'tn-field-sub' }, t('field.soundEnableSub')),
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
        React.createElement('div', { className: 'tn-field-label' }, t('field.soundType')),
        React.createElement(Segmented, {
          value: host?.soundType ?? 'apple',
          options: soundTypeOptions(),
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
          React.createElement('span', null, t('field.volume')),
          host?.soundType === 'system'
            ? React.createElement('span', { className: 'tn-field-sub' }, t('field.volumeFixedSub'))
            : null,
        ),
        React.createElement(VolumeSlider, {
          value: host?.volume ?? 80,
          disabled: host === null || host?.soundType === 'system',
          onChange: (v) => patchHost({ volume: v }),
        }),
      ),
    ),

    React.createElement(
      'div',
      { className: 'tn-page-actions' },
      React.createElement(
        'button',
        { type: 'button', className: 'tn-btn tn-btn-primary', onClick: () => fireTest(host, cfg.toast) },
        t('settings.testButton'),
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
