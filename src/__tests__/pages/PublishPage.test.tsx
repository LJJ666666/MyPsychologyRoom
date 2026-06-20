import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublishPage from '../../pages/Publish/PublishPage';
import { useStore } from '../../store';

const renderPublish = (initialEntries = ['/publish']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <PublishPage />
    </MemoryRouter>
  );
};

// 确保 useAuth 环境存在 —— 此处我们直接用 store.setUser 来模拟「登录」
describe('PublishPage - 故事发布页', () => {
  beforeEach(() => {
    // 确保用户已登录 —— 我们通过 store.setUser 设置 user，
    // useAuth 内部会读取 useStore().user，因此 setUser 可让 isLoggedIn 变为 true
    const state = useStore.getState();
    state.setUser({
      nickname: '测试昵称',
      ageGroup: 'worker',
      avatar: '🌿',
    });
  });

  it('渲染发布页，出现"选择故事类型"标题', () => {
    renderPublish();
    expect(screen.getByText('选择故事类型')).toBeTruthy();
  });

  it('能选择故事类型并进入内容步骤', () => {
    const { container } = renderPublish();

    // 选择类型卡片 —— 点击最外层的可点击元素
    const cards = container.querySelectorAll('.bg-surface');
    const ventCard = cards[0]; // 第一个卡片
    fireEvent.click(ventCard);

    // 步骤变化：检查是否有 textarea（进入第二步才会出现）
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
  });

  it('输入标题和正文后可以发布', () => {
    renderPublish();

    // Step 1: 选择「倾诉」类型 —— 点击「倾诉」
    const ventText = screen.getByText('倾诉');
    fireEvent.click(ventText);

    // Step 2: 填写标题 + 正文
    const titleInput = document.querySelector('input[placeholder*="一句话"]') as HTMLInputElement;
    expect(titleInput).toBeTruthy();
    fireEvent.change(titleInput, { target: { value: '这是测试标题' } });
    expect(titleInput.value).toBe('这是测试标题');

    const contentInput = document.querySelector('textarea') as HTMLTextAreaElement;
    expect(contentInput).toBeTruthy();
    fireEvent.change(contentInput, { target: { value: '这是测试正文' } });

    // 进入 info 步骤
    const nextBtn = screen.getByText('下一步');
    fireEvent.click(nextBtn);

    // 点击发布
    const publishBtn = screen.getByText('发布故事');
    expect(publishBtn).toBeTruthy();
    act(() => {
      fireEvent.click(publishBtn);
    });

    // 发布后 myStories 中出现新故事
    const { myStories } = useStore.getState();
    const latest = myStories[0];
    expect(latest).toBeDefined();
    expect(latest?.title).toBe('这是测试标题');
  });

  it('未选择类型时停留在第一步', () => {
    renderPublish();
    expect(screen.getByText('倾诉')).toBeTruthy();
    expect(screen.queryByText('写下你的故事')).toBeFalsy();
  });

  it('发布后会同步更新 stories 列表', () => {
    renderPublish();

    const ventText = screen.getByText('倾诉');
    fireEvent.click(ventText);

    const titleInput = document.querySelector('input[placeholder*="一句话"]') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: '同步测试' } });

    const contentInput = document.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(contentInput, { target: { value: '正文内容同步' } });

    fireEvent.click(screen.getByText('下一步'));
    act(() => {
      fireEvent.click(screen.getByText('发布故事'));
    });

    const { stories } = useStore.getState();
    expect(stories[0].title).toBe('同步测试');
  });
});
