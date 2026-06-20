import { describe, it, expect } from 'vitest';
import { useStore } from '../../store';

describe('useStore - 故事管理', () => {

  it('addStory 应该同时添加到 stories 和 myStories', () => {
    const initialStoryCount = useStore.getState().stories.length;
    const initialMyStoryCount = useStore.getState().myStories.length;

    useStore.getState().addStory({
      title: '测试故事',
      content: '这是一个测试故事的内容',
      type: 'share',
      tags: ['测试'],
      author: { nickname: '测试作者', ageGroup: 'worker', avatar: '🌱' },
    });

    const afterState = useStore.getState();
    expect(afterState.stories.length).toBe(initialStoryCount + 1);
    expect(afterState.myStories.length).toBe(initialMyStoryCount + 1);
    expect(afterState.stories[0].title).toBe('测试故事');
    expect(afterState.myStories[0].title).toBe('测试故事');
  });

  it('collectStory 切换收藏状态，同时同步到 myCollections', () => {
    const story = useStore.getState().stories[0];
    if (!story) return;

    const initialCollections = useStore.getState().myCollections.length;

    // 第一次收藏
    useStore.getState().collectStory(story.id);
    const afterCollect = useStore.getState();
    const collectedStory = afterCollect.stories.find((s) => s.id === story.id);
    expect(collectedStory?.isCollected).toBe(true);
    expect(afterCollect.myCollections.length).toBe(initialCollections + 1);
    expect(afterCollect.myCollections).toContain(story.id);

    // 取消收藏
    useStore.getState().collectStory(story.id);
    const afterUncollect = useStore.getState();
    const uncollectedStory = afterUncollect.stories.find((s) => s.id === story.id);
    expect(uncollectedStory?.isCollected).toBe(false);
    expect(afterUncollect.myCollections.length).toBe(initialCollections);
    expect(afterUncollect.myCollections).not.toContain(story.id);
  });

  it('likeStory 第一次点赞时 likes 增加，再次点赞取消', () => {
    const story = useStore.getState().stories[0];
    if (!story) return;

    const initialLikes = story.likes;
    const initialLiked = story.isLiked;

    useStore.getState().likeStory(story.id);
    const afterFirstLike = useStore.getState().stories.find(s => s.id === story.id);

    if (initialLiked) {
      expect(afterFirstLike?.likes).toBe(initialLikes - 1);
      expect(afterFirstLike?.isLiked).toBe(false);
    } else {
      expect(afterFirstLike?.likes).toBe(initialLikes + 1);
      expect(afterFirstLike?.isLiked).toBe(true);
    }
  });

  it('collectStory 切换收藏状态', () => {
    const story = useStore.getState().stories[0];
    if (!story) return;

    const initialCollected = story.isCollected;

    useStore.getState().collectStory(story.id);
    const after = useStore.getState().stories.find(s => s.id === story.id);
    expect(after?.isCollected).toBe(!initialCollected);
  });

  it('addComment 在故事评论列表中新增一条', () => {
    const story = useStore.getState().stories[0];
    if (!story) return;
    const initialCount = story.comments.length;

    useStore.getState().addComment(story.id, {
      content: '这是一条测试评论',
      author: { nickname: '评论者', ageGroup: 'teen' },
    });

    const after = useStore.getState().stories.find(s => s.id === story.id);
    expect(after?.comments.length).toBe(initialCount + 1);
    expect(after?.comments[initialCount].content).toBe('这是一条测试评论');
  });
});

describe('useStore - 用户状态', () => {
  it('setUser 之后能读取用户信息', () => {
    useStore.getState().setUser({ nickname: '小明', ageGroup: 'parent' });
    const user = useStore.getState().user;
    expect(user?.nickname).toBe('小明');
    expect(user?.ageGroup).toBe('parent');
    expect(user).not.toBeNull();
  });

  it('logout 之后用户为空', () => {
    useStore.getState().setUser({ nickname: '小明', ageGroup: 'parent' });
    useStore.getState().logout();
    expect(useStore.getState().user).toBeNull();
  });
});

describe('useStore - AI对话', () => {
  it('addMessage 能添加用户消息', () => {
    const initialCount = useStore.getState().messages.length;

    useStore.getState().addMessage({
      role: 'user',
      content: '你好，我想倾诉一下',
    });

    const msgs = useStore.getState().messages;
    expect(msgs.length).toBe(initialCount + 1);
    expect(msgs[msgs.length - 1].content).toBe('你好，我想倾诉一下');
    expect(msgs[msgs.length - 1].role).toBe('user');
  });
});

describe('useStore - UI 状态', () => {
  it('setActiveTab 切换后状态正确', () => {
    useStore.getState().setActiveTab('ai');
    expect(useStore.getState().activeTab).toBe('ai');

    useStore.getState().setActiveTab('profile');
    expect(useStore.getState().activeTab).toBe('profile');
  });
});
