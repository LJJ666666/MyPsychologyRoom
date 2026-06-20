/**
 * Service 层统一入口
 *
 * 组件应通过此文件导入 services，而不是直接操作 store：
 *   import { useStoryService, useCommentService, useUserService } from '../services';
 *
 * 未来接入后端 API 时，只需替换各 service 的实现，组件代码无需改动。
 */
export { useStoryService, createAuthor } from './storyService';
export type { StoryService, StoryType } from './storyService';

export { useCommentService, createCommentAuthor } from './commentService';
export type { CommentService } from './commentService';

export { useUserService } from './userService';
export type { UserService } from './userService';
