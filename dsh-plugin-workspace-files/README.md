# dsh-plugin-workspace-files

DeepSeek Harness **工作区文件体验**插件：把「文件」的引用、预览、浏览补齐到 Codex / Claude Code 同等水平。

## 特性

| 功能 | 说明 |
| --- | --- |
| **`@` 引用文件** | 输入框输入 `@` 弹出文件菜单：**最近引用置顶** + 当前目录文件/目录 + **斜杠层级导航**（`@src/components/` 直达子目录）；选中后插入真正的 **文件 chip**（浅蓝色，完整显示 `@文件名`，整体删除/复制），提交时序列化为 `@相对路径` 随消息发送，agent 可直接 `read` |
| **修改文件点击预览** | 会话「产物」chips / 散文文件提及 / 工具卡片中的文件路径，点击即在**右侧预览抽屉**查看内容（行号 + 极简高亮 + **Markdown 渲染**（`渲染/原文` 可切换）+ 图片直显 + 超长「加载更多」+ 复制路径 + 在系统中打开），不再跳系统资源管理器 |
| **右上角项目文件夹** | 会话头部右端「📁 项目名」按钮 → **面包屑 + 目录列表**浏览（根 = 当前会话 cwd，切换会话自动重根），文件点击直达预览 |

**设计原则**：全部复用官方机制——`@` 走官方 input-trigger 管线（菜单/键盘/IME 官方自带）、产物 chips 只拦截点击不替换渲染、预览/浏览用 `shell.overlay` 自绘右侧抽屉（不占用官方 `conversation.details.tool`），**零 shadow 官方 UI**。深/浅主题、中英文案随官方切换。

## 挂载步骤

```bash
# 1. 构建（修改 src/ 后必须重跑并提交 lib/）
cd dsh-plugin-workspace-files
pnpm install
pnpm run typecheck && pnpm run build

# 2. 挂载（自动装依赖并并入 bundles 层）
dsh plugin --profile web add "link:<本插件文件夹绝对路径>"

# 3. 重启 dsh web 进程（新插件必须重启生效；仓库根有 relaunch-web.ps1 可一键重启并校验）
powershell -ExecutionPolicy Bypass -File ..\relaunch-web.ps1
```

> 已挂载插件的 `lib/client.js` 内容变化可经 HMR 热更新（`pnpm build` 后刷新页面）；**新增插件必须重启**。

## 配置

设置页（设置 → 工作区文件）：

| 配置项 | 存储 | 说明 |
| --- | --- | --- |
| 点击文件打开预览 | localStorage | 总开关；关闭后点击恢复系统打开 |
| 显示隐藏文件 | localStorage | 文件夹浏览中显示点开头条目 |
| 忽略规则 | localStorage | 逗号分隔；与内置 `node_modules,.git,dist,build,out,.next` 合并 |
| 最近引用条数 | localStorage | `@` 菜单置顶数量（1–10） |
| 预览大小上限 | Host `~/.dsh/plugins/workspace-files.json` | 文本单次读取上限（服务端强制，64KB–8MB） |
| 图片预览上限 | Host 同上 | 图片超过该大小不返回 dataURL（服务端强制，64KB–16MB） |
| 允许浏览工作区之外 | Host 同上 | 默认关；开启后读取边界放宽到主目录（工作区根目录始终可用） |

## 架构与安全

- **Host 半**（`src/index.ts`）：只读 HTTP 桥，绑定 127.0.0.1：
  - `GET /workspace-files/list?root=&path=&hidden=` 列一层（文件+目录，200 上限）
  - `GET /workspace-files/read?root=&path=&offset=&limit=` 读片段 / 图片 dataURL / 二进制判定
  - `GET|POST /workspace-files/config` 安全配置持久化
  - **root guard**：`root` 必须是当前 Host 已注册会话的 cwd（客户端不能自选根目录）；路径 `resolve` + `realpath` 后必须位于边界内（`allowOutsideCwd` 开启后额外允许主目录），大小写/符号链接 cwd 均已归一化，符号链接逃逸拒绝
- **Client 半**（`src/client.ts`）：`@` source（`mention.ts`，insert-type 文件 chip + `codec` 序列化为 `@<path>`）、预览抽屉 + 点击拦截（`preview.ts`）、文件夹浏览（`browser.ts`）、头部按钮（`header.ts`）、设置页（`settings.ts`）；模块级 store（`store.ts`）只存叶子值，不持有 live 数据；所有副作用挂 `ctx.effect`。
- 依赖注入：`inject: ['slots','sessions','inputTriggers','locale']`；`workspaces` 可选（无则隐藏「在系统中打开」）。

## 升级回归点（官方变更时检查）

- 产物 chips 的 DOM：`[data-produced-files-row] button[title]`（选择器失效则回退为系统打开，不崩溃）；
- input-trigger 管线契约：`InputTriggerSource`（`types.ts` 局部镜像，官方变更时同步）；
- 头部 utilities 槽位 props：`sessionId` 注入方式。

## 开发

```bash
pnpm run typecheck   # tsc --noEmit
pnpm run build       # tsdown 双入口：lib/index.mjs (Host) + lib/client.js (Client loader 外壳)
pnpm run smoke       # node scripts/smoke-client.mjs：模拟加载器验证 client bundle
```

提交规范遵循仓库 [AGENTS.md](../AGENTS.md) §7（`emoji 类型: 英文描述`）。
