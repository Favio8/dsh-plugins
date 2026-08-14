/**
 * F3：会话头部右端「📁 项目名」按钮（conversation.session.header.utilities）。
 * 点击打开文件夹浏览抽屉，根 = 当前会话 cwd；无 cwd 时置灰。
 */

import * as React from 'react'
import { t } from './locales'
import { basenameOf } from './paths'
import { browserStore, openBrowser, useStore } from './store'
import type { SessionsFace } from './types'

let sessionsSvc: SessionsFace | undefined

export function bindHeaderServices(sessions: SessionsFace | undefined): void {
  sessionsSvc = sessions
}

/** props.sessionId 由槽位 owner 注入（官方 header utilities 同款）。 */
export function HeaderFolderButton(props: { sessionId?: string }): React.ReactElement {
  const [, force] = React.useState(0)
  React.useEffect(() => {
    if (sessionsSvc === undefined) return undefined
    return sessionsSvc.list.subscribe(() => force((n) => n + 1))
  }, [])
  const browser = useStore(browserStore)

  const snap = sessionsSvc?.list.getSnapshot()
  const sessionId = props.sessionId ?? snap?.current
  const cwd = sessionId !== undefined ? snap?.byId[sessionId]?.cwd : undefined
  const name = cwd !== undefined && cwd !== '' ? basenameOf(cwd) : ''
  const open = browser.open

  return React.createElement(
    'button',
    {
      type: 'button',
      className: 'wf-folder-btn',
      title:
        cwd !== undefined && cwd !== ''
          ? t('browser.folderTooltip', { path: cwd })
          : t('browser.noCwd'),
      disabled: cwd === undefined || cwd === '',
      'aria-pressed': open,
      onClick: () => {
        if (cwd !== undefined && cwd !== '') openBrowser(cwd)
      },
    },
    React.createElement('span', null, '📁'),
    React.createElement('span', { className: 'wf-folder-btn-name' }, name !== '' ? name : '…'),
  )
}
