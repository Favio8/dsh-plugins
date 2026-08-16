# dsh-plugin-task-notify

DeepSeek Harness 任务完成通知插件：**会话的一轮任务结束时提醒你**。

DSH 是 Web UI，任务跑完没有提醒——切到别的窗口等结果时容易错过。本插件提供**飞书式桌面通知**：DSH 宿主进程（Node 常驻进程）监听任务状态，任务完成时弹出**自定义置顶卡片**（无边框窗口，**不经过 Windows 通知管道，系统通知总开关关闭时依然显示**），**与浏览器页面是否打开无关**；页面内另有应用内 toast。

## 特性

- **桌面通知（飞书式置顶卡片）**：由宿主进程触发（PowerShell + WinForms 无边框置顶窗口），点击卡片打开 DSH，右上角 × 可关闭。**不依赖 Windows 通知设置**（这是与系统 Toast/气泡的关键区别，与飞书/微信桌面端同款做法）。默认开启。
- **卡片样式可配置**（设置页）：主题（深/浅）、强调色（绿/蓝/橙/紫）、位置（四角）、显示时长（4/6/8/10 秒）、字号（小/标准/大/特大）、字体（微软雅黑/系统默认/宋体/黑体/楷体）。配置持久化在 `~/.dsh/plugins/task-notify.json`。
- **提示音可配置**（设置页）：开关 + 音色（苹果三全音/叮/双响/系统提示音）+ **音量滑杆（0-100，拖动结束才写宿主）**。宿主合成 WAV（无需音频资产），页面关闭也能响；同一音色只保留最新音量档的 WAV 缓存。
- **等待输入/审批提醒**：计划模式下 agent 提问（`ask_user_question`）或提交计划等审批（`exit_plan_mode`）时，也会弹卡片+提示音+toast（这类等待期间 agent 状态保持 running，完成通知不会触发，本插件单独检测 `tool/call` 与 `approval/request`）。
- **应用内 toast**：右下角浮层提示（`shell.overlay` 槽位），6 秒自动消失，可手动关闭，点击跳转对应会话。
- **完成检测（双通道）**：
  - Host 半监听 `agent/status`（running→idle = 一轮任务完成），2 秒防抖。
  - Client 半订阅 `sessions.list` 快照做页面内提示。
- **过滤子代理**：子代理会话不提醒，避免噪声。
- **设置行 + 设置页**：设置页 → General 一节新增"任务完成通知"快速行（桌面/应用内/提示音开关 + 测试）；设置导航新增完整页面「任务完成通知」，含通道开关、卡片样式、字体、提示音与音量配置及测试预览。

## 架构

```
src/
  index.ts            # Host 半：agent/status 完成检测 → 飞书式置顶卡片 + HTTP 桥
  client.ts           # Client 半入口：inject + apply（订阅、toast、注册槽位）
  client/
    types.ts          # sessions/slots 服务的最小结构视图
    config.ts         # 客户端配置（localStorage：toast 开关）
    watcher.ts        # running→idle 完成检测（客户端视角）
    toasts.ts         # toast store + shell.overlay 堆栈组件
    settings.ts       # settings.general.item 设置行（经 HTTP 桥控制宿主）
    styles.ts         # 样式注入（主题变量）
```

**Host 半**（`src/index.ts`）：
- `ctx.on('agent/status')` 监听 running→idle，过滤子代理，取会话标题，弹飞书式置顶卡片（内嵌 PowerShell WinForms 脚本，fire-and-forget）。
- 注册三个 HTTP 桥（绑定 127.0.0.1，仅本机可访问）：
  - `GET  /task-notify/config` — 读完整通知配置
  - `POST /task-notify/config` — 写配置项（`{ "desktop": boolean, ... }`）
  - `POST /task-notify/test` — 立即弹测试卡片

> 点击桌面卡片默认打开 `http://127.0.0.1:3080`；如 DSH 端口不同，可设置环境变量 `DSH_WEB_URL` 覆盖。

**Client 半**：订阅 `sessions.list` 完成翻转 → 应用内 toast；设置行通过 `fetch` 调 HTTP 桥控制宿主开关。客户端不再使用浏览器 Notification API（系统级通知统一由宿主负责）。

## 构建

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # tsdown → lib/index.mjs + lib/client.js
pnpm smoke       # node scripts/smoke-client.mjs：模拟加载器验证 client bundle
```

产物 `lib/` 需提交（link: 挂载直接指向源码目录）。

> Client 半的构建特殊性：DSH 客户端模块加载器要求 bundle 是
> `window.__ModuleLoader__.load({ id, factory })` 包装格式（classic script，
> CJS 风格 factory，react 经注入的 require 解析）。`tsdown.config.ts` 用
> format cjs + banner/footer 包外壳实现；不要改成普通 ESM 裸 import 输出。

## 挂载到 DSH（web profile）

参照仓库 `AGENTS.md`。推荐官方命令（自动装依赖 + 并入 bundles 层）：

```bash
dsh plugin --profile web add "link:<本插件文件夹绝对路径>"
```

或手动：编辑 `~/.dsh/profiles/web/package.json` 加
`"dsh-plugin-task-notify": "link:<绝对路径>"` 并追加到 `dsh.profile.bundles`，
然后 `pnpm install`。

**Host 半变更必须重启 dsh web 进程才生效**（client-modules 插件集合变更只在
重启时重新扫描）；重启后刷新页面：设置 → General 出现"任务完成通知"行。

## 使用

1. 打开 设置 → General → "任务完成通知"：
   - **桌面通知**默认开启（飞书式置顶卡片，独立于浏览器与系统通知开关）。
   - 点"测试"：桌面开则弹置顶卡片、提示音开则播放声音、应用内开则出 toast；三条通道任意一条开启即可测试。
2. 正常对话：每轮任务完成，桌面卡片 + 页面 toast；点击卡片/toast 打开 DSH/对应会话。

## 已知限制

- 桌面通知**仅支持 Windows**（PowerShell + WinForms 置顶卡片）；其他平台暂只有应用内 toast。
- 置顶卡片是自绘窗口（非系统通知），不会进入 Windows 通知中心历史；样式可在设置页配置（深/浅主题、强调色、位置、字体等）。
- 只报"完成"，不报"出错"（`agent/error` 监听可作后续增强）。
- 连续多轮快速完成有 2 秒防抖合并；toast 栈最多保留 4 条，自动消失。

## 路线图

- [ ] 出错提醒（宿主监听 `agent/error` → 桌面通知 + 页面红标）
- [ ] 后台任务/工作流/子代理完成提醒
- [ ] 长任务完成后再提醒（防打扰）
- [ ] 非 Windows 桌面通知（macOS `osascript` / Linux `notify-send`）
- [ ] i18n（接入 `ctx.locale` 字典）
