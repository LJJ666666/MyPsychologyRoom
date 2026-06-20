import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { StoryDetailPage } from '../../pages/StoryDetail/StoryDetailPage';
import { useStore } from '../../store';

const renderStoryDetail = (storyId: string) => {
  return render(
    <MemoryRouter initialEntries={[`/story/${storyId}`]}>
      <Routes>
        <Route path="/story/:id" element={<StoryDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('StoryDetailPage - 故事详情页', () => {
  beforeEach(() => {
    const state = useStore.getState();
    if (state.stories.length === 0) {
      state.addStory({
        title: '测试故事',
        content: '这是测试内容',
        type: 'share',
        tags: ['测试'],
        author: { nickname: '测试作者', ageGroup: 'worker', avatar: '🌱' },
      });
    }
  });

  it('渲染页面标题"故事详情"', () => {
    const story = useStore.getState().stories[0];
    renderStoryDetail(story.id);
    expect(screen.getByText('故事详情')).toBeTruthy();
  });

  it('渲染故事标题', () => {
    const story = useStore.getState().stories[0];
    renderStoryDetail(story.id);
    expect(screen.getByText(story.title)).toBeTruthy();
  });

  it('渲染作者昵称', () => {
    const story = useStore.getState().stories[0];
    renderStoryDetail(story.id);
    expect(screen.getByText(story.author.nickname)).toBeTruthy();
  });

  it('显示点赞数量', () => {
    const story = useStore.getState().stories[0];
    renderStoryDetail(story.id);
    const likeCount = story.likes.toString();
    const likeElements = screen.getAllByText(likeCount);
    expect(likeElements.length).toBeGreaterThan(0);
  });

  it('渲染标签（带 # 前缀）', () => {
    const story = useStore.getState().stories[0];
    if (story.tags.length > 0) {
      renderStoryDetail(story.id);
      const tag = story.tags[0];
      const tagElements = screen.getAllByText((content) => content.includes(tag));
      expect(tagElements.length).toBeGreaterThan(0);
    }
  });

  it('渲染评论区', () => {
    const story = useStore.getState().stories[0];
    renderStoryDetail(story.id);
    const commentElements = screen.getAllByText(/留言/);
    expect(commentElements.length).toBeGreaterThan(0);
  });
});

describe('StoryDetailPage - 互动操作', () => {
  beforeEach(() => {
    const state = useStore.getState();
    if (state.stories.length === 0) {
      state.addStory({
        title: '互动测试',
        content: '测试互动内容',
        type: 'vent',
        tags: ['测试'],
        author: { nickname: '作者', ageGroup: 'parent', avatar: '🌻' },
      });
    }
  });

  it('addComment 能在故事中添加评论', () => {
    const story = useStore.getState().stories[0];
    const initialComments = story.comments.length;

    useStore.getState().addComment(story.id, {
      content: '新评论',
      author: { nickname: '评论者', ageGroup: 'teen', avatar: '😊' },
    });

    const updatedStory = useStore.getState().stories.find((s) => s.id === story.id);
    expect(updatedStory?.comments.length).toBe(initialComments + 1);
  });

  it('likeStory 切换点赞状态', () => {
    const story = useStore.getState().stories[0];
    const initialLiked = story.isLiked;

    useStore.getState().likeStory(story.id);
    const afterLike = useStore.getState().stories.find((s) => s.id === story.id);
    expect(afterLike?.isLiked).toBe(!initialLiked);
  });

  it('collectStory 切换收藏状态', () => {
    const story = useStore.getState().stories[0];
    const initialCollected = story.isCollected;

    useStore.getState().collectStory(story.id);
    const afterCollect = useStore.getState().stories.find((s) => s.id === story.id);
    expect(afterCollect?.isCollected).toBe(!initialCollected);
  });
});
