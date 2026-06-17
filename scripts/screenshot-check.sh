#!/usr/bin/env bash
# ============================================================
# agent-browser 截图脚本 - 多视口截图测试
# ============================================================
# 用法:
#   bash scripts/screenshot-check.sh <URL>
# ============================================================

set -e

TARGET_URL="${1:-http://localhost:5173}"
OUTPUT_DIR="$(pwd)/dogfood-output/screenshots"
SESSION="psych-room-screenshots"

mkdir -p "${OUTPUT_DIR}"

echo "=========================================="
echo "  多视口截图测试"
echo "  目标: ${TARGET_URL}"
echo "=========================================="

# 检查 agent-browser 是否可用
if ! command -v agent-browser >/dev/null 2>&1; then
  echo ""
  echo "ℹ️  注意: agent-browser 命令未找到"
  echo "  agent-browser 是由系统提供的浏览器自动化工具"
  echo "  下面展示在本项目中可使用的命令模板："
  echo ""
  echo "  # 打开页面"
  echo "  agent-browser --session ${SESSION} open ${TARGET_URL}"
  echo ""
  echo "  # 等待页面加载"
  echo "  agent-browser --session ${SESSION} wait 3000"
  echo ""
  echo "  # 截图（桌面）"
  echo "  agent-browser --session ${SESSION} set viewport 1440 900"
  echo "  agent-browser --session ${SESSION} screenshot ${OUTPUT_DIR}/desktop-home.png"
  echo ""
  echo "  # 截图（手机）"
  echo "  agent-browser --session ${SESSION} set viewport 375 812"
  echo "  agent-browser --session ${SESSION} screenshot ${OUTPUT_DIR}/mobile-home.png"
  echo ""
  echo "  # 获取页面快照"
  echo "  agent-browser --session ${SESSION} snapshot -i"
  echo ""
  echo "  # 关闭会话"
  echo "  agent-browser --session ${SESSION} close"
  echo ""
  exit 0
fi

# 桌面视口
echo ">>> 桌面 (1440x900)"
agent-browser --session "${SESSION}" open "${TARGET_URL}"
agent-browser --session "${SESSION}" wait 3000
agent-browser --session "${SESSION}" set viewport 1440 900
agent-browser --session "${SESSION}" screenshot "${OUTPUT_DIR}/01-desktop-home.png"

# 平板视口
echo ">>> 平板 (768x1024)"
agent-browser --session "${SESSION}" set viewport 768 1024
agent-browser --session "${SESSION}" screenshot "${OUTPUT_DIR}/02-tablet-home.png"

# 手机视口
echo ">>> 手机 (375x812)"
agent-browser --session "${SESSION}" set viewport 375 812
agent-browser --session "${SESSION}" screenshot "${OUTPUT_DIR}/03-mobile-home.png"

# 获取页面快照
echo ">>> 页面快照"
agent-browser --session "${SESSION}" snapshot -i > "${OUTPUT_DIR}/page-snapshot.txt" 2>&1

# 关闭会话
agent-browser --session "${SESSION}" close

echo ""
echo "✅ 截图完成! 文件保存在: ${OUTPUT_DIR}"
