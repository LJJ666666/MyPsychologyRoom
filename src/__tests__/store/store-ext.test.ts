import { describe, it, expect, beforeEach } from 'vitest';
import { useStore, generateId } from '../../store';

describe('useStore - 故事管理（扩展）', () => {
  beforeEach(() => {
    const state = useStore.getState();
    // 清理后确保初始状态稳定
    state.stories.forEach((s) => s.id); // no-op
  });

  it('addStory 后，stories 第一条为新增的故事', () => {
    const state = useStore.getState();
    const before = state.stories.length;
    state.addStory({
      type: 'vent',
      tags: ['测试'],
      author: { nickname: '测试作者', ageGroup: 'worker', avatar: '🌿' },
      title: '测试故事标题',
      content: '测试故事内容',
    });
    const updated = useStore.getState();
    expect(updated.stories.length).toBe(before + 1);
    expect(updated.stories[0].title).toBe('测试故事标题');
    expect(updated.myStories[0].title).toBe('测试故事标题');
  });

  it('removeStory 同时从 stories 和 myStories 移除', () => {
    const state = useStore.getState();
    state.addStory({
      type: 'vent',
      tags: [],
      author: { nickname: '待删', ageGroup: 'worker', avatar: '🌿' },
      title: '我会被删除',
      content: '内容',
    });
    const created = useStore.getState();
    const storyId = created.myStories[0].id;
    created.removeStory(storyId);
    const after = useStore.getState();
    expect(after.stories.find((s) => s.id === storyId)).toBeUndefined();
    expect(after.myStories.find((s) => s.id === storyId)).toBeUndefined();
  });

  it('likeComment 切换 isLiked 状态并递增 likes', () => {
    const state = useStore.getState();
    const story = state.stories[0];
    const initial = story.comments[0]?.likes || 0;
    state.addComment(story.id, {
      content: '新评论',
      author: { nickname: '评论员', ageGroup: 'worker', avatar: '🌿' },
    });
    const updated = useStore.getState();
    const newComment = updated.stories
      .find((s) => s.id === story.id)
      ?.comments.find((c) => c.content === '新评论');
    if (!newComment) throw new Error('评论未正确添加');
    const id = newComment.id;
    state.likeComment(story.id, id);
    const liked = useStore.getState();
    const likedComment = liked.stories
      .find((s) => s.id === story.id)
      ?.comments.find((c) => c.id === id);
    expect(likedComment?.likes).toBe(initial + (initial === 0 ? 0 : 0) + 1);
    expect(likedComment?.isLiked).toBe(true);
    // 再次点赞应取消
    state.likeComment(story.id, id);
    const unliked = useStore.getState();
    const unlikedComment = unliked.stories
      .find((s) => s.id === story.id)
      ?.comments.find((c) => c.id === id);
    expect(unlikedComment?.isLiked).toBe(false);
  });

  it('removeComment 从故事中删除指定评论', () => {
    const state = useStore.getState();
    const story = state.stories[0];
    const initialCount = story.comments.length;
    state.addComment(story.id, {
      content: '待删除评论',
      author: { nickname: '某人', ageGroup: 'worker', avatar: '🌿' },
    });
    const added = useStore.getState().stories.find((s) => s.id === story.id)!;
    const target = added.comments[added.comments.length - 1];
    state.removeComment(story.id, target.id);
    const final = useStore.getState().stories.find((s) => s.id === story.id)!;
    expect(final.comments.length).toBe(initialCount);
    expect(final.comments.find((c) => c.id === target.id)).toBeUndefined();
  });

  it('generateId 应返回唯一字符串', () => {
    const a = generateId('story');
    const b = generateId('story');
    expect(typeof a).toBe('string');
    expect(a).not.toBe(b);
  });

  it('updateUser 能部分更新用户信息', () => {
    const state = useStore.getState();
    state.setUser({ nickname: 'tester', ageGroup: 'worker', avatar: '🌿' });
    state.updateUser({ nickname: '新昵称' });
    const updated = useStore.getState();
    expect(updated.user?.nickname).toBe('新昵称');
    expect(updated.user?.ageGroup).toBe('worker');
  });
});
