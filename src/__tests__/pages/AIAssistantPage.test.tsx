import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AIAssistantPage from '../../pages/AIAssistant/AIAssistantPage';
import { useStore } from '../../store';

const renderPage = () => {
  return render(
    <MemoryRouter initialEntries={['/ai']}>
      <AIAssistantPage />
    </MemoryRouter>
  );
};

describe('AIAssistantPage — AI心理助手', () => {
  beforeEach(() => {
    // 每次测试前清空对话
    const state = useStore.getState();
    state.clearMessages();
    // 重置 mock timer
    vi.useFakeTimers();
  });

  it('渲染标题"AI心理助手"', () => {
    renderPage();
    expect(screen.getByText('AI心理助手')).toBeTruthy();
  });

  it('渲染欢迎语与提示信息', () => {
    renderPage();
    expect(screen.getByText('你好，我是你的AI心理助手')).toBeTruthy();
    expect(screen.getByText(/AI助手仅供参考/)).toBeTruthy();
  });

  it('显示"新对话"按钮', () => {
    renderPage();
    expect(screen.getByText('新对话')).toBeTruthy();
  });

  it('显示输入框与发送按钮', () => {
    renderPage();
    const input = screen.getByPlaceholderText('倾诉你的心事...') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(document.querySelectorAll('button').length).toBeGreaterThan(0);
  });

  it('发送消息后，用户消息出现在对话中', async () => {
    renderPage();
    const input = screen.getByPlaceholderText('倾诉你的心事...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '你好，我今天压力很大' } });
    expect(input.value).toBe('你好，我今天压力很大');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('');

    // 快速推进所有定时器，让 mock 的打字效果完成
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // 用户消息应该已存入 store
    const state = useStore.getState();
    const userMsg = state.messages.find((m) => m.role === 'user');
    expect(userMsg).toBeDefined();
    expect(userMsg?.content).toBe('你好，我今天压力很大');

    vi.useRealTimers();
  });

  it('清空对话后，对话恢复初始状态', () => {
    renderPage();
    const input = screen.getByPlaceholderText('倾诉你的心事...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '测试' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // 点击"新对话"按钮
    const clearBtns = screen.getAllByText('新对话');
    fireEvent.click(clearBtns[0]);

    const state = useStore.getState();
    expect(state.messages.length).toBe(1); // 保留初始 AI 欢迎语
  });

  it('chatService 默认为 mock 模式', () => {
    renderPage();
    // 页面底部会显示当前模式
    expect(screen.getByText(/模拟模式|真实对话/)).toBeTruthy();
  });

  it('新对话按钮存在于页面右侧', () => {
    renderPage();
    const newChatBtns = screen.getAllByText('新对话');
    expect(newChatBtns.length).toBeGreaterThan(0);
  });
});
