/**
 * dsh-plugin-workspace-files — Client 半。
 *
 * F1 @ 文件引用（官方 input-trigger 管线 source）
 * F2 修改文件点击 → 右侧预览抽屉（文档级点击拦截 + shell.overlay 自绘抽屉）
 * F3 右上角项目文件夹按钮 + 浏览抽屉（header utilities + shell.overlay）
 * 另含设置页（settings.section）与 zh/en 文案。
 * 所有副作用挂在 ctx.effect；不 shadow 官方槽位。
 */

import { DICTS, NS, setTranslator, t } from './client/locales'
import { bindBrowserServices, FolderBrowser } from './client/browser'
import { bindHeaderServices, HeaderFolderButton } from './client/header'
import { createFileSource } from './client/mention'
import { bindPreviewServices, installClickInterceptor, PreviewDrawer } from './client/preview'
import { SettingsSection } from './client/settings'
import { injectStyles } from './client/styles'
import type {
  InputTriggersFace,
  LocaleFace,
  SessionsFace,
  SlotsFace,
  WorkspacesFace,
} from './client/types'

export const inject = ['slots', 'sessions', 'inputTriggers', 'locale']

export function apply(ctx: {
  get(name: string): unknown
  effect(fn: () => unknown, label?: string): void
}): void {
  injectStyles()

  const slots = ctx.get('slots') as SlotsFace | undefined
  const sessions = ctx.get('sessions') as SessionsFace | undefined
  const inputTriggers = ctx.get('inputTriggers') as InputTriggersFace | undefined
  const locale = ctx.get('locale') as LocaleFace | undefined
  const workspaces = ctx.get('workspaces') as WorkspacesFace | undefined

  bindPreviewServices(sessions, workspaces)
  bindBrowserServices(sessions, workspaces)
  bindHeaderServices(sessions)

  if (locale !== undefined) {
    const translate = locale.bind(NS)
    setTranslator((key, params) => (params !== undefined ? translate(key, params) : translate(key)))
    ctx.effect(() => locale.register(NS, DICTS), 'workspace-files: dictionaries')
  }

  if (inputTriggers !== undefined && sessions !== undefined) {
    ctx.effect(() => createFileSource(sessions, inputTriggers), 'workspace-files: @ source')
  }

  ctx.effect(() => installClickInterceptor(), 'workspace-files: click interceptor')

  if (slots === undefined) return

  ctx.effect(
    () =>
      slots.inject('shell.overlay', () =>
        slots.register({ name: 'shell.overlay', id: 'workspace-files-preview', order: 60 }, PreviewDrawer),
      ),
    'workspace-files: preview overlay',
  )
  ctx.effect(
    () =>
      slots.inject('shell.overlay', () =>
        slots.register({ name: 'shell.overlay', id: 'workspace-files-browser', order: 70 }, FolderBrowser),
      ),
    'workspace-files: browser overlay',
  )
  ctx.effect(
    () =>
      slots.inject('conversation.session.header.utilities', () =>
        slots.register(
          { name: 'conversation.session.header.utilities', id: 'workspace-files-folder', order: 100 },
          HeaderFolderButton,
        ),
      ),
    'workspace-files: header button',
  )
  ctx.effect(
    () =>
      slots.inject('settings.section', () =>
        slots.register(
          { name: 'settings.section', id: 'workspace-files', order: 30, label: () => t('settings.title') },
          SettingsSection,
        ),
      ),
    'workspace-files: settings section',
  )
}
