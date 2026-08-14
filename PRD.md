# PRD：工作区文件体验插件 `dsh-plugin-workspace-files`

> 状态：**v1.1 定稿待评审**（决策已按「最大程度方便用户体验」收敛，含 UI 交互与设计章节）
> 目标仓库：`dsh-plugin`（DeepSeek Harness 个人插件合集）
> 前置必读：[AGENTS.md](./AGENTS.md)（仓库级开发约束，实现阶段必须遵守）

---

## 1. 背景与痛点

当前 DeepSeek Harness Web 对话框中，与代码/文件相关的三个高频诉求缺失（对比 Codex / Claude Code）：

| # | 痛点 | 现状 |
| --- | --- | --- |
| P1 | 输入框里**不能自由 `@` 引用文件** | 输入框只有纯文本；`@` 已被子代理引用占用（`ui-subagent`），文件引用无入口 |
| P2 | 会话展示的**修改文件不能点击预览** | 每次对话后 turn 尾部会呈现「产物」文件 chips（`dsh-client-ui-deliverables`），但点击只调用 `workspaces.openPath()` 打开**系统资源管理器/默认应用**，无法在 Web 侧边栏直接预览内容 |
| P3 | **右上角没有项目文件夹入口** | 会话头部右端没有任何项目/工作区文件夹浏览入口，无法在页面内查看项目文件树 |

目标：一个源码插件，同时解决 P1/P2/P3，把「工作区文件」体验补齐到 Codex / Claude Code 同等水平，**且全程复用官方交互习惯、零学习成本**。

---

## 2. 目标与非目标

### 2.1 目标

1. **F1 — `@` 文件引用**：输入 `@` 弹出文件候选菜单，含「最近引用」置顶 + 当前目录文件 + **斜杠层级导航**（`@src/components/` 直接进入子目录），选中即写入草稿、随普通 prompt 发给 agent。
2. **F2 — 修改文件点击预览**：产物 chips / 散文文件 mention / tool 卡片路径，点击即在**右侧预览抽屉**显示文件内容（行号、极简高亮、图片直显、超长「加载更多」），并提供「复制路径」「在系统中打开」。
3. **F3 — 右上角项目文件夹**：会话头部右端「📁 项目名」按钮 → 打开项目文件浏览面板：**面包屑 + 可展开目录树**、隐藏文件开关、点击文件直达预览。

**UX 总目标**：所见即所得、三步之内到达（点击 → 预览 → 可复制/可在系统打开）；不改变既有操作习惯，所有新增均为官方交互模式的**自然延伸**。

### 2.2 非目标（v1 明确不做）

- 不做上传/写入文件（只读预览与引用，文件修改仍由 agent 工具完成）。
- 不做 `@` 全仓库模糊深搜（v1 为目录层级 + 前缀过滤；fzf 式深搜列入 v2）。
- 不做代码语义高亮 / LSP / diff 可视化（v1 为行号 + 极简关键字高亮；Markdown 渲染列入 v1.1）。
- 不 shadow 官方 UI 槽位（见 §6.4 兼容性原则）。
- 不做拖拽文件到输入框（v2 候选）。

---

## 3. 现状调研（已确认的 DSH 能力，实现依据）

以下均来自对本部署 `node_modules/@deepseek-ai/*` 源码与 Client Inspect 目录的核实：

| 能力 | 确认结果 | 对本插件的意义 |
| --- | --- | --- |
| **输入触发管线** `dsh-client-ui-input-trigger` | `ctx.inputTriggers.registerSource(InputTriggerSource)`；已内置 `@` 与 `/` 的光标处检测（词边界 + guard tier）、分组候选菜单（渲染于 `conversation.input.overlay`）、combobox 键盘交互、pick 三条路径（menu / space / enter）。`ui-subagent` 已用 `{ trigger: '@', name: 'subagent', ... }` 注册 `@` 子代理 source（**现成模板**） | **F1 直接注册一个 `@` file source 即可**，菜单/键盘/IME 全部复用，无需自绘 |
| **pick 结果形式** | `PickOutcome` 含 `{ text: string }`（token span 替换为字面文本，随普通 prompt 发送）与 `{ insert: ReferenceInsert }`（占位符 + codec 序列化）。`lexicon`/`subscribeLexicon` 负责草稿中已引用 token 的 chip 装饰 | **F1 用 `text` 臂**（与 `@subagent` 一致），agent 在 prompt 里直接看到路径文本；lexicon 提供草稿 chip 装饰 |
| **产物文件呈现** `dsh-client-ui-deliverables` | turn 尾部「产物」chips（`conversation.chat.turnTail` 槽，`data-produced-files-row` 行内 `<button title=path>`）；散文文件 mention（`chatFileMentions`）。点击均走 `openFile(path)` → `workspaces.openPath(resolveWorkspacePath(cwd, path))` → **打开系统应用** | **F2 在 document 捕获阶段拦截这些点击**（`stopPropagation`），改为打开 Web 预览抽屉；不 shadow 官方渲染 |
| **目录列出** `ctx.workspaces.listDirectory(path)` | 走 Host `browse` 能力，返回 `DirectoryListing`（`path/home/crumbs/entries/truncated`），**只列子目录、不列文件** | 列文件与读内容**必须走 Host 桥**（见 §6.2） |
| **右侧详情栏** | `layout.openDetails()/closeDetails()` 可开关右侧栏；其 body 槽 `conversation.details.tool` 为 **single 座、已被官方 x6 占用**（replaceRisk: shadows-shipped-ui） | **F2/F3 预览面板不自注册该槽**，用 `shell.overlay` 自绘右侧抽屉，视觉等同侧边栏且零 shadow |
| **会话工作目录** | `sessions.list.getSnapshot().byId[sessionId]?.cwd`（官方 `openFile` 同款取法） | F1/F3 的「项目文件夹」= 当前会话 cwd |
| **会话头部右端** | `conversation.session.header.utilities`（右对齐 utilities 列表，session 作用域） | **F3 按钮注册于此** |
| **Host HTTP 桥** | `webServer.register({ kind: 'exact', path, handler })`（绑定 127.0.0.1）；客户端**同源相对 `fetch`**（`dsh-plugin-task-notify` 的 `/task-notify/*` 即此模板） | Host 桥读取文件列表/内容的标准通道 |
| **会话快照订阅** | `ctx.sessions.list`（`subscribe` + `getSnapshot`，行含 `cwd` 等） | F1 lexicon 失效、F3 根目录随会话切换刷新 |
| **设置页** | `settings.section`（整页）与 `settings.general.item`（单行）均为加性列表槽 | 插件配置页走 `settings.section`（官方「任务完成通知」同款） |

### 3.1 职责边界：官方基础 vs 本插件新增（已核实为「官方已运行」）

> **结论先行**：§3 列出的官方能力**当前部署均已默认启用、正在运行**（live Slots 已核实：`conversation.input.overlay` 的 `slash-menu`、`conversation.chat.turnTail` 的产物渲染器均处于 active 状态），**不存在「需要开启」的开关**。这些能力属于 DSH 基础 bundle，**不并入本插件**——本插件是它们的**消费方/扩展方**：只调用官方公共 API 注册/拦截/叠加，从不复制或替换官方实现（否则违反「零 shadow」原则并造成双份冲突）。

| 能力 | 归属 | 本插件的处理 |
| --- | --- | --- |
| `@`/`/` 触发检测、候选菜单、键盘导航、IME 保护（`dsh-client-ui-input-trigger`） | 官方（已运行） | **注册** `@` file source（`ctx.inputTriggers.registerSource`），菜单自动新增「文件」分组 |
| 「产物」文件 chips 渲染（`dsh-client-ui-deliverables`） | 官方（已运行） | **点击拦截**（文档级捕获 + `stopPropagation`）换成 Web 预览；渲染不动 |
| `@subagent` 子代理引用 | 官方（已运行） | 与插件 source **并存**，官方菜单自动按分组展示 |
| 右侧详情栏（`details`/`conversation.details.tool`） | 官方（已运行） | **借用** `shell.overlay` 自绘右侧抽屉；不注册/不占用该槽 |
| workspaces / sessions / layout / locale / webServer 等服务 | 官方（已运行） | **消费**公共接口（`sessions.list` 取 cwd、`layout.openDetails` 可选联动等） |
| **文件列表 + 文件内容读取（含增量/图片）** | 官方**没有** | **本插件新建**：Host 桥 `/workspace-files/list`、`/read` |
| 预览抽屉、文件夹浏览、设置页、最近引用、层级导航 | 官方没有 | **本插件新建**（UI 走 `shell.overlay`、`conversation.session.header.utilities`、`settings.section`） |

**唯一需要「开启」的是插件本身**：挂载（`dsh plugin --profile web add "link:<路径>"`）+ 重启 dsh web 进程后生效——这是所有源码插件共有的步骤，与官方能力无关。

---

## 4. 功能需求（含 UX 决策）

### F1 — 输入框 `@` 引用文件

**触发与菜单内容**
- 在 composer 输入 `@` 触发候选菜单（管线自带词边界与 guard，输入法合成期间不误触）。
- 菜单分组：`文件` 组（`name: 'file'`，与 `@subagent` 组并存，`order` 置前）。组内按如下优先级排列：
  1. **最近引用**（本会话最近 @ 过 / 本轮产物文件，≤5 条，带「最近」分隔标题）——最常复用的文件一步直达；
  2. 当前目录下的 **目录**（带 `📁` 图标，可回车进入）与**文件**（带类型图标）；
- **斜杠层级导航（核心便利点）**：查询含 `/` 时按目录前缀进入子层级。例：`@src/components/` → 列出 `src/components` 下的条目；`@src/` + 继续输入 `ind` → 过滤 `src` 下以 `ind` 开头的文件。路径解析受 root guard 约束（不可跳出 cwd）。
- 前缀过滤：对当前层级的 basename 做不区分大小写前缀匹配；空查询显示整层。
- 候选上限 200 条，超出标记「已截断」。

**选中结果**
- `PickOutcome = { text: '<相对路径> ' }`：token span 替换为相对路径文本并随普通 prompt 发送；agent 直接 `read`。
- 选中后立即把该路径加入本会话「最近引用」。
- 草稿中已引用路径由 `lexicon` 装饰为 chip（管线自带）；`subscribeLexicon` 在会话列表 / 目录变更时刷新。

**边界**
- 默认忽略 `node_modules`、`.git`、`dist`、`build`、`out`、`.next`、隐藏文件（可在设置页调整）。
- 目录也可被引用（插入目录路径，语义交由 agent）。

### F2 — 修改文件点击 → 侧边栏预览

**点击拦截（零 shadow）**
- 文档级捕获阶段监听 click，命中以下元素时 `stopPropagation()` + 打开预览抽屉（**不再触发系统应用**）：
  1. 产物 chips：`[data-produced-files-row] button[title]`（title 即路径）；
  2. 散文文件 mention：官方生成的、`title` 为工作区路径的可点元素；
  3. tool 卡片内的文件路径元素（`write`/`edit`/`read` 卡片的 `title`/文本命中 cwd 下路径）；
  4. F3 文件夹面板与 F1 菜单之外的所有可解析路径元素（兜底）。
- 路径解析：优先 `title`；相对路径基于会话 cwd 解析（复用官方 `resolveWorkspacePath` 语义）。

**预览抽屉（右侧，`shell.overlay`）**
- 定位：右缘抽屉，宽 400–480px（可拖拽调宽，v1 固定 440px），视觉与官方详情栏同源（同一套主题 token、圆角、阴影）。
- 结构（自上而下）：
  - **头部**：`📄 basename` + 相对路径 + 关闭 `⨯`；hover 显示绝对路径 tooltip；
  - **元信息行**：大小 / 行数 / 编码；操作：`复制路径`、`在系统中打开`（调官方 `workspaces.openPath`，保留既有 OS 流程）、`← 返回文件夹`（自 F3 进入时显示）；
  - **正文**：
    - 文本：行号 + 极简关键字高亮（按扩展名选少量关键字，v1 不做完整语法）；
    - 超长：默认前 512KB / 前 2000 行，底部提示「内容较长，已显示前 N 行」+ `加载更多`（追加读取，不整读）；
    - 图片（png/jpg/gif/webp，≤2MB）：桥返回 data URL，正文直接渲染 `<img>`（自适应宽度）——截图类文件一步可见；
    - 其他二进制：居中提示「二进制文件，暂不支持预览」+ `在系统中打开` 按钮；
  - **状态**：加载中（骨架/转圈）→ 成功 / 失败（越权 403 / 不存在 404 / 读取失败，含明确文案与重试）。
- 交互：`ESC` 或点击遮罩关闭；打开时焦点移入面板，关闭后焦点还原（a11y）；重复点击同一文件只聚焦不重开；点击另一文件直接替换内容（无重开动画）。

### F3 — 右上角项目文件夹

**入口按钮（`conversation.session.header.utilities`）**
- 形态：`📁 <cwd basename>`（如 `📁 dsh-plugin`），靠右端（`order` 取高值）；hover 显示完整 cwd tooltip。
- 无 cwd（空白会话）：按钮置灰并 tooltip「当前会话无工作目录」。

**浏览面板（`shell.overlay` 右侧抽屉，与预览同布局体系）**
- 头部：`📁 项目文件夹` + `刷新` + `⨯`；第二行**面包屑**（cwd 至根的每一级可点击跳转，`dsh-plugin › src › client` 样式）。
- 正文：**可展开目录树**（懒加载：首次展开某目录才拉取该层）——目录行 `▸/▾` 展开收起，文件行点击 → 打开 F2 预览抽屉（预览头部出现 `← 返回文件夹`）。树与面包屑双向同步。
- 底部：`显示隐藏文件` 开关（默认关，跟随设置页）、`忽略规则` 摘要（点击跳转设置页）。
- 空目录 / 空项目：友好空态文案 + `在系统中打开` 按钮。
- 会话切换：订阅 `sessions.list`，根目录自动切到新会话 cwd；面板保持打开、内容重载。

### 全局 UX 细节（三功能共用）

- **设置页**（`settings.section`，官方设置导航新增「工作区文件」）：
  - 拦截预览总开关（关闭后点击恢复系统打开）；
  - `显示隐藏文件`（默认关）；
  - `忽略规则`（默认 `node_modules,.git,dist,build,out,.next` + 隐藏文件；逗号分隔自定义）；
  - 预览大小上限（默认 512KB，100KB–5MB 可调）；
  - `允许浏览 cwd 之外`（默认关，安全；开启后 root guard 放宽为「host 主目录内」）；
  - 最近引用条数（默认 5）。
- 持久化：客户端偏好走 `localStorage`（源码插件可用）；安全类参数（大小上限、越界开关）同步 Host 配置（见 §6.2）。
- 中英文文案完整（`locale.register`）。

---

## 5. 非功能需求

| 项 | 要求 |
| --- | --- |
| 权限与安全 | **只读**。Host 桥强制 root guard：任何路径经 `path.resolve` 规范化后必须位于会话 cwd 之下，越界返回 403；仅绑定 127.0.0.1；`realpath` 复核防符号链接逃逸；大小上限服务端强制 |
| 性能 | 列表缓存（会话 cwd + 路径为 key，短 TTL）；`AbortSignal` 取消过期请求；目录树懒加载；预览按需读取、不整目录预读 |
| 生命周期 | 所有副作用（事件监听、点击委托、订阅、overlay 槽、计时器）挂在 `ctx.effect()` / 保留 disposer，插件停止/更新/卸载全部清理 |
| 国际化 | `zh` / `en` 字典，所有文案走 `t()` |
| 兼容性 | 不注册/不覆盖官方已占槽位：`conversation.details.tool`、`tool.call.toolview` 已占 key、`conversation.composer`（不 takeover 输入框） |
| 构建与挂载 | 遵守 AGENTS.md：`tsdown` 双入口构建、`lib/` 提交、`dsh plugin --profile web add "link:<绝对路径>"` 挂载、重启生效、`README.md` 必写 |

---

## 6. 技术方案

### 6.1 仓库布局（单插件）

```
dsh-plugin-workspace-files/
├── package.json            # dsh.client / dsh.bundle 声明，peerDeps: @deepseek-ai/cordis、react
├── tsdown.config.ts        # host + client 双入口构建（参照 dsh-plugin-task-notify）
├── src/
│   ├── index.ts            # Host 半：webServer 桥（list / read）+ 安全配置
│   └── client.ts           # Client 半：注入 slots/inputTriggers/sessions/workspaces/locale
│       └── client/
│           ├── mention.ts  # F1：InputTriggerSource（@ file，含最近引用/层级导航）
│           ├── preview.ts  # F2：预览抽屉组件 + 点击委托
│           ├── browser.ts  # F3：文件夹浏览抽屉（面包屑 + 目录树）
│           ├── header.ts   # F3：会话头部 utilities 按钮
│           ├── bridge.ts   # /workspace-files/* fetch 封装（带 AbortSignal）
│           ├── settings.ts # 设置页（settings.section）+ 偏好持久化
│           └── types.ts    # 桥协议类型 + 字典
├── lib/                    # 构建产物（必须提交）
└── README.md               # 用途/特性/挂载/配置
```

**为什么单插件而不是三个**：F1/F2/F3 共享同一 Host 文件桥（list/read）与同一个预览抽屉；AGENTS.md 规定插件间**不允许相互依赖**，拆成三个插件会导致桥接逻辑重复三份或被迫跨插件依赖。单插件内按模块划分即可。

### 6.2 Host 桥 API（`webServer.register`，绑定 127.0.0.1）

| 接口 | 方法 | 说明 |
| --- | --- | --- |
| `/workspace-files/list?root=<cwd>&path=<abs>` | GET | 列一层：`{ path, entries: [{ name, path, kind: 'file'\|'dir', size?, mtime? }], truncated, ignored: string[] }`；`path` 缺省 = root |
| `/workspace-files/read?root=<cwd>&path=<abs>&offset=<bytes>&limit=<bytes>` | GET | 读文件片段：`{ ok, path, content?, binary?, truncated?, size, encoding, imageDataUrl? }`；`offset/limit` 支持「加载更多」增量读取；图片（≤2MB）返回 `imageDataUrl` |
| `/workspace-files/config` | GET/POST | 安全类配置（大小上限、越界开关），持久化 `~/.dsh/plugins/workspace-files.json`（task-notify 同款） |

- 每个请求都做 root guard（§5）；失败统一 `{ ok:false, error }` + 恰当状态码（403/404/400/413）。
- 桥路径前缀 `/workspace-files/*`，与既有 `/task-notify/*` 互不冲突。

### 6.3 Client 模块要点

- **F1 mention.ts**：`{ trigger: '@', name: 'file', order: -10, candidates, onPick → { text }, lexicon, subscribeLexicon, codec }`；`candidates` 内解析查询中的 `/` 层级前缀 → 桥 `list`；`AbortSignal` 传递；每次会话激活 `warm` 预取首层 + 最近引用。
- **F2 preview.ts**：`slots.inject('shell.overlay', ...)` 注册抽屉（自备 id `workspace-files-preview`）；文档级 capture 点击委托在 `ctx.effect` 内绑定/清理；打开幂等。
- **F3 browser.ts + header.ts**：`slots.inject('conversation.session.header.utilities', ...)` 注册按钮；抽屉（id `workspace-files-browser`）与预览共用 overlay 容器定位与主题 token。
- **bridge.ts**：相对 `fetch('/workspace-files/...')` + JSON 解析 + 错误归一 + AbortSignal。
- **settings.ts**：`settings.section` 注册整页；偏好写 `localStorage`，安全参数经桥 `config` 同步 Host。

### 6.4 兼容性原则（零 shadow）

- ❌ 不注册 `conversation.details.tool`（single 座，官方占用）→ 预览用自绘抽屉。
- ❌ 不注册 `tool.call.toolview` 已占 key（write/edit/read 等）→ 点击委托增强，不替换渲染。
- ❌ 不 takeover `conversation.composer` → `@` 走官方 input-trigger 管线。
- ✅ 全部新增/拦截逻辑以 data 属性 + 语义兜底为目标选择器，官方升级导致选择器失效时降级为「不拦截」（仍可打开系统应用），不崩溃。

---

## 7. UI 交互与设计（加入插件后的界面效果）

### 7.1 总体布局（DSH 三栏 + 右侧抽屉）

```
┌───────────┬───────────────────────────────────────┬──────────┐
│           │ 会话头: 标题 …             [📁 项目]   │          │
│  左侧边栏  ├───────────────────────────────────────┤  详情栏   │
│ (会话列表) │                                       │ (官方)    │
│           │  对话区 …                              │          │
│           │  ─── 本轮产物 ───────────────────────  │          │
│           │  [index.ts] [app.tsx] [PRD.md] +2     │          │
│           │  ┌─────────────────────────────────┐  │          │
│           │  │ composer: 输入 @ 弹出文件菜单     │  │          │
│           │  └─────────────────────────────────┘  │          │
└───────────┴───────────────────────────────────────┴──────────┘
                          ▲ 插件新增（覆盖层，非替换）: 菜单 / 右侧抽屉
```

> 设计语言：抽屉使用官方主题 token（`--dsw-alias-*` 系列：背景、边框、label 三级色、交互 hover 色），圆角/间距/字号与官方详情栏一致——**新增 UI 与官方 UI 视觉同源，无割裂感**。

### 7.2 F1：`@` 文件菜单交互

```
composer 输入框                                  弹出菜单（conversation.input.overlay）
┌──────────────────────────────────────┐   ┌──────────────────────────────────┐
│ 请帮我看看 @src/components/            │──▶│ 文件                              │
└──────────────────────────────────────┘   │ ── 最近引用 ────────────────────  │
                                          │  📄 index.ts          (最近)       │
                                          │  📄 PRD.md            (最近)       │
                                          │ ── src/components ───────────────  │
                                          │  📄 button.tsx  ◀── 高亮(方向键)    │
                                          │  📄 input.tsx                      │
                                          │  📁 ui/          → 回车进入        │
                                          │  + 共 128 项，已截断               │
                                          └──────────────────────────────────┘
```

**交互流程**
1. 输入 `@` → 菜单弹出，默认光标在「最近引用」第一条；继续输入 `src/components/` → 按斜杠进入层级，仅显示该目录内容。
2. `↑/↓` 移动高亮（`aria-activedescendant` 跟随，焦点始终留在输入框）；`Enter` 选中；`Esc` 关闭；点击菜单外关闭。
3. 选中 `button.tsx` → 草稿变为 `请帮我看看 @src/components/button.tsx `（相对路径 + 空格），发送后 agent 收到该文本并 `read`；已引用路径在草稿中呈 chip 装饰。
4. IME 合成（拼音选字）期间不触发菜单（管线 guard 自带）。

### 7.3 F2：产物点击 → 右侧预览抽屉

```
对话区（本轮产物 chips）                       右侧预览抽屉（shell.overlay）
┌─────────────────────────────────┐   ┌───────────────────────────────────┐
│ ─── 本轮产物 ──────────────────── │   │ 📄 index.ts                [⨯]   │
│ [index.ts] [app.tsx] +2          │   │ src/index.ts                     │
│              ▲ 点击（原打开系统）   │   │ 1.2 KB · 84 行 · UTF-8          │
└─────────────────────────────────┘   │ [复制路径] [在系统中打开]           │
                                      │ ┌───────────────────────────────┐ │
                                      │ │ 1  import { defineTool }      │ │
                                      │ │ 2  import type { Context }    │ │
                                      │ │ 3  export const name = '…'    │ │
                                      │ │ …                             │ │
                                      │ └───────────────────────────────┘ │
                                      └───────────────────────────────────┘
```

**交互流程**
1. 鼠标移入产物 chip → hover 高亮（官方样式）；点击 → 右侧滑出预览抽屉（不再打开系统资源管理器）。
2. 抽屉打开即加载：文本带行号；图片直接渲染；二进制居中提示 + `在系统中打开`。
3. `Esc` / 点击遮罩 / `⨯` 关闭；点击另一文件 → 抽屉不关闭、内容直接替换。
4. 超长文件底部显示「已显示前 2000 行」+ `加载更多`（增量读取）。
5. `复制路径` 一键复制相对路径；`在系统中打开` 保留官方 OS 打开能力（二者都不打断当前对话）。

### 7.4 F3：右上角项目文件夹

```
会话头右端（点击前）                            文件夹浏览抽屉（点击后）
┌────────────────────────────┐   ┌───────────────────────────────────┐
│ 标题 …        [📁 dsh-plugin]│   │ 📁 项目文件夹      [⟳ 刷新] [⨯]   │
└────────────────────────────┘   │ dsh-plugin › src › client         │
   ▲ hover: 显示完整 cwd          │ ┌───────────────────────────────┐ │
                                 │ │ ▾ 📁 src                      │ │
                                 │ │    ▾ 📁 client                │ │
                                 │ │       📄 mention.ts  点击→预览 │ │
                                 │ │       📄 preview.ts           │ │
                                 │ │ ▸ 📁 dsh-plugin-task-notify   │ │
                                 │ │ 📄 AGENTS.md                  │ │
                                 │ │ 📄 README.md                  │ │
                                 │ └───────────────────────────────┘ │
                                 │ [x] 显示隐藏文件  忽略规则: 设置…   │
                                 └───────────────────────────────────┘
```

**交互流程**
1. 点击 `📁 dsh-plugin` → 右侧滑出文件夹抽屉（根 = 当前会话 cwd），首层懒加载。
2. 点击 `▸` 展开子目录（懒加载该层）；面包屑任一级可点击跳回。
3. 点击文件行 → 预览抽屉打开该文件，其头部出现 `← 返回文件夹`（回到浏览面板）。
4. `⟳ 刷新` 重列当前层；`显示隐藏文件` 开关即时生效；空目录显示空态 + `在系统中打开`。
5. 切换会话 → 抽屉根目录自动切到新会话 cwd 并重载；面板保持打开。

### 7.5 动效与可访问性规范

| 项 | 规范 |
| --- | --- |
| 抽屉滑入/滑出 | 200–240ms ease-out，与官方详情栏动效节奏一致；内容淡入 120ms |
| 菜单 | 官方管线菜单动效（零改动） |
| 焦点管理 | 抽屉打开聚焦头部关闭按钮；关闭后焦点还原至触发元素（a11y）；菜单走管线 combobox 模式 |
| 键盘 | 全局 `Esc` 关闭最上层抽屉；菜单 `↑/↓/Enter/Esc`（管线自带） |
| 主题 | 全部使用 `--dsw-alias-*` token，深/浅色主题自适应，无需单独维护配色 |
| 文案 | zh/en 双语；错误/空态均有明确文案与恢复路径（重试/打开系统） |
| 防误触 | IME 合成不触发菜单；拦截命中仅在「可解析为 cwd 内路径」时生效 |

---

## 8. 里程碑

| 阶段 | 内容 | 产出 |
| --- | --- | --- |
| M1 | 本 PRD 评审定稿 | PRD 定稿 |
| M2 | Host 桥（list / read 片段 / config + root guard + 忽略规则） | `src/index.ts` + 桥协议类型 |
| M3 | F1 `@` 文件 source（最近引用、层级导航、lexicon） | `mention.ts` |
| M4 | F2 预览抽屉 + 点击委托 + 图片/加载更多 | `preview.ts` |
| M5 | F3 头部按钮 + 文件夹抽屉（面包屑 + 目录树） | `header.ts` + `browser.ts` |
| M6 | 设置页 + 偏好持久化 | `settings.ts` |
| M7 | 构建、挂载到 web profile、真机验证（含动效/a11y 走查）、README、提交 | `lib/` 产物、README、commit |

> 提交规范遵循 AGENTS.md §7：`✨ feat: ...`（英文描述）。

---

## 9. 验收标准

**F1**
1. 输入 `@` 弹出文件菜单：最近引用置顶、当前层文件/目录齐全、忽略项不出现；
2. `@src/components/` 斜杠层级导航生效；前缀过滤生效；`↑/↓/Enter/Esc` 正常；
3. 选中后草稿变为 `相对路径 `，发送后 agent 收到该路径文本并成功 `read`；
4. 草稿中已引用文件呈 chip 装饰；切换会话后根目录随 cwd 变化；IME 合成不误触发。

**F2**
1. 点击产物 chip / 散文 mention / tool 卡片路径 → 右侧预览抽屉打开，**不再打开系统应用**；
2. 文本带行号与极简高亮；超长文件显示「前 N 行」+ `加载更多` 增量追加成功；
3. 图片文件直接渲染；二进制文件提示 + `在系统中打开`；
4. `Esc`/遮罩/`⨯` 关闭；重复点击不重开；点击另一文件内容直接替换；
5. `复制路径` 复制相对路径；`在系统中打开` 走官方流程；越权路径 403 提示。

**F3**
1. 头部右端出现 `📁 cwd basename`，hover 显示完整路径；空白会话置灰；
2. 抽屉打开：面包屑可跳转、目录树懒加载展开、文件点击打开预览（含 `← 返回文件夹`）；
3. 切换会话根目录自动更新；`刷新`/`显示隐藏文件` 生效；空态与 `在系统中打开` 可用。

**通用**
1. 设置页全部开关/规则生效并持久化（刷新后保留）；
2. 插件停止/卸载：无残留监听/overlay，点击恢复系统打开行为，无 console 报错；
3. 深/浅主题下抽屉与菜单视觉一致（token 驱动）；zh/en 文案完整；
4. `pnpm typecheck && pnpm build` 通过，`lib/` 已更新提交。

---

## 10. 决策记录（原「待确认」已按 UX 最优定稿）

| # | 决策 | 结论 | 理由（UX 优先） |
| --- | --- | --- | --- |
| D1 | 插件粒度 | **单插件** `dsh-plugin-workspace-files` | 三功能共享桥与预览抽屉；避免跨插件依赖 |
| D2 | `@` 引用形式 | **纯路径文本** + lexicon chip 装饰 | 与 `@subagent` 一致、agent 直观可读；无自定义序列化开销 |
| D3 | 预览位置 | **右侧自绘抽屉**（shell.overlay） | 零 shadow；视觉与官方详情栏同源 |
| D4 | cwd 越界 | **默认禁止**，设置页可开 | 安全优先；「允许浏览」作为显式选项保留便利性 |
| D5 | 忽略规则 | `node_modules,.git,dist,build,out,.next` + 隐藏文件，可配 | 菜单不被噪音淹没，列表更聚焦 |
| D6 | 最近引用 | 本会话最近引用 + 本轮产物，≤5 条置顶 | 最常复用的文件一步直达（Codex 同款心智） |
| D7 | 层级导航 | `@src/components/` 斜杠进入子目录 | 大项目免滚动，直达目标 |
| D8 | 超长文件 | 前 512KB/2000 行 + `加载更多` | 既防卡顿又不丢内容 |
| D9 | 图片预览 | ≤2MB 图片直接渲染 | 截图类文件一步可见 |
| D10 | 系统打开 | 预览内保留 `在系统中打开` | 不剥夺既有 OS 能力，Web/OS 双通道 |

---

## 11. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 官方 DOM 结构变更导致点击委托选择器失效 | F2 拦截失效（回退为系统打开） | data 属性 + 多重选择器 + 降级策略；随官方升级回归（README 记录回归点） |
| 大目录下 `@` 菜单 / 列表卡顿 | 交互迟钝 | 层级导航 + 上限截断 + AbortSignal + 缓存；深搜留 v2 |
| 预览大文件内存占用 | 页面卡顿 | 服务端大小上限 + 增量读取 + 一次性渲染 |
| 路径穿越 / 符号链接逃逸 | 越权读取 | root guard + realpath 复核 + 127.0.0.1 绑定 + 只读 |
| 与 `@subagent` 菜单并存造成混淆 | 用户分不清 | 分组标题 `文件` / `子代理`、类型图标、order 排序 |
| 抽屉与官方详情栏同时打开 | 右侧拥挤 | 抽屉为覆盖层不占布局；打开抽屉时不强制关闭详情栏（用户自决） |
| 官方升级引入新的文件呈现方式 | 新呈现不可拦截 | 以「产物数据 + 语义选择器」为锚，README 记录升级回归点 |

---

## 附录：关键依据代码位置（本部署）

- 输入触发管线契约：`node_modules/@deepseek-ai/dsh-client-ui-input-trigger/lib/types/types.d.ts`（`InputTriggerSource` / `PickOutcome` / `ReferenceInsert`）
- `@` source 现成模板：`node_modules/@deepseek-ai/dsh-client-ui-subagent/lib/client.js`（`trigger: '@'` 注册段）
- 产物 chips 与 openFile：`node_modules/@deepseek-ai/dsh-client-ui-deliverables/lib/client.js`、`node_modules/@deepseek-ai/dsh-client-ui-conversation/lib/client.js`（`openFile → workspaces.openPath`）
- Host 桥模板：`dsh-plugin-task-notify/src/index.ts`（`webServer.register`）、其 client `fetch('/task-notify/config')`
- Client 服务：`ctx.layout.openDetails`、`ctx.workspaces.listDirectory`、`ctx.sessions.list`（cwd）
- 槽位：`conversation.session.header.utilities`、`shell.overlay`、`conversation.input.overlay`（官方菜单，勿占用）、`settings.section`
