import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Eye } from 'lucide-react';

import { Header } from '../../components/Layout';
import { StoryCard } from '../../components/StoryCard';
import { EmptyState } from '../../components/common';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button } from '../../components/ui';

export const MyCollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { stories, myCollections, collectStory } = useStore();
  const { isLoggedIn } = useAuth();

  // 根据 myCollections 中的 ID 列表从 stories 中取出完整对象
  const collectedStories = myCollections
    .map((id) => stories.find((s) => s.id === id))
    .filter(Boolean)
    .sort((a, b) => {
      // 按收藏时间倒序（ID 列表中后加入的在前面）
      // 简单起见，用 ID 中的时间戳
      const aTime = parseInt((a?.id || '').replace('story-', ''), 10);
      const bTime = parseInt((b?.id || '').replace('story-', ''), 10);
      return bTime - aTime;
    });

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col h-full">
        <Header title="我的收藏" showBack onBack={() => navigate('/profile')} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
          <div className="max-w-md mx-auto px-4 py-12">
            <Card padding="lg" className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔒</span>
              </div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-2">需要登录</h2>
              <p className="text-sm text-muted mb-6">登录后可以查看你收藏的温暖故事</p>
              <Button variant="primary" size="md" onClick={() => navigate('/login')}>
                立即登录
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="我的收藏" showBack onBack={() => navigate('/profile')} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        <div className="max-w-md mx-auto px-4 py-4">
          {collectedStories.length === 0 ? (
            <EmptyState
              icon="📚"
              title="还没有收藏的故事"
              description="去故事广场发现让你温暖的故事吧"
              action={{ label: '浏览故事', onClick: () => navigate('/') }}
            />
          ) : (
            <div className="space-y-4">
              {collectedStories.map((story) => story && (
                <div key={story.id} className="relative group">
                  <StoryCard
                    story={story}
                    onClick={() => navigate(`/story/${story.id}`)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/story/${story.id}`)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-muted bg-surface-muted rounded-full hover:text-foreground transition-colors"
                    >
                      <Eye size={14} />
                      查看详情
                    </button>
                    <button
                      onClick={() => collectStory(story.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-danger bg-danger/10 rounded-full hover:bg-danger/20 transition-colors"
                    >
                      <Bookmark size={14} />
                      取消收藏
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyCollectionsPage;
