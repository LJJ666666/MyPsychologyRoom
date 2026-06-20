# 心理治疗室 — 开发路线图

> 本文档记录项目的开发阶段、优先级任务、技术债务和每次 Sprint 的焦点。每进入一个新阶段前先更新此文档，再动手实现。

---

## 一、技术栈

| 层 | 选型 | 说明 |
|----|------|------|
| 前端框架 | React 18 + TypeScript | 函数式组件 + Hooks |
| 构建工具 | Vite 6 | 冷启动/热更新快 |
| 样式方案 | Tailwind CSS 3 | 原子化样式 + 自定义 design tokens |
| 状态管理 | Zustand | 含 LocalStorage 持久化 |
| 路由 | react-router-dom v7 | 声明式路由 + NavLink |
| 图标 | lucide-react | Tree-shakable |
| 测试 | Vitest + React Testing Library | 单测 + 组件测试 |
| QA | Dogfood 脚本 | `npm run qa` 一键验证 |
| 浏览器自动化 | agent-browser | 多视口截图/回归 |

---

## 二、项目阶段与优先级

### 阶段 0：**核心流打通（当前 Sprint）** 🎯
**目标**：让 5 个 Tab 都能访问，核心链路闭环，应用"能跑起来"。

- **TD-1：引入 react-router-dom，替换 App.tsx 的 useState 路由**
  - 文件：`src/App.tsx`（重构），新增 `src/router/index.tsx`
  - 路由表：`/`, `/story/:id`, `/publish`, `/ai`, `/cross-age`, `/profile`
  - 页面改造：`BottomNav` 改用 `NavLink`，页面内部用 `useNavigate` / `useParams`

- **TD-2：测试回归**
  - 验证 `npm test`、`npm run lint`、`npm run check`、`npm run build` 全部通过

### 阶段 1：**MVP — 匿名社区完整可用**（当前 Sprint）
**目标**：用户能看、能发、能互动，内容是真实持久化的。

| 任务 | 说明 |
|------|------|
| 1.1 年龄段筛选 | 在首页补充年龄段（teen/worker/parent/elder）筛选，与现有标签筛选并列 |
| 1.2 Service 层抽象 | 创建 `src/services/` 目录，抽象 storyService/commentService/userService，当前实现为 localStorage 封装，便于后续替换为真实 HTTP API |
| 1.3 Layout 一致性 | 统一 AI/跨龄/我的三个 tab 的 Header 交互，避免与首页视觉不一致（TD-6） |
| 1.4 页面级测试 | 为 HomePage / StoryDetailPage / ProfilePage 增加基础测试用例（TD-5） |

### 阶段 2：**AI 心理助手 — 接入真实 LLM**
**目标**：对话有真实价值，不是随机文本。

- 接入大模型 API（设计好 Service 层抽象，方便切换供应商）
- Prompt 工程：角色设定 + 安全边界（不提供医疗诊断）
- 对话历史存储（localStorage → 后续后端）
- 敏感词/内容安全过滤

### 阶段 3：**v1.0 — 跨龄视角 + 社交深度**
**目标**：突出产品差异化卖点「跨代视角」。

- CrossAgePage：按 `teen` / `worker` / `parent` / `elder` 展示对同一话题的不同视角
- 「视角切换」交互设计：同一条故事，看不同身份怎么看
- 收藏/点赞的列表页
- 故事搜索（按关键词 / 标签 / 年龄段）

### 阶段 4：**增强迭代 — 质量与体验**
- 多语言 / i18n（中 → 英）
- 暗黑模式（Tailwind dark variant）
- 动画与微交互
- 真实后端接入（Node/Go）
- E2E 测试（Playwright）

---

## 三、技术债务清单

| ID | 问题 | 位置 | 影响 | 计划修复阶段 | 状态 |
|----|------|------|------|-------------|------|
| TD-1 | 无路由库，页面切换靠 useState 硬编码 | App.tsx | 核心流程阻塞：5 个 Tab 只能访问首页 | 阶段 0 | ✅ 已完成 |
| TD-2 | AI 回复是静态 mock | `data/mock.ts` | AI 助手无真实能力 | 阶段 2 | 待处理 |
| TD-3 | 数据完全前端，无法跨设备持久化 | `data/mock.ts` + `store/index.ts` | 刷新后数据可恢复（store 已持久化），但无法跨设备分享 | 阶段 1 | ✅ Service 层已建立，可无缝替换后端 |
| TD-4 | 跨龄视角页面可深化内容 | `pages/CrossAge/CrossAgePage.tsx` | 核心差异化功能可扩展 | 阶段 3 | 待处理 |
| TD-5 | 测试覆盖浅，缺少页面级测试 | `src/__tests__/` | 回归风险 | 阶段 1 | ✅ 已补 3 个页面共 33 条用例，总计 47 条 |
| TD-6 | 部分 Tab Header 视觉/交互不一致 | `components/Layout/Header.tsx` | 视觉/交互不一致 | 阶段 1 | ✅ 统一 Header API，各 Tab 显式提供 rightContent |
| TD-7 | 缺少 Service 层抽象，组件直接调用 store | 所有 pages / `store/index.ts` | 后续接入后端改动面大 | 阶段 1 | ✅ `src/services/` 已建立，可独立替换实现 |
| TD-8 | 首页缺少年龄段筛选维度 | `pages/Home/HomePage.tsx` | 个性化浏览体验不足 | 阶段 1 | ✅ 已实现年龄段 + 标签 + 排序三维筛选 |

---

## 四、开发流程

每个功能的标准交付流程：

```
1. 规划沟通  → 在此文档中补充阶段/任务描述
2. TDD 起步  → 先写（或补）测试用例 → 先红
3. 实现代码  → 让测试变绿
4. 重构/优化  → 保持测试通过
5. QA 验证    → `npm run qa`（test + lint + check + build）
6. 截图回归  → agent-browser 做一次多视口截图
7. 更新文档  → 在对应 .md 文档记录变更
```

---

## 五、质量门禁

每次 MR / 每次功能交付前必须满足：

- ✅ `npm test` 全部通过
- ✅ `npm run lint` 无错误
- ✅ `npm run check`（tsc）无类型错误
- ✅ `npm run build` 构建成功

---

## 六、Sprint 日志

### Sprint 1 — 引入 react-router-dom & 核心流打通
- 日期：2026-06-18 ~ 2026-06-20
- 目标：替换 App.tsx 的 useState 路由，BottomNav 接入 NavLink，5 个 Tab 可完整跳转，测试/构建全通过
- 负责人：开发
- 状态：✅ 已完成
- 成果：
  - `src/router/index.tsx` 建立统一路由表（/、/story/:id、/publish、/ai、/cross-age、/profile、/profile/stories、/profile/collections、/profile/edit、/login）
  - `BottomNav.tsx` 接入 NavLink + 激活态样式
  - `App.tsx` 简化为 RouterProvider 单一入口
  - 质量门禁：`npm test`（14/14 通过）、`npm run lint`（无错误）、`npm run check`（无类型错误）、`npm run build`（构建成功）
  - 我的故事/我的收藏页面已联动 store 数据
  - 故事发布已写入 store（stories + myStories）
  - 评论/点赞/收藏已全部联动 store

---

### Sprint 2 — MVP 匿名社区（阶段 1）
- 日期：2026-06-20
- 目标：补充年龄段筛选、建立 Service 层、统一 Layout、补齐页面测试
- 负责人：开发
- 状态：✅ 已完成
- 任务清单（按执行顺序）：

| 序号 | 任务 | 关联 TD | 交付物 | 验证方式 |
|------|------|---------|--------|----------|
| 2.1 | 首页增加年龄段筛选 | TD-8 | `HomePage.tsx` + 新增 `AgeGroupFilter` 组件 | 首页可按年龄段筛选 |
| 2.2 | Service 层抽象（story/comment/user） | TD-7 / TD-3 | `src/services/{storyService,commentService,userService,index}.ts` | 类型/构建检查通过 |
| 2.3 | 统一各 Tab Header 样式与交互 | TD-6 | `Header.tsx` 重构统一 API，各 Page 显式提供 rightContent | 各 Tab 视觉一致 |
| 2.4 | 补充页面级测试（HomePage / StoryDetail / Profile） | TD-5 | `src/__tests__/pages/{HomePage,StoryDetailPage,ProfilePage}.test.tsx` | `npm test` 新增 33 条全部通过 |

- 成果：
  - 首页支持"年龄段 + 标签 + 最新/最热"三维度筛选，筛选状态同步到 store
  - 新增 `src/services/` 统一服务层，提供 storyService、commentService、userService 三大服务
  - Header 组件重构为统一 prop API（title / rightContent / showBack），各页面可自定义右侧内容
  - 测试总数从 14 → 47 条，覆盖页面渲染、筛选逻辑、互动操作、用户状态
  - 质量门禁全部通过：`npm test` (47/47)、`npm run lint` (0 error)、`npm run check` (ok)、`npm run build` (ok)

---

## 七、云端开发注意事项 ⚠️

> 本节记录 TRAE 云端开发环境中开发服务器（dev server）常见的坑和标准操作流程。
> 遇到「你看到服务启动了，我看到 Service not running」等不一致问题，按本节排查。

### 7.1 标准启动命令

**禁止**直接使用 `npm run dev`（不指定 host）。Vite 默认只绑定 `localhost`，
云端环境外部无法访问。

```bash
# 正确启动方式：绑定 0.0.0.0 + 固定端口
npm run dev -- --port 5173 --host 0.0.0.0
```

**重要参数说明**：

| 参数 | 作用 | 不传的后果 |
|------|------|-----------|
| `--host 0.0.0.0` | 监听所有网络接口，允许外部访问 | 云端用户无法打开页面，仅 `localhost` 可访问 |
| `--port 5173` | 固定端口，便于 agent-browser / QA 脚本定位 | Vite 自动递增端口，下次访问地址变了 |

### 7.2 故障处理清单

遇到「Service not running」或「我这边打不开」时，按以下顺序排查：

**Step 1 — 确认 Vite 是否真的在运行**
```bash
# 查看进程
ps aux | grep vite
# 或
pgrep -f "vite"
```
如果无进程 → 重新启动（见 7.1）。

**Step 2 — 检查旧实例是否占用端口**
```bash
# 查看谁占了 5173
lsof -i :5173
# 或者
netstat -tlnp | grep 5173
```
如果有旧进程 → 全部杀掉再重启：
```bash
pkill -f "vite"
# 或者精确杀特定 PID
kill <PID>
```

**Step 3 — 检查 host 配置**
Vite 启动日志必须包含 **Network: http://x.x.x.x:5173/** 这一行。
如果只有 `Local: http://localhost:5173/` 而无 Network 行 →
说明 `--host 0.0.0.0` 没有生效，需重新启动。

**Step 4 — 检查防火墙/代理**
云端环境可能存在网络层限制。
- 同机浏览器访问：使用 `http://localhost:5173/`
- 局域网内其他设备：使用 Network 显示的 `http://10.x.x.x:5173/`
- 如果都不行，检查云端预览服务是否正确映射端口

### 7.3 重启流程模板（标准操作）

每次需要重启开发服务器时，**严格按此顺序**，避免出现「旧进程残留→端口占用→反复改端口→用户访问地址漂移」的死循环：

```bash
# 1. 停止所有相关进程
pkill -f "vite"
sleep 1

# 2. 确认端口已释放（可选但推荐）
lsof -i :5173  # 应该无输出

# 3. 用标准命令重新启动
cd /workspace
npm run dev -- --port 5173 --host 0.0.0.0

# 4. 确认启动日志中同时出现 Local 和 Network 两行
#    Local:   http://localhost:5173/
#    Network: http://10.x.x.x:5173/
```

### 7.4 配置建议

在 [vite.config.ts](file:///workspace/vite.config.ts) 中**不**硬编码 `server.host` 或 `server.port`，
原因：
- 硬编码后团队成员本地启动可能冲突
- 环境差异大，启动时通过 CLI 参数传入更灵活

当前配置正确，保持现状即可。
