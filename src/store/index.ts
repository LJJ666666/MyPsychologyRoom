import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Story, Comment, Message, AgeGroup } from '../types';
import { mockStories } from '../data/mock';

interface AppState {
  // Stories
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'likes' | 'comments' | 'isLiked' | 'isCollected'>) => void;
  likeStory: (storyId: string) => void;
  collectStory: (storyId: string) => void;
  addComment: (storyId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;

  // User
  user: {
    nickname: string;
    ageGroup: AgeGroup;
    isLoggedIn: boolean;
  } | null;
  setUser: (user: { nickname: string; ageGroup: AgeGroup }) => void;
  logout: () => void;

  // My stories
  myStories: Story[];
  addMyStory: (story: Story) => void;
  removeMyStory: (storyId: string) => void;

  // My collections
  myCollections: string[];
  addCollection: (storyId: string) => void;
  removeCollection: (storyId: string) => void;

  // AI Chat
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // UI
  activeTab: 'home' | 'ai' | 'cross-age' | 'profile';
  setActiveTab: (tab: 'home' | 'ai' | 'cross-age' | 'profile') => void;
  storyFilter: 'latest' | 'hottest';
  setStoryFilter: (filter: 'latest' | 'hottest') => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Stories
      stories: mockStories,
      addStory: (story) => {
        const newStory: Story = {
          ...story,
          id: `story-${Date.now()}`,
          createdAt: '刚刚',
          likes: 0,
          comments: [],
          isLiked: false,
          isCollected: false,
        };
        set((state) => ({
          stories: [newStory, ...state.stories],
        }));
      },
      likeStory: (storyId) => {
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
        }));
      },
      collectStory: (storyId) => {
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? { ...story, isCollected: !story.isCollected }
              : story
          ),
        }));
      },
      addComment: (storyId, comment) => {
        const newComment: Comment = {
          ...comment,
          id: `comment-${Date.now()}`,
          createdAt: '刚刚',
          likes: 0,
        };
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? { ...story, comments: [...story.comments, newComment] }
              : story
          ),
        }));
      },

      // User
      user: null,
      setUser: (user) => set({ user: { ...user, isLoggedIn: true } }),
      logout: () => set({ user: null }),

      // My stories
      myStories: [],
      addMyStory: (story) => set((state) => ({ myStories: [story, ...state.myStories] })),
      removeMyStory: (storyId) =>
        set((state) => ({ myStories: state.myStories.filter((s) => s.id !== storyId) })),

      // My collections
      myCollections: [],
      addCollection: (storyId) =>
        set((state) => ({ myCollections: [...state.myCollections, storyId] })),
      removeCollection: (storyId) =>
        set((state) => ({
          myCollections: state.myCollections.filter((id) => id !== storyId),
        })),

      // AI Chat
      messages: [
        {
          id: 'ai-greeting',
          role: 'ai',
          content: '你好，欢迎来到这里。我是AI心理助手，很高兴你能信任我，愿意说说你的事情。',
          timestamp: new Date().toISOString(),
        },
      ],
      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, newMessage] }));
      },
      clearMessages: () =>
        set({
          messages: [
            {
              id: 'ai-greeting-reset',
              role: 'ai',
              content: '你好，欢迎来到这里。我是AI心理助手，很高兴你能信任我，愿意说说你的事情。',
              timestamp: new Date().toISOString(),
            },
          ],
        }),

      // UI
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      storyFilter: 'latest',
      setStoryFilter: (filter) => set({ storyFilter: filter }),
      selectedTag: null,
      setSelectedTag: (tag) => set({ selectedTag: tag }),
    }),
    {
      name: 'psychology-room-storage',
      partialize: (state) => ({
        user: state.user,
        myStories: state.myStories,
        myCollections: state.myCollections,
        messages: state.messages,
      }),
    }
  )
);
