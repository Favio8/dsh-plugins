# dsh-plugin

DeepSeek Harness（DSH）个人插件合集仓库：**每个插件一个独立文件夹**，全部为可持久挂载的**源码插件**（source plugin），区别于会话内临时创建的动态插件。

## 仓库结构

```
dsh-plugin/
├── AGENTS.md                 # 仓库级开发约束（必读）：命名/结构/挂载/规范
├── README.md                 # 本文件：仓库说明与插件清单
├── .gitignore
└── dsh-plugin-<name>/        # 每个插件一个独立文件夹（自带 package.json / src / lib / README）
```

## 插件清单

| 文件夹 | 包名 | 状态 | 说明 |
| --- | --- | --- | --- |
| `dsh-plugin-task-notify` | dsh-plugin-task-notify | ✅ 已挂载生效 | 任务完成通知：飞书式置顶卡片（主题/强调色/位置/时长/字体可配）+ 应用内 toast + 完整设置页 |

## 开发一个插件

1. **读 `AGENTS.md`**——所有约定（插件结构、构建方式、挂载步骤、开发规范）都在里面。
2. 参考 `dsh-plugin-task-notify/` 作为模板（`package.json` 的 `dsh.client` / `dsh.bundle` 字段、`tsdown.config.ts` 双入口构建、`src/` 结构、`lib/` 产物提交）。
3. 每个插件文件夹必须有自己的 `README.md`（用途/特性/挂载步骤/配置项）。

## 挂载到 DSH（web profile）

```bash
dsh plugin --profile web add "link:<插件文件夹绝对路径>"
```

> 新增插件后需重启 `dsh web` 进程生效；已挂载插件的 `lib/client.js` 内容变化可通过 HMR 热更新（`pnpm build` 后刷新页面）。

## 仓库约定速览

- 一插件一文件夹，包名 `dsh-plugin-<name>`，互不依赖（确需共享用 `@deepseek-ai/*` 官方包）。
- 构建产物 `lib/` 必须提交（link: 挂载直接指向源码目录）。
- 所有副作用（监听/定时器/槽位）挂插件生命周期；UI 走 Slots 槽位；宿主↔客户端通信走本机 HTTP 桥。
