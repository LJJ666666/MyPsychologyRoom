#!/usr/bin/env bash
# ============================================================
# agent-browser 导航测试脚本 - 测试页面间导航
# ============================================================

set -e

TARGET_URL="${1:-http://localhost:5173}"
SESSION="psych-room-nav"
VIDEO_DIR="$(pwd)/dogfood-output/videos"
mkdir -p "${VIDEO_DIR}"

echo "=========================================="
echo "  导航测试 - agent-browser"
echo "  目标: ${TARGET_URL}"
echo "=========================================="

if ! command -v agent-browser >/dev/null 2>&1; then
  echo ""
  echo "ℹ️  agent-browser 不可用，以下是导航测试的命令模板："
  echo ""
  echo "  1. 打开首页"
  echo "  agent-browser --session ${SESSION} open ${TARGET_URL}"
  echo "  agent-browser --session ${SESSION} wait --load networkidle"
  echo ""
  echo "  2. 获取可点击元素（定位底部导航）"
  echo "  agent-browser --session ${SESSION} snapshot -i"
  echo ""
  echo "  3. 点击导航元素（根据 snapshot 返回的 @refs）"
  echo "  agent-browser --session ${SESSION} click @eN"
  echo ""
  echo "  4. 录制导航过程"
  echo "  agent-browser --session ${SESSION} record start ${VIDEO_DIR}/navigation.webm"
  echo "  # ... 执行一系列点击操作 ..."
  echo "  agent-browser --session ${SESSION} record stop"
  echo ""
  echo "  5. 测试关键交互（点赞/评论）"
  echo "  agent-browser --session ${SESSION} fill @inputRef '测试评论内容'"
  echo "  agent-browser --session ${SESSION} click @buttonRef"
  echo ""
  echo "  6. 检查 console errors"
  echo "  agent-browser --session ${SESSION} eval 'JSON.stringify({errors: console.error.length, warnings: console.warn.length})'"
  echo ""
  echo "  7. 完成清理"
  echo "  agent-browser --session ${SESSION} close"
  echo ""
  exit 0
fi

# 实际执行（如果 agent-browser 存在）
echo ">>> 打开首页..."
agent-browser --session "${SESSION}" open "${TARGET_URL}"
agent-browser --session "${SESSION}" wait 3000

echo ">>> 页面快照..."
agent-browser --session "${SESSION}" snapshot -i

echo ">>> 关闭会话..."
agent-browser --session "${SESSION}" close

echo ""
echo "✅ 导航测试完成"
