import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Story, Comment, Message, User, CrossAgeTopic, AgeGroup } from '../types';
import { mockStories, crossAgeTopics } from '../data/mock';

// 通用 ID 生成器（问题2：Date.now() -> crypto.randomUUID()）
export function generateId(prefix: string): string {
  const core =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return `${prefix}-${core}`;
}

// === 类型定义：按领域组织 ===

interface StoriesDomain {
  stories: Story[];
  myStories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'likes' | 'comments' | 'isLiked' | 'isCollected'>) => void;
  removeStory: (storyId: string) => void;
  likeStory: (storyId: string) => void;
  addComment: (storyId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  likeComment: (storyId: string, commentId: string) => void;
  removeComment: (storyId: string, commentId: string) => void;
}

interface CollectionsDomain {
  myCollections: string[];
  collectStory: (storyId: string) => void;
  addCollection: (storyId: string) => void;
  removeCollection: (storyId: string) => void;
}

interface UserDomain {
  user: User | null;
  setUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (partialUser: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  logout: () => void;
}

interface ChatDomain {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

interface UIDomain {
  activeTab: 'home' | 'ai' | 'cross-age' | 'profile';
  setActiveTab: (tab: 'home' | 'ai' | 'cross-age' | 'profile') => void;
  storyFilter: 'latest' | 'hottest';
  setStoryFilter: (filter: 'latest' | 'hottest') => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedAgeGroup: AgeGroup | null;
  setSelectedAgeGroup: (ageGroup: AgeGroup | null) => void;
}

interface CrossAgeDomain {
  topics: CrossAgeTopic[];
  activeTopicId: string;
  activePerspective: AgeGroup;
  setActiveTopic: (topicId: string) => void;
  setActivePerspective: (perspective: AgeGroup) => void;
  getActiveTopic: () => CrossAgeTopic | undefined;
  getActivePerspective: () =>
    | { ageGroup: AgeGroup; ageGroupLabel: string; content: string; authorName: string }
    | undefined;
}

export interface AppStore
  extends StoriesDomain,
    CollectionsDomain,
    UserDomain,
    ChatDomain,
    UIDomain,
    CrossAgeDomain {}

// === 默认状态与 action 实现 ===

const initialAI: Message = {
  id: generateId('msg'),
  role: 'ai',
  content:
    '你好，欢迎来到这里。我是AI心理助手，很高兴你能信任我，愿意说说你的事情。',
  timestamp: new Date().toISOString(),
};

export const useStore = create<AppStore>()(
  // @ts-expect-error - Zustand persist 与 strict types 的兼容性问题，运行时行为正确
  persist(
    (set) => ({
      // —— 故事领域（StoriesDomain）——
      stories: mockStories,
      myStories: [],
      addStory: (story) => {
        const newStory: Story = {
          ...story,
          id: generateId('story'),
          createdAt: new Date().toISOString(),
          likes: 0,
          comments: [],
          isLiked: false,
          isCollected: false,
        };
        set((state) => ({
          stories: [newStory, ...state.stories],
          myStories: [newStory, ...state.myStories],
        }));
      },
      removeStory: (storyId) =>
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== storyId),
          myStories: state.myStories.filter((s) => s.id !== storyId),
        })),
      likeStory: (storyId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? {
                  ...story,
                  isLiked: !story.isLiked,
                  likes: story.isLiked ? story.likes - 1 : story.likes + 1,
                }
              : story
          ),
        })),
      addComment: (storyId, comment) => {
        const newComment: Comment = {
          ...comment,
          id: generateId('comment'),
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false,
        };
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? { ...story, comments: [...story.comments, newComment] }
              : story
          ),
        }));
      },
      likeComment: (storyId, commentId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? {
                  ...story,
                  comments: story.comments.map((c) =>
                    c.id === commentId
                      ? {
                          ...c,
                          isLiked: !c.isLiked,
                          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
                        }
                      : c
                  ),
                }
              : story
          ),
        })),
      removeComment: (storyId, commentId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? { ...story, comments: story.comments.filter((c) => c.id !== commentId) }
              : story
          ),
        })),

      // —— 收藏领域（CollectionsDomain）——
      myCollections: [],
      collectStory: (storyId) =>
        set((state) => {
          const isCollected = state.myCollections.includes(storyId);
          return {
            stories: state.stories.map((story) =>
              story.id === storyId ? { ...story, isCollected: !isCollected } : story
            ),
            myCollections: isCollected
              ? state.myCollections.filter((id) => id !== storyId)
              : [...state.myCollections, storyId],
          };
        }),
      addCollection: (storyId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId ? { ...story, isCollected: true } : story
          ),
          myCollections: state.myCollections.includes(storyId)
            ? state.myCollections
            : [...state.myCollections, storyId],
        })),
      removeCollection: (storyId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId ? { ...story, isCollected: false } : story
          ),
          myCollections: state.myCollections.filter((id) => id !== storyId),
        })),

      // —— 用户领域（UserDomain）——
      user: null,
      setUser: (user) =>
        set({
          user: {
            ...user,
            id: generateId('user'),
            createdAt: new Date().toISOString(),
          },
        }),
      updateUser: (partialUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : state.user,
        })),
      logout: () => set({ user: null }),

      // —— 聊天领域（ChatDomain）——
      messages: [initialAI],
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: generateId('msg'),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },
      clearMessages: () => set({ messages: [initialAI] }),

      // —— UI 领域（UIDomain）——
      activeTab: 'home' as const,
      setActiveTab: (tab) => set({ activeTab: tab }),
      storyFilter: 'latest' as const,
      setStoryFilter: (filter) => set({ storyFilter: filter }),
      selectedTag: null,
      setSelectedTag: (tag) => set({ selectedTag: tag }),
      selectedAgeGroup: null,
      setSelectedAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),

      // —— 跨龄视角领域（CrossAgeDomain）——
      topics: crossAgeTopics,
      activeTopicId: crossAgeTopics[0]?.id || '',
      activePerspective: 'teen' as const,
      setActiveTopic: (topicId) => set({ activeTopicId: topicId, activePerspective: 'teen' }),
      setActivePerspective: (perspective) => set({ activePerspective: perspective }),
      getActiveTopic: () => {
        const state = useStore.getState();
        return state.topics.find((t) => t.id === state.activeTopicId);
      },
      getActivePerspective: () => {
        const state = useStore.getState();
        const topic = state.topics.find((t) => t.id === state.activeTopicId);
        return topic?.perspectives.find((p) => p.ageGroup === state.activePerspective);
      },
    }),
    {
      name: 'psychology-room-storage',
      partialize: (state) => ({
        stories: state.stories,
        myStories: state.myStories,
        myCollections: state.myCollections,
        user: state.user,
        messages: state.messages,
      }),
    }
  )
);

// 各领域 selector hooks（按需使用）
export const useStories = () => {
  const { stories, myStories, addStory, removeStory, likeStory, addComment, likeComment, removeComment } = useStore();
  return { stories, myStories, addStory, removeStory, likeStory, addComment, likeComment, removeComment };
};

export const useCollections = () => {
  const { myCollections, collectStory, addCollection, removeCollection } = useStore();
  return { myCollections, collectStory, addCollection, removeCollection };
};

export const useUser = () => {
  const { user, setUser, updateUser, logout } = useStore();
  return { user, setUser, updateUser, logout };
};

export const useChat = () => {
  const { messages, addMessage, clearMessages } = useStore();
  return { messages, addMessage, clearMessages };
};

export const useUI = () => {
  const {
    activeTab,
    setActiveTab,
    storyFilter,
    setStoryFilter,
    selectedTag,
    setSelectedTag,
    selectedAgeGroup,
    setSelectedAgeGroup,
  } = useStore();
  return {
    activeTab,
    setActiveTab,
    storyFilter,
    setStoryFilter,
    selectedTag,
    setSelectedTag,
    selectedAgeGroup,
    setSelectedAgeGroup,
  };
};

export const useCrossAge = () => {
  const {
    topics,
    activeTopicId,
    activePerspective,
    setActiveTopic,
    setActivePerspective,
    getActiveTopic,
    getActivePerspective,
  } = useStore();
  return {
    topics,
    activeTopicId,
    activePerspective,
    setActiveTopic,
    setActivePerspective,
    getActiveTopic,
    getActivePerspective,
  };
};

export default useStore;
