# 心理治疗室 (Psychology Room)

一个以匿名故事社区为核心、AI 心理助手为辅助的 Web 应用。帮助不同年龄、不同身份的人打破隔阂，在互相阅读、互相回复中获得治愈。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS 3
- **状态管理**: Zustand (含 LocalStorage 持久化)
- **测试框架**: Vitest + React Testing Library
- **UI 图标**: Lucide React

## 三个核心 Skill 集成

本项目已集成三种开发质量保障能力：

### 1. 测试驱动开发 (TDD)
### 2. Dogfood QA 测试
### 3. Agent-Browser 浏览器自动化

详细指南见下方。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 目录结构

```
/workspace
├── src/
│   ├── components/          # 公共组件
│   │   ├── Layout/          # 布局组件 (Header, BottomNav)
│   │   ├── StoryCard/       # 故事卡片
│   │   ├── Comment/         # 评论组件
│   │   └── common/          # 通用组件 (EmptyState, TagFilter)
│   ├── pages/               # 页面
│   │   ├── Home/            # 首页/故事广场
│   │   ├── StoryDetail/     # 故事详情
│   │   ├── AIAssistant/     # AI心理助手
│   │   ├── CrossAge/        # 跨龄视角
│   │   ├── Profile/         # 个人中心
│   │   └── Publish/         # 发布故事
│   ├── store/               # Zustand 状态管理
│   ├── data/                # Mock 数据
│   ├── types/               # 类型定义
│   ├── test/                # 测试配置
│   ├── __tests__/           # 测试文件
│   ├── App.tsx              # 主入口
│   ├── main.tsx             # 渲染入口
│   └── index.css            # 样式入口
├── scripts/                 # 自动化脚本
│   ├── dogfood.sh           # QA 测试脚本
│   ├── screenshot-check.sh  # 多视口截图脚本
│   └── navigation-test.sh   # 导航测试脚本
├── vitest.config.ts         # Vitest 配置
├── tailwind.config.js       # Tailwind 配置
├── TDD-GUIDE.md             # TDD 指南
├── DOGFOOD-GUIDE.md         # Dogfood QA 指南
└── AGENT-BROWSER-GUIDE.md   # Agent-Browser 指南
```

## 功能模块

| 模块 | 路由位置 | 核心能力 |
|------|----------|----------|
| 故事广场 | `/` 首页 | 故事列表、最新/最热筛选、话题标签筛选 |
| 故事详情 | `/story/:id` | 完整内容、评论交互、点赞/收藏 |
| AI心理助手 | 底部导航 "AI助手" | 共情对话、发送消息、历史消息保留 |
| 跨龄视角 | 底部导航 "跨龄视角" | 四个年龄段对同一话题的观点对比 |
| 个人中心 | 底部导航 "我的" | 我的故事、我的收藏、用户设置 |
| 发布故事 | 首页 "+" 按钮 | 三步发布（选择类型→写内容→设置） |

---

## 📋 Skill 1: 测试驱动开发 (TDD)

**为什么用 TDD**: 新功能先写测试→测试失败→写代码→测试通过→重构。保证每次改动都可验证。

### 常用命令

```bash
# 运行所有测试（单次）
npm test

# 监听模式开发 - 改代码时自动重跑
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

### 测试文件示例

项目已包含 12 个测试用例作为起点：

```
src/__tests__/
├── store/store.test.ts          # Zustand Store 测试（点赞/收藏/评论/用户）
├── components/basics.test.ts    # 组件基础渲染测试
└── types.test.ts                # 类型枚举值测试
```

### TDD 工作流程

1. **RED (红)**: 写一个失败的测试，描述你想要的行为
2. **GREEN (绿)**: 写最少的代码让测试通过
3. **REFACTOR (重构)**: 在测试保持绿色的前提下，优化代码

详细规则和模板见 [TDD-GUIDE.md](./TDD-GUIDE.md)

### 新功能 TDD 示例

假设要加一个"故事发布时验证非空"功能：

```bash
# 1. 先写测试 - 应该失败
vim src/__tests__/components/PublishButton.test.tsx
npm run test:watch  # 观察它 FAIL

# 2. 实现代码 - 让它通过
vim src/pages/Publish/PublishPage.tsx

# 3. 重构 - 保持测试通过
# 提取验证逻辑为独立函数
```

---

## 🔍 Skill 2: Dogfood QA 测试

**为什么用 Dogfood**: 系统性地探索应用，发现 UX 问题、交互 bug、布局缺陷。不是单元测试能覆盖的。

### 运行 QA 测试

```bash
# 开发服务器已启动 (http://localhost:5173)
npm run qa

# 或手动指定地址
bash scripts/dogfood.sh http://你的地址:端口
```

### 产出

运行后会在 `dogfood-output/` 目录生成：

```
dogfood-output/
├── screenshots/       # 页面截图（如果 agent-browser 可用）
├── videos/           # 交互录制视频
└── report.md         # 结构化测试报告
```

### 手动测试清单（50+ 检查点）

详细清单涵盖：
- ✅ 首页布局与导航
- ✅ 故事详情交互
- ✅ AI心理助手对话
- ✅ 跨龄视角切换
- ✅ 个人中心展示
- ✅ 发布故事流程
- ✅ 可访问性 (A11y)
- ✅ 响应式适配
- ✅ Console 错误检查
- ✅ 性能体验

完整清单见 [DOGFOOD-GUIDE.md](./DOGFOOD-GUIDE.md)

---

## 🤖 Skill 3: Agent-Browser 浏览器自动化

**为什么用 Agent-Browser**:
- 多视口截图对比（桌面/平板/手机）
- 录制用户交互视频用于演示
- 自动化验证页面元素存在性
- 与 TDD 配合：TDD 写逻辑测试，Agent-Browser 做视觉回归

### 运行自动化脚本

```bash
# 多视口截图测试
bash scripts/screenshot-check.sh

# 导航测试
bash scripts/navigation-test.sh
```

### 常用命令模板

如果系统提供了 `agent-browser` 命令：

```bash
# 启动会话，打开首页
agent-browser --session psych-room open http://localhost:5173
agent-browser --session psych-room wait 2000

# 找页面元素（获取 refs）
agent-browser --session psych-room snapshot -i

# 点击元素（ref 来自上一步 snapshot）
agent-browser --session psych-room click @e5

# 不同视口截图
agent-browser --session psych-room set viewport 1440 900
agent-browser --session psych-room screenshot output/desktop.png
agent-browser --session psych-room set viewport 375 812
agent-browser --session psych-room screenshot output/mobile.png

# 录制交互视频
agent-browser --session psych-room record start output/demo.webm
# ... 执行操作 ...
agent-browser --session psych-room record stop

# 关闭会话
agent-browser --session psych-room close
```

完整命令参考与本项目测试计划见 [AGENT-BROWSER-GUIDE.md](./AGENT-BROWSER-GUIDE.md)

---

## 最佳实践工作流

### 开发一个新功能

```bash
# 1. 先 baseline 截图（当前状态存档）
bash scripts/screenshot-check.sh

# 2. TDD 写测试 -> 写实现
npm run test:watch

# 3. 实现完成后，lint + 类型检查
npm run lint
npm run check

# 4. 再截图做视觉回归检查
bash scripts/screenshot-check.sh

# 5. Dogfood QA 完整测试
npm run qa

# 6. 提交前跑一次全部测试
npm test
```

### 修复一个 bug

```bash
# 1. 先写测试复现 bug（测试失败）
# 2. 修复代码，测试通过
# 3. 用 agent-browser 截图验证视觉
# 4. 更新 dogfood-output/report.md 记录问题已修复
```

## 开发辅助

```bash
# 代码质量检查
npm run lint          # ESLint 检查
npm run check         # TypeScript 类型检查

# 构建验证
npm run build         # 生产构建
```

## License

MIT
