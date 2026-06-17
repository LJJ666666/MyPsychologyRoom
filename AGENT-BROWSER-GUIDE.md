# agent-browser 自动化测试指南

## 快速开始

agent-browser 是一个浏览器自动化 CLI 工具。在需要时系统会提供这个命令。

### 检查是否可用

```bash
agent-browser --version
# 如果提示 command not found，说明当前环境暂未提供
# 但本项目已准备好了所有命令脚本，有工具时即可运行
```

### 运行截图测试

```bash
bash scripts/screenshot-check.sh
# 或
bash scripts/screenshot-check.sh http://localhost:5173
```

### 运行导航测试

```bash
bash scripts/navigation-test.sh
```

## 常用命令模板

### 1. 基础导航与截图

```bash
# 打开页面
agent-browser --session psych-room open http://localhost:5173

# 等待加载（毫秒或特定状态）
agent-browser --session psych-room wait 2000
agent-browser --session psych-room wait --load networkidle

# 设置视口（不同设备尺寸）
agent-browser --session psych-room set viewport 1440 900   # 桌面
agent-browser --session psych-room set viewport 768 1024   # 平板
agent-browser --session psych-room set viewport 375 812    # 手机

# 截图
agent-browser --session psych-room screenshot output/home.png
agent-browser --session psych-room screenshot --annotate output/home-annotated.png

# 关闭会话
agent-browser --session psych-room close
```

### 2. 页面快照（找元素）

```bash
# 获取页面交互元素的引用（refs）
agent-browser --session psych-room snapshot -i
# 输出类似:
# @e1 [heading] "心理治疗室"
# @e2 [button] "最新"
# @e3 [button] "发布"
```

### 3. 用户交互模拟

```bash
# 点击按钮（用 snapshot 返回的 ref）
agent-browser --session psych-room click @e3      # 点击"发布"

# 填写表单
agent-browser --session psych-room fill @inputRef "这是一个测试故事标题"

# 按键（Enter/Escape 等）
agent-browser --session psych-room press Enter
```

### 4. 录制视频

```bash
# 开始录制
agent-browser --session psych-room record start dogfood-output/videos/feature-demo.webm

# ... 执行一系列操作（点击、填写等）...

# 停止录制
agent-browser --session psych-room record stop
```

### 5. 执行 JS 检查页面状态

```bash
# 获取页面标题
agent-browser --session psych-room eval 'document.title'

# 检查 console 错误
agent-browser --session psych-room eval 'JSON.stringify({
  storiesCount: document.querySelectorAll("article").length,
  buttons: document.querySelectorAll("button").length
})'
```

### 6. 对比测试（修改前后对比）

```bash
# 在修改前截图
agent-browser --session psych-room set viewport 1440 900
agent-browser --session psych-room screenshot dogfood-output/screenshots/before-home.png

# ... 应用代码修改后重新测试 ...

# 对比
agent-browser --session psych-room diff screenshot --baseline dogfood-output/screenshots/before-home.png
```

## 本项目测试计划

### 测试1: 首页布局检查

```bash
agent-browser --session psych-room open http://localhost:5173
agent-browser --session psych-room wait 3000
agent-browser --session psych-room set viewport 1440 900
agent-browser --session psych-room screenshot dogfood-output/screenshots/01-home-desktop.png
agent-browser --session psych-room set viewport 375 812
agent-browser --session psych-room screenshot dogfood-output/screenshots/02-home-mobile.png
agent-browser --session psych-room snapshot -i > dogfood-output/screenshots/03-snapshot.txt
agent-browser --session psych-room close
```

### 测试2: 点击故事卡片进入详情

```bash
agent-browser --session psych-room open http://localhost:5173
agent-browser --session psych-room wait 2000
agent-browser --session psych-room snapshot -i
# 查找 story card 的 ref，假设是 @e5
agent-browser --session psych-room click @e5
agent-browser --session psych-room wait 1000
agent-browser --session psych-room screenshot dogfood-output/screenshots/04-story-detail.png
agent-browser --session psych-room close
```

### 测试3: 点赞交互

```bash
agent-browser --session psych-room open http://localhost:5173
agent-browser --session psych-room wait 2000
agent-browser --session psych-room record start dogfood-output/videos/like-interaction.webm
# 假设点赞按钮是 @e7
agent-browser --session psych-room click @e7
agent-browser --session psych-room wait 500
agent-browser --session psych-room record stop
agent-browser --session psych-room screenshot dogfood-output/screenshots/05-after-like.png
agent-browser --session psych-room close
```

### 测试4: AI助手对话

```bash
agent-browser --session psych-room open http://localhost:5173
agent-browser --session psych-room wait 2000
# 点击 AI 助手导航
agent-browser --session psych-room snapshot -i
# 假设 AI 助手是 @eN
agent-browser --session psych-room click @eN
agent-browser --session psych-room wait 1500
agent-browser --session psych-room screenshot dogfood-output/screenshots/06-ai-assistant.png
agent-browser --session psych-room close
```

## 输出文件结构

```
dogfood-output/
├── screenshots/          # 截图 (.png)
│   ├── 01-home-desktop.png
│   ├── 02-home-mobile.png
│   └── ...
├── videos/               # 录制的交互视频 (.webm)
│   └── like-interaction.webm
└── report.md             # QA 测试报告
```

## 与 TDD 流程配合

```
开发新功能前:
  1. 先截图 baseline（作为对比基准）
  2. 写 TDD 单元测试

开发完成后:
  1. npm test 验证单元测试通过
  2. bash scripts/screenshot-check.sh 再次截图
  3. 对比前后截图，确保无视觉回归
  4. npm run qa 运行完整测试报告
```

## 调试

### 查看命令帮助
```bash
agent-browser --help
```

### 有 head 模式（看到浏览器窗口）
```bash
agent-browser --headed --session debug open http://localhost:5173
```

### 清除所有会话
```bash
agent-browser close --all
```
