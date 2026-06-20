import { useStore } from '../store';
import { Story, AgeGroup, Comment, StoryType, Author } from '../types';

/**
 * StoryService — 故事领域服务层
 *
 * 目前通过 zustand store 实现，未来可无缝切换为 HTTP API。
 * 所有组件应通过此服务获取和操作故事数据，而非直接调用 store。
 */
export function useStoryService() {
  const {
    stories,
    myStories,
    addStory,
    removeMyStory,
    likeStory,
    collectStory,
    addComment,
    selectedAgeGroup,
    setSelectedAgeGroup,
    storyFilter,
    setStoryFilter,
    selectedTag,
    setSelectedTag,
    myCollections,
  } = useStore();

  /** 查询所有故事 */
  const getAllStories = (): Story[] => stories;

  /** 查询当前用户发布的故事 */
  const getMyStories = (): Story[] => myStories;

  /** 查询当前用户收藏的故事 */
  const getMyCollections = (): Story[] =>
    myCollections
      .map((id) => stories.find((s) => s.id === id))
      .filter((s): s is Story => Boolean(s));

  /** 按 ID 查询单个故事 */
  const getStoryById = (id: string): Story | null =>
    stories.find((s) => s.id === id) || null;

  /** 发布新故事 */
  const publishStory = (
    story: Omit<Story, 'id' | 'createdAt' | 'likes' | 'comments' | 'isLiked' | 'isCollected'>
  ): void => addStory(story);

  /** 删除当前用户的故事 */
  const deleteMyStory = (storyId: string): void => removeMyStory(storyId);

  /** 点赞/取消点赞故事 */
  const toggleLike = (storyId: string): void => likeStory(storyId);

  /** 收藏/取消收藏故事 */
  const toggleCollect = (storyId: string): void => collectStory(storyId);

  /** 添加评论 */
  const addStoryComment = (
    storyId: string,
    comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>
  ): void => addComment(storyId, comment);

  /** 查询排序方式 */
  const getStoryFilter = (): 'latest' | 'hottest' => storyFilter;

  /** 设置排序方式 */
  const setStorySort = (filter: 'latest' | 'hottest'): void => setStoryFilter(filter);

  /** 查询当前选中的标签 */
  const getSelectedTag = (): string | null => selectedTag;

  /** 设置标签筛选 */
  const setTagFilter = (tag: string | null): void => setSelectedTag(tag);

  /** 查询当前选中的年龄段 */
  const getSelectedAgeGroup = (): AgeGroup | null => selectedAgeGroup;

  /** 设置年龄段筛选 */
  const setAgeGroupFilter = (ageGroup: AgeGroup | null): void => setSelectedAgeGroup(ageGroup);

  /** 按年龄段 + 标签 + 排序组合过滤 */
  const filterStories = (
    opts: {
      ageGroup?: AgeGroup | null;
      tag?: string | null;
      sort?: 'latest' | 'hottest';
    } = {}
  ): Story[] => {
    const { ageGroup = selectedAgeGroup, tag = selectedTag, sort = storyFilter } = opts;
    return stories
      .filter((s) => !tag || s.tags.includes(tag))
      .filter((s) => !ageGroup || s.author.ageGroup === ageGroup)
      .sort((a, b) => {
        if (sort === 'hottest') return b.likes - a.likes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  return {
    getAllStories,
    getMyStories,
    getMyCollections,
    getStoryById,
    publishStory,
    deleteMyStory,
    toggleLike,
    toggleCollect,
    addStoryComment,
    getStoryFilter,
    setStorySort,
    getSelectedTag,
    setTagFilter,
    getSelectedAgeGroup,
    setAgeGroupFilter,
    filterStories,
  };
}

export type StoryService = ReturnType<typeof useStoryService>;
export default useStoryService;

// 便于在非组件环境直接构造 author 对象（无副作用的纯函数）
export function createAuthor(
  nickname: string,
  ageGroup: AgeGroup,
  avatar?: string
): Author {
  return {
    nickname,
    ageGroup,
    avatar:
      avatar ||
      (ageGroup === 'teen'
        ? '🌱'
        : ageGroup === 'worker'
          ? '🌿'
          : ageGroup === 'parent'
            ? '🌻'
            : '🍀'),
  };
}

export type { StoryType };
