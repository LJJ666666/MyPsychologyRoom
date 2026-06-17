import React, { useState } from 'react';
import {
  User,
  BookOpen,
  Bookmark,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Header } from '../../components/Layout';
import { EmptyState } from '../../components/common';
import { StoryCard } from '../../components/StoryCard';
import { useStore } from '../../store';
import { AGE_GROUP_LABELS, AgeGroup } from '../../types';

type TabType = 'stories' | 'collections';

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const ProfilePage: React.FC<{ onStoryClick?: (storyId: string) => void }> = ({
  onStoryClick,
}) => {
  const { user, myStories, stories, logout } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('stories');

  const collectedStories = stories.filter((story) => story.isCollected);

  const menuItems = [
    { icon: User, label: '个人信息', onClick: () => {} },
    { icon: BookOpen, label: '我的故事', onClick: () => setActiveTab('stories') },
    { icon: Bookmark, label: '我的收藏', onClick: () => setActiveTab('collections') },
    { icon: Settings, label: '设置', onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="个人中心" />

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl">
              {user?.ageGroup ? AGE_GROUP_ICONS[user.ageGroup] : '😊'}
            </div>
            <div className="flex-1">
              {user ? (
                <>
                  <h2 className="font-serif text-lg font-medium text-foreground">
                    {user.nickname}
                  </h2>
                  <p className="text-sm text-muted">
                    {AGE_GROUP_LABELS[user.ageGroup]}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-serif text-lg font-medium text-foreground">
                    游客用户
                  </h2>
                  <p className="text-sm text-muted">登录后享受更多功能</p>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-5 pt-4 border-t border-gray-100">
            <div className="text-center flex-1">
              <div className="text-xl font-semibold text-foreground">
                {myStories.length}
              </div>
              <div className="text-xs text-muted">发布故事</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xl font-semibold text-foreground">
                {collectedStories.length}
              </div>
              <div className="text-xs text-muted">收藏</div>
            </div>
            <div className="text-center flex-1">
              <div className="text-xl font-semibold text-foreground">
                {myStories.reduce((acc, s) => acc + s.likes, 0)}
              </div>
              <div className="text-xs text-muted">获得温暖</div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-100 mb-4">
            <button
              onClick={() => setActiveTab('stories')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'stories'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted'
              }`}
            >
              我的故事
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'collections'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted'
              }`}
            >
              我的收藏
            </button>
          </div>

          {activeTab === 'stories' && (
            <div className="space-y-4 stagger-children">
              {myStories.length === 0 ? (
                <EmptyState
                  icon="📝"
                  title="还没有发布故事"
                  description="在这里分享你的故事，让更多人听到你的声音"
                />
              ) : (
                myStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => onStoryClick?.(story.id)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-4 stagger-children">
              {collectedStories.length === 0 ? (
                <EmptyState
                  icon="📚"
                  title="还没有收藏"
                  description="在故事广场收藏让你触动的内容"
                />
              ) : (
                collectedStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    onClick={() => onStoryClick?.(story.id)}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <item.icon size={20} className="text-muted" />
              <span className="flex-1 text-left text-sm text-foreground">
                {item.label}
              </span>
              <ChevronRight size={18} className="text-muted" />
            </button>
          ))}
        </div>

        {/* Logout */}
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 mt-4 py-3 text-sm text-muted hover:text-red-500 transition-colors"
          >
            <LogOut size={18} />
            退出登录
          </button>
        )}
      </main>
    </div>
  );
};
