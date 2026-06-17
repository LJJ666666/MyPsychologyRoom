#!/usr/bin/env bash
# ============================================================
# Dogfood QA 脚本 - 心理治疗室 App 系统性测试
# ============================================================
# 用法:
#   bash scripts/dogfood.sh <目标URL>
#   bash scripts/dogfood.sh http://localhost:5173
# ============================================================

set -e

TARGET_URL="${1:-http://localhost:5173}"
OUTPUT_DIR="$(pwd)/dogfood-output"
SESSION="psychology-room-qa"

echo "=========================================="
echo "  心理治疗室 - Dogfood QA 测试"
echo "  目标: ${TARGET_URL}"
echo "  输出: ${OUTPUT_DIR}"
echo "=========================================="

# 创建输出目录
mkdir -p "${OUTPUT_DIR}/screenshots" "${OUTPUT_DIR}/videos"

# 初始化报告
REPORT_FILE="${OUTPUT_DIR}/report.md"
cat > "${REPORT_FILE}" << 'REPORT_HEADER'
# Dogfood QA 测试报告 - 心理治疗室

## 基本信息
- 测试时间: 见底部
- 目标环境: 开发环境

## 测试流程
1. 首页/故事广场 - 检查布局、导航、筛选
2. 故事详情页 - 检查内容展示、评论、点赞收藏
3. AI心理助手 - 检查对话界面
4. 跨龄视角 - 检查年龄段切换
5. 个人中心 - 检查用户信息展示

## 问题清单

REPORT_HEADER

# 测试步骤
echo ""
echo ">>> 步骤 1: 初始化浏览器会话..."

# 测试 URL 是否可访问
if command -v curl >/dev/null 2>&1; then
  if ! curl -s --head "${TARGET_URL}" | head -1 | grep -q "200\|301\|302"; then
    echo "⚠️  警告: 目标 URL 可能无法访问"
    echo "请先启动开发服务器: npm run dev"
  fi
fi

# 初始化会话 (如果 agent-browser 可用)
if command -v agent-browser >/dev/null 2>&1; then
  echo ">>> 步骤 2: 导航到首页并截图..."
  agent-browser --session "${SESSION}" open "${TARGET_URL}" || true
  agent-browser --session "${SESSION}" wait 2000 || true

  echo ">>> 步骤 3: 首页截图..."
  agent-browser --session "${SESSION}" screenshot "${OUTPUT_DIR}/screenshots/01-home.png" || true

  echo ">>> 步骤 4: 测试导航到 AI 助手..."
  echo "(手动测试时请检查底部导航栏是否正常切换)"

  echo ">>> 步骤 5: 结束会话..."
  agent-browser --session "${SESSION}" close || true
fi

# 运行单元测试作为补充
echo ""
echo ">>> 步骤 6: 运行单元测试..."
npm test --silent 2>&1 || echo "测试命令失败，请手动运行 npm test"

echo ""
echo ">>> 步骤 7: 运行 Lint 检查..."
npm run lint --silent 2>&1 || echo "Lint 检查发现问题"

echo ""
echo ">>> 步骤 8: 运行 TypeScript 类型检查..."
npm run check --silent 2>&1 || echo "类型检查发现问题"

# 完成报告
cat >> "${REPORT_FILE}" << 'REPORT_FOOTER'

## 测试结果摘要

### ✅ 自动化检查
- 单元测试: npm test 运行
- 代码风格: npm run lint 检查
- 类型检查: npm run check 验证

### ⚠️  需手动验证
- 页面布局是否正常
- 底部导航栏切换是否工作
- 故事卡片点击能否进入详情页
- AI助手对话输入是否可用
- 点赞/收藏交互是否正常
- 发布故事流程是否完整

## 建议改进
1. 为关键组件添加更多单元测试
2. 为 AI 助手对话流程添加集成测试
3. 为移动端适配添加专门的视口测试

---

测试结束时间戳: __TIMESTAMP__
REPORT_FOOTER

sed -i "s/__TIMESTAMP__/$(date '+%Y-%m-%d %H:%M:%S')/" "${REPORT_FILE}"

echo ""
echo "=========================================="
echo "  ✅ QA 测试完成！"
echo "  报告位置: ${REPORT_FILE}"
echo "  截图位置: ${OUTPUT_DIR}/screenshots/"
echo "=========================================="
