# DSH Plugins

[中文](README.md) | [English](README_en.md)

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 开发的**个人插件合集**：每个插件一个独立文件夹，全部为可持久挂载的**源码插件**（source plugin）。

让 DSH 更好用：当前包含**任务完成通知**——飞书式桌面置顶卡片（不依赖 Windows 通知设置，页面关闭也能收到）+ 应用内 toast。

## 插件清单

| 插件 | 说明 | 状态 |
| --- | --- | --- |
| [dsh-plugin-task-notify](./dsh-plugin-task-notify) | 任务完成通知：飞书式置顶卡片（主题/强调色/位置/时长/字体可配）+ 应用内 toast + 完整设置页 | ✅ 已挂载生效 |
| [dsh-plugin-workspace-files](./dsh-plugin-workspace-files) | 工作区文件体验：输入框 `@` 引用文件（最近引用/层级导航）+ 修改文件点击侧边栏预览 + 右上角项目文件夹浏览 | ✅ 已挂载生效 |
| [dsh-plugin-chat-jump](./dsh-plugin-chat-jump) | 对话快速跳转：对话流左侧圆点导航（类 Codex），点击直达各条用户消息 + scroll-spy 高亮 | ✅ 已挂载生效 |
| [dsh-plugin-deepeye](https://github.com/Favio8/dsh-plugin-deepeye) | DeepEye：视觉能力（图片描述 / OCR / 视觉问答 / 布局分析 / 剪贴板），**独立仓库** | 独立仓库 |

## 特性

- **一插件一文件夹** — 每个插件是独立 npm 包（`dsh-plugin-<name>`），互不依赖，可独立构建、挂载、移除
- **可持久挂载** — 源码插件经 `dsh plugin` 挂载后重启依然生效（区别于会话内临时动态插件）
- **原生集成** — 直接注册进 DSH 的 host 组合与客户端槽位，无中间层开销
- **统一开发规范** — [AGENTS.md](./AGENTS.md) 定义插件结构、构建方式、挂载步骤与开发约束，所有插件遵循同一套约定

## 安装（挂载插件到 DSH）

```bash
# 本地开发：从插件源码目录挂载
dsh plugin --profile web add "link:<插件文件夹绝对路径>"

# 示例
dsh plugin --profile web add "link:D:/AAA_Favio_2026/AI_exploring/deepseek-ai/dsh-plugin/dsh-plugin-task-notify"
```

安装时 dsh 会：

1. 用 pnpm 把插件链接进 profile 目录
2. 因插件声明了 `dsh.bundle`，自动追加到 `dsh.profile.bundles` 层叠

> 新增插件后需**重启 `dsh web` 进程**生效；已挂载插件的 `lib/client.js` 内容变化可经 HMR 热更新（`pnpm build` 后刷新页面）。

## 新增一个插件

1. 读 [AGENTS.md](./AGENTS.md)——所有约定（结构、构建、挂载、规范）都在里面
2. 以 [dsh-plugin-task-notify](./dsh-plugin-task-notify) 为模板：`package.json` 的 `dsh.client` / `dsh.bundle` 字段、`tsdown.config.ts` 双入口构建、`src/`（host 半 + client 半）、`lib/` 产物提交
3. 每个插件文件夹自带 `README.md`（用途 / 特性 / 挂载 / 配置）

## 开发

每个插件都是独立 npm 包，在对应插件文件夹内：

```bash
cd dsh-plugin-<name>
pnpm install
pnpm run typecheck
pnpm run build
```

## 仓库结构

```
dsh-plugins/
├── AGENTS.md                 # 仓库级开发约束（必读）
├── README.md                 # 本文件
└── dsh-plugin-<name>/        # 每个插件一个独立文件夹
    ├── package.json          # dsh.client / dsh.bundle 声明
    ├── tsdown.config.ts      # host + client 双入口构建
    ├── src/                  # TypeScript 源码（host 半 + client 半）
    ├── lib/                  # 构建产物（必须提交；link: 挂载直接指向源码目录）
    └── README.md             # 插件自述
```

## 相关仓库

- [dsh-plugin-deepeye](https://github.com/Favio8/dsh-plugin-deepeye) — DeepEye：为 DSH 提供视觉能力的独立插件仓库（DeepSeek Harness 原生视觉插件）

## License

MIT
