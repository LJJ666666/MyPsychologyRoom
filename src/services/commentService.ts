import { useStore } from '../store';
import { Comment, AgeGroup } from '../types';

/**
 * CommentService — 评论领域服务层
 *
 * 通过 storyService.addStoryComment 添加评论也可，
 * 此服务专注于评论查询和派生数据。
 */
export function useCommentService() {
  const { stories, addComment } = useStore();

  /** 查询某条故事的所有评论 */
  const getCommentsByStoryId = (storyId: string): Comment[] => {
    const story = stories.find((s) => s.id === storyId);
    return story ? [...story.comments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) : [];
  };

  /** 获取评论数 */
  const getCommentCount = (storyId: string): number => {
    const story = stories.find((s) => s.id === storyId);
    return story ? story.comments.length : 0;
  };

  /** 添加评论（转发到 store 的 addComment） */
  const addStoryComment = (
    storyId: string,
    comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>
  ): void => addComment(storyId, comment);

  return {
    getCommentsByStoryId,
    getCommentCount,
    addStoryComment,
  };
}

export type CommentService = ReturnType<typeof useCommentService>;
export default useCommentService;

// 便捷工厂 — 创建评论作者对象
export function createCommentAuthor(
  nickname: string,
  ageGroup: AgeGroup
): { nickname: string; ageGroup: AgeGroup; avatar: string } {
  return {
    nickname,
    ageGroup,
    avatar:
      ageGroup === 'teen'
        ? '🌱'
        : ageGroup === 'worker'
          ? '🌿'
          : ageGroup === 'parent'
            ? '🌻'
            : '🍀',
  };
}
