# dsh-plugin 仓库约束（AGENTS.md）

本仓库是 DeepSeek Harness（DSH）的个人插件集合：**每个插件一个独立文件夹**，全部为可持久挂载的**源码插件**（source plugin），区别于本会话 `cordis_define` 创建的临时动态插件。

本文档是仓库级约束，任何在本仓库内新增、修改、维护插件的 agent/开发者都必须遵守。每个插件文件夹内还必须有自己的 `README.md`（用途、特性、挂载步骤、配置项）。

---

## 1. 目录与命名

- 一个插件一个文件夹，文件夹名与 npm 包名一致：`dsh-plugin-<name>`（全小写、连字符）。例如 `dsh-plugin-task-notify`。
- 仓库根目录只放仓库级文件（`AGENTS.md`、`README.md`、`.gitignore` 等），不放插件代码。
- 插件与插件之间**不允许相互依赖**；确需共享能力时用 `peerDependencies` 指向 `@deepseek-ai/*` 官方包，而不是另一个本地插件。

## 2. 插件形态与结构（样板：`dsh-plugin-deepeye`）

源码插件 = 独立 npm 包文件夹。关键结构：

```
dsh-plugin-<name>/
  package.json          # 必填
  cordis.patch.yml      # 可选：插件行的配置覆盖（dsh.bundle.patch 指向它）
  src/                  # TypeScript 源码（host 半 + client 半）
  lib/                  # tsdown 构建产物，必须提交（link: 挂载直接指向源码目录）
  tsdown.config.ts      # 构建配置
  README.md             # 必填：用途 / 特性 / 挂载步骤 / 配置
```

`package.json` 关键字段约定：

- `"type": "module"`，`"main"` → `lib/index.mjs`（Host 半入口）。
- `exports` 必须导出 `"."` 与 `"./client"`（`./client` → `lib/client.js`，浏览器端入口）以及 `"./package.json"`。
- `"dsh": { "client": { "platform": "web", "inject": [ ... ] } }` —— 声明这是 web 平台的客户端 bundle，`inject` 列出需要的客户端 bundle（如 `@deepseek-ai/dsh-client-runtime`）。
- `"dsh": { "bundle": { "patch": "./cordis.patch.yml" } }` —— 可选，插件自带配置覆盖。
- `peerDependencies` 至少含 `@deepseek-ai/cordis`；用到的 `@deepseek-ai/*` 包一并声明。
- 构建脚本：`"build": "tsdown"`。**修改源码后必须重新构建并提交 `lib/`。**

## 3. 挂载到部署（web profile）

参照已在用的 `dsh-plugin-deepeye`（`~/.dsh/profiles/web/`）。推荐用官方命令（自动装依赖并并入 bundles 层）：

```bash
dsh plugin --profile web add "link:<本插件文件夹的绝对路径>"
```

或手动三步：

1. 编辑 `~/.dsh/profiles/web/package.json`：
   - `dependencies` 添加：`"dsh-plugin-<name>": "link:<本插件文件夹的绝对路径>"`
   - `dsh.profile.bundles` 数组追加：`"dsh-plugin-<name>"`
2. 在 profile 目录执行 `pnpm install`。
3. 重启/重建 DSH web（Host 半在进程内加载；Client 半需要 web bundle 重建）。

> 注意：`cordis.yml` 是合成产物，**不要直接编辑**；配置覆盖写进 `cordis.patch.yml`（profile 层或插件自带的 patch 层）。
> 注意：**新增插件必须重启 dsh web 进程才生效**（`client-modules` 按包缓存，插件集合变更只在重启时重新扫描；已挂载插件的 `lib/client.js` 内容变化可通过 HMR 轮询热更新）。

## 4. 开发约束

### 通用

- 动手写代码前，先用 Inspect 目录（`Service` / `Event` / `Builtin` / `Slots` / `Theme` / `Tool`）确认目标接口的确切签名，不要凭名字猜 API。
- 所有副作用（事件监听、定时器、订阅、槽位、主题覆盖）必须挂在插件的生命周期上：`ctx.on()`、`ctx.effect()`，或保留返回的 disposer。停止/更新/卸载时必须全部清理。
- 不序列化 live data：Service 实例、Session、Slot props、事件负载等内部对象只读取所需叶子字段，不整对象 dump。
- **不改部署自带的 shipped preset 安装**，不动 DSH 的 checkout 目录。

### Host 半（Node 进程）

- 普通 Cordis 插件形态：`{ name, inject, Config, apply(ctx, config) }`（见 deepeye 的 `src/index.ts`）。
- 服务获取：硬依赖用 `inject`，可选依赖用 `ctx.get(name)` 判空。
- 工具注册用 `@deepseek-ai/dsh-tools` 的 `defineTool` + `ctx.tools.register`；模型可见性用 `systemPrompt.section` 声明。

### Client 半（浏览器模块）

- 是浏览器 bundle（`window.__ModuleLoader__.load` 体系），**浏览器 API 可用**（`Notification`、`Audio`/WebAudio、`localStorage`、`document` 等），这与动态插件受限沙箱不同。
- **bundle 必须是加载器包装格式**：`window.__ModuleLoader__.load({ id: <包名>, factory: (require) => { ...CJS...; return module.exports } })`——classic script 注册 CJS 风格 factory，依赖（react 等）经注入的 `require` 解析（平台 seed 提供）。**不能是普通 ESM 裸 import 文件**（加载器会报 "loaded without registering"）。构建方式见 `dsh-plugin-task-notify/tsdown.config.ts`（tsdown format cjs + banner/footer 包外壳 + `deps.neverBundle`）。
- 但 **UI 一律走 Slots 槽位**：先查 `Slots` 目录再注册；设置项用 `settings.general.item`（单行、纯自绘）或 `settings.section`（整页）；全局浮层/toast 用 `shell.overlay`（加性注册，自备 id）。
- 会话状态订阅：`ctx.sessions.list`（可订阅快照存储，`subscribe` + `getSnapshot`），会话行含 `running` / `completed` 字段。
- 状态持久化：源码插件可用 `localStorage`（区别于临时动态插件，无需加持久化限制）。
- **客户端↔宿主通信**：可用 `webServer.register({ kind: 'exact', path, handler })` 注册本机 HTTP 桥（绑定 127.0.0.1），客户端 `fetch` 同源调用——宿主开关/测试类功能走这条路（见 `dsh-plugin-task-notify` 的 `/task-notify/*`）。
- React 代码用 `React.createElement`，不使用 JSX（构建产物保持纯 JS 可加载）。

## 5. 变更流程

1. 在对应插件文件夹内修改 `src/`。
2. `pnpm typecheck && pnpm build`，确认 `lib/` 产物已更新。
3. 更新插件 `README.md`（新增特性、配置项变化）。
4. 挂载/热更新部署；验证后提交。

## 6. 当前插件清单

| 文件夹 | 包名 | 状态 | 说明 |
| --- | --- | --- | --- |
| `dsh-plugin-task-notify` | dsh-plugin-task-notify | 已挂载生效（web profile） | 任务完成通知（飞书式置顶卡片，不依赖系统通知 / 应用内 toast） |
| `dsh-plugin-workspace-files` | dsh-plugin-workspace-files | 已挂载生效（web profile） | 工作区文件体验（`@` 引用文件 + 修改文件点击预览 + 右上角项目文件夹浏览） |
| `dsh-plugin-chat-jump` | dsh-plugin-chat-jump | 已挂载生效（web profile） | 对话快速跳转（对话流左侧圆点导航，类 Codex，点击直达各条用户消息） |

## 7. 提交规范（用户全局约定）

用户所有项目的 commit 风格统一为：**`emoji 类型: 英文描述`**（语言为英文，如 `✨ feat: add task completion notifications`）。

常用类型参考（gitmoji 风格）：

| emoji | 类型 | 场景 |
| --- | --- | --- |
| ✨ | feat | 新功能 |
| 🐛 | fix | 修复缺陷 |
| 📝 | docs | 文档 |
| ♻️ | refactor | 重构（无行为变化） |
| 💄 | style | UI/样式 |
| ⚡ | perf | 性能优化 |
| ✅ | test | 测试 |
| 🔧 | chore | 构建/配置/杂项 |
| 🌱 | init | 初始化 |
