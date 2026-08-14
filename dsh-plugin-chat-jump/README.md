# dsh-plugin-chat-jump

DeepSeek Harness **对话快速跳转**插件：对话流**左侧圆点导航条**（类 Codex）——每个圆点对应一条用户消息，点击平滑滚动直达，滚动时自动高亮当前所在位置，悬停显示消息预览。

## 特性

- **圆点导航**：对话区左缘竖排圆点，一消息一点（≥2 条用户消息时显示，避免噪音）；**每个圆点跟随对应消息的垂直位置**——滚动时圆点随消息在轨道上滑动，消息滚出视口时钳制在轨道两端并弱化显示（时间轴式）；
- **点击直达**：平滑滚动把该条用户消息定位到视口上部（滚动偏移 120px）；
- **scroll-spy**：滚动对话时自动高亮「当前」圆点（距视口顶部 120px 内判定）；
- **悬停预览**：tooltip 显示该条消息前 40 字符；
- **零 shadow**：不替换任何官方渲染——纯 DOM 观察 + `shell.overlay` 自绘浮层，基于官方稳定属性（`data-conversation-scroll`、`data-chat-flow-kind="user"`、`data-chat-flow-key`）；
- 深/浅主题自适应（全部 `--dsw-alias-*` token）；新消息/切换会话自动跟随（MutationObserver）。

## 挂载步骤

```bash
# 1. 构建（修改 src/ 后必须重跑并提交 lib/）
cd dsh-plugin-chat-jump
pnpm install
pnpm run typecheck && pnpm run build

# 2. 挂载（自动装依赖并并入 bundles 层）
dsh plugin --profile web add "link:<本插件文件夹绝对路径>"

# 3. 重启 dsh web 进程（新增插件必须重启生效）
powershell -ExecutionPolicy Bypass -File ..\relaunch-web.ps1
```

## 架构

- **Host 半**（`src/index.ts`）：占位空插件（组合行需要，功能全在 Client）。
- **Client 半**（`src/client.ts`）：`ChatJumpRail` 组件注册于 `shell.overlay`（id `chat-jump-rail`）；
  - 根级 MutationObserver 跟踪 `[data-conversation-scroll]` 出现/消失（切换会话自动重挂）；
  - 容器级 MutationObserver 跟踪消息增删（新消息自动加点）；
  - 滚动 `scroll`（passive）+ 窗口 `resize` → rAF 节流刷新圆点与位置；
  - 点击 → 手动计算 `scrollTo({ behavior: 'smooth' })`（不受页面其他滚动影响）。

## 升级回归点（官方变更时检查）

- 滚动容器选择器 `[data-conversation-scroll]`；
- 用户消息节点 `[data-chat-flow-kind="user"]`（ChatNodeKind 中的 `user`）；
- 消息 key 属性 `data-chat-flow-key`。
  任一失效时圆点不出现（不崩溃），README 记录回归即可。

## 开发

```bash
pnpm run typecheck   # tsc --noEmit
pnpm run build       # tsdown 双入口：lib/index.mjs (Host 占位) + lib/client.js (Client loader 外壳)
```

提交规范遵循仓库 [AGENTS.md](../AGENTS.md) §7（`emoji 类型: 英文描述`）。
