/**
 * 设置页（settings.section「工作区文件」）。
 * 客户端偏好走 localStorage；安全参数（预览上限、越界开关）经 Host 桥持久化。
 */

import * as React from 'react'
import { getHostConfig, patchHostConfig, type HostConfig } from './bridge'
import { t } from './locales'
import { prefsStore, setPrefs, useStore } from './store'

const MAX_PREVIEW_OPTIONS = [
  { value: 256 * 1024, label: '256 KB' },
  { value: 512 * 1024, label: '512 KB' },
  { value: 1024 * 1024, label: '1 MB' },
  { value: 2 * 1024 * 1024, label: '2 MB' },
  { value: 5 * 1024 * 1024, label: '5 MB' },
]

const IMAGE_MAX_OPTIONS = [
  { value: 512 * 1024, label: '512 KB' },
  { value: 1024 * 1024, label: '1 MB' },
  { value: 2 * 1024 * 1024, label: '2 MB' },
  { value: 5 * 1024 * 1024, label: '5 MB' },
  { value: 10 * 1024 * 1024, label: '10 MB' },
]

const RECENT_OPTIONS = [1, 3, 5, 8, 10]

export function SettingsSection(): React.ReactElement {
  const prefs = useStore(prefsStore)
  const [host, setHost] = React.useState<HostConfig | null>(null)
  const latestSeq = React.useRef(0)
  const lastGood = React.useRef<HostConfig | null>(null)

  React.useEffect(() => {
    let cancelled = false
    void getHostConfig().then((h) => {
      if (cancelled || h === null) return
      lastGood.current = h
      setHost(h)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const patchHost = (p: Partial<HostConfig>): void => {
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
  }

  return React.createElement(
    'div',
    { className: 'wf-page' },
    React.createElement('div', { className: 'wf-page-title' }, t('settings.title')),
    React.createElement('div', { className: 'wf-page-desc' }, t('settings.desc')),

    React.createElement(
      'div',
      { className: 'wf-card' },
      field(
        t('settings.intercept'),
        t('settings.interceptSub'),
        React.createElement(Toggle, {
          checked: prefs.intercept,
          onChange: (v) => setPrefs({ intercept: v }),
        }),
      ),
      field(
        t('settings.showHidden'),
        t('settings.showHiddenSub'),
        React.createElement(Toggle, {
          checked: prefs.showHidden,
          onChange: (v) => setPrefs({ showHidden: v }),
        }),
      ),
      field(
        t('settings.recentCount'),
        t('settings.recentCountSub'),
        React.createElement(
          'select',
          {
            className: 'wf-select',
            value: prefs.recentCount,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setPrefs({ recentCount: Number(e.target.value) }),
          },
          RECENT_OPTIONS.map((n) => React.createElement('option', { key: n, value: n }, String(n))),
        ),
      ),
      field(
        t('settings.ignore'),
        t('settings.ignoreSub'),
        React.createElement('input', {
          className: 'wf-input',
          type: 'text',
          value: prefs.ignore,
          placeholder: 'node_modules,.git',
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPrefs({ ignore: e.target.value }),
        }),
      ),
    ),

    React.createElement(
      'div',
      { className: 'wf-card' },
      field(
        t('settings.maxPreview'),
        t('settings.maxPreviewSub'),
        React.createElement(
          'select',
          {
            className: 'wf-select',
            value: host?.maxPreviewBytes ?? 512 * 1024,
            disabled: host === null,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => patchHost({ maxPreviewBytes: Number(e.target.value) }),
          },
          MAX_PREVIEW_OPTIONS.map((o) => React.createElement('option', { key: o.value, value: o.value }, o.label)),
        ),
      ),
      field(
        t('settings.imageMax'),
        t('settings.imageMaxSub'),
        React.createElement(
          'select',
          {
            className: 'wf-select',
            value: host?.imageMaxBytes ?? 2 * 1024 * 1024,
            disabled: host === null,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => patchHost({ imageMaxBytes: Number(e.target.value) }),
          },
          IMAGE_MAX_OPTIONS.map((o) => React.createElement('option', { key: o.value, value: o.value }, o.label)),
        ),
      ),
      field(
        t('settings.outside'),
        t('settings.outsideSub'),
        React.createElement(Toggle, {
          checked: host?.allowOutsideCwd === true,
          onChange: (v) => patchHost({ allowOutsideCwd: v }),
          disabled: host === null,
        }),
      ),
      host === null ? React.createElement('span', { className: 'wf-hint' }, t('settings.hostHint')) : null,
    ),
  )
}

function field(label: string, sub: string, control: React.ReactNode): React.ReactElement {
  return React.createElement(
    'div',
    { className: 'wf-field' },
    React.createElement(
      'div',
      { className: 'wf-field-label' },
      React.createElement('span', null, label),
      React.createElement('span', { className: 'wf-field-sub' }, sub),
    ),
    control,
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
      className: props.checked ? 'wf-toggle wf-toggle-on' : 'wf-toggle',
      onClick: () => props.onChange(!props.checked),
    },
    React.createElement('span', { className: 'wf-toggle-knob' }),
  )
}
