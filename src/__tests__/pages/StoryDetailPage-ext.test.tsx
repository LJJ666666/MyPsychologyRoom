import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StoryDetailPage } from '../../pages/StoryDetail/StoryDetailPage';
import { useStore } from '../../store';

const renderDetail = (storyId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/story/${storyId}`]}>
      <Routes>
        <Route path="/story/:id" element={<StoryDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('StoryDetailPage - 评论互动扩展', () => {
  let testStoryId: string;

  beforeEach(() => {
    const state = useStore.getState();
    // 先登录用户
    state.setUser({
      nickname: '当前用户',
      ageGroup: 'worker',
      avatar: '🌿',
    });

    // 添加一条包含评论的新故事，避免依赖 mock 数据的初始状态
    state.addStory({
      type: 'vent',
      tags: ['测试'],
      author: { nickname: '当前用户', ageGroup: 'worker', avatar: '🌿' },
      title: '评论测试标题',
      content: '评论测试正文',
    });

    const updated = useStore.getState();
    // 找到刚添加故事的 id —— 它位于 stories 列表第一条
    testStoryId = updated.stories[0].id;

    // 为该故事添加一条评论（由当前用户添加，便于测试删除）
    state.addComment(testStoryId, {
      content: '评论由当前用户发布',
      author: { nickname: '当前用户', ageGroup: 'worker', avatar: '🌿' },
    });
  });

  it('渲染故事详情页', () => {
    renderDetail(testStoryId);
    expect(screen.getByText('故事详情')).toBeTruthy();
    expect(screen.getByText('评论测试标题')).toBeTruthy();
  });

  it('评论区支持点赞，点击后点赞数 +1', () => {
    renderDetail(testStoryId);

    // 先获取初始评论 —— 我们新加的那条评论内容是确定的
    const initialStory = useStore.getState().stories.find((s) => s.id === testStoryId)!;
    const initialCount = initialStory.comments.find((c) => c.content === '评论由当前用户发布')?.likes || 0;

    // 取所有 button 并找到最底部的「点赞」样式按钮 —— 评论区点赞按钮 text-muted hover:text-accent
    const buttons = Array.from(document.querySelectorAll('button'));
    // 我们取第 4 个（第一个是返回、第二个是故事点赞、第三个是收藏、第四个是分享按钮后再到评论区点赞 —— 这里我们只找有 hover:text-accent 类）
    const likeButton = buttons.find(
      (b) => (b.className || '').includes('text-muted') && (b.className || '').includes('hover:text-accent')
    ) as HTMLButtonElement | undefined;

    if (likeButton) {
      fireEvent.click(likeButton);
    }

    // 确认评论的 likes 变化
    const finalStory = useStore.getState().stories.find((s) => s.id === testStoryId);
    const target = finalStory?.comments.find((c) => c.content === '评论由当前用户发布');
    expect(target?.likes).toBe(initialCount + 1);
    expect(target?.isLiked).toBe(true);
  });

  it('评论区能删除自己发布的评论', () => {
    renderDetail(testStoryId);

    // 初始评论数
    const initialStory = useStore.getState().stories.find((s) => s.id === testStoryId)!;
    const initial = initialStory.comments.length;
    expect(initial).toBe(1);

    // 模拟「confirm」返回 true
    const originalConfirm = window.confirm;
    window.confirm = () => true;

    // 点击「删除」按钮
    const deleteButtons = Array.from(document.querySelectorAll('button')).filter((b) =>
      (b.textContent || '').includes('删除')
    );
    // 我们只关心故事详情页的「删除评论」按钮 —— 点击第一个匹配到的
    if (deleteButtons.length > 0) {
      act(() => {
        fireEvent.click(deleteButtons[0]);
      });
    }

    const finalStory = useStore.getState().stories.find((s) => s.id === testStoryId);
    expect(finalStory?.comments.length).toBe(initial - 1);

    window.confirm = originalConfirm;
  });
});
