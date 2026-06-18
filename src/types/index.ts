export type AgeGroup = 'teen' | 'worker' | 'parent' | 'elder';

export type StoryType = 'share' | 'vent' | 'help';

export interface Author {
  nickname: string;
  ageGroup: AgeGroup;
  avatar: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    nickname: string;
    ageGroup: AgeGroup;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  type: StoryType;
  tags: string[];
  author: Author;
  createdAt: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
  isCollected: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
}

export interface CrossAgeTopic {
  id: string;
  title: string;
  description: string;
  perspectives: {
    ageGroup: AgeGroup;
    ageGroupLabel: string;
    content: string;
    authorName: string;
  }[];
}

export interface User {
  id: string;
  nickname: string;
  ageGroup: AgeGroup;
  email: string | null;
  createdAt: string;
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  teen: '青少年',
  worker: '职场人',
  parent: '父母',
  elder: '中老年',
};

export const STORY_TYPE_LABELS: Record<StoryType, string> = {
  share: '分享',
  vent: '倾诉',
  help: '求助',
};

export const STORY_TYPE_COLORS: Record<StoryType, string> = {
  share: 'bg-primary/10 text-primary',
  vent: 'bg-accent/10 text-accent',
  help: 'bg-blue-500/10 text-blue-500',
};
