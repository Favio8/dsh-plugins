# DSH Plugins

[English](README_en.md) | [中文](README.md)

A personal collection of plugins for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — **one folder per plugin**, all of them persistent **source plugins**.

Making DSH better: currently ships **task completion notifications** — Feishu-style desktop popup cards (independent of Windows notification settings, so they appear even when the page is closed) plus in-app toasts.

## Plugin List

| Plugin | Description | Status |
| --- | --- | --- |
| [dsh-plugin-task-notify](./dsh-plugin-task-notify) | Task completion notifications: Feishu-style desktop cards (theme / accent / position / duration / font configurable) + in-app toasts + full settings page | ✅ Live |
| [dsh-plugin-deepeye](https://github.com/Favio8/dsh-plugin-deepeye) | DeepEye: vision capabilities (image description / OCR / visual QA / layout analysis / clipboard) — **separate repo** | Separate repo |

## Features

- **One plugin per folder** — each plugin is an independent npm package (`dsh-plugin-<name>`) with no cross-dependencies; build, mount, and remove them independently
- **Persistent mounting** — source plugins stay active across restarts via `dsh plugin` (unlike ephemeral in-session dynamic plugins)
- **Native integration** — plugs directly into DSH's host composition and client slots, no middleware overhead
- **Unified development conventions** — [AGENTS.md](./AGENTS.md) defines the plugin structure, build, mounting, and development rules every plugin follows

## Install (Mounting a Plugin into DSH)

```bash
# Local development: mount from the plugin source folder
dsh plugin --profile web add "link:<absolute path to plugin folder>"

# Example
dsh plugin --profile web add "link:D:/AAA_Favio_2026/AI_exploring/deepseek-ai/dsh-plugin/dsh-plugin-task-notify"
```

When installing, dsh will:

1. Link the plugin into the profile directory with pnpm
2. Automatically append it to `dsh.profile.bundles` because the plugin declares `dsh.bundle`

> Adding a **new** plugin requires restarting the `dsh web` process. Changes to an already-mounted plugin's `lib/client.js` hot-reload via HMR (`pnpm build`, then refresh the page).

## Adding a New Plugin

1. Read [AGENTS.md](./AGENTS.md) — all conventions (structure, build, mounting, rules) live there
2. Use [dsh-plugin-task-notify](./dsh-plugin-task-notify) as the template: the `dsh.client` / `dsh.bundle` fields in `package.json`, the dual-entry `tsdown.config.ts` build, `src/` (host half + client half), and committed `lib/` output
3. Every plugin folder ships its own `README.md` (purpose / features / mounting / configuration)

## Development

Every plugin is an independent npm package; run inside the plugin folder:

```bash
cd dsh-plugin-<name>
pnpm install
pnpm run typecheck
pnpm run build
```

## Repository Layout

```
dsh-plugins/
├── AGENTS.md                 # Repo-wide development conventions (read first)
├── README.md                 # This file
└── dsh-plugin-<name>/        # One folder per plugin
    ├── package.json          # dsh.client / dsh.bundle declarations
    ├── tsdown.config.ts      # host + client dual-entry build
    ├── src/                  # TypeScript source (host half + client half)
    ├── lib/                  # Build output (must be committed; link: mounts point at it)
    └── README.md             # Plugin's own README
```

## Related Repositories

- [dsh-plugin-deepeye](https://github.com/Favio8/dsh-plugin-deepeye) — DeepEye: a standalone DeepSeek Harness native vision plugin repository

## License

MIT
