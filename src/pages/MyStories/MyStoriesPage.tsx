import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Eye } from 'lucide-react';

import { Header } from '../../components/Layout';
import { StoryCard } from '../../components/StoryCard';
import { EmptyState } from '../../components/common';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button } from '../../components/ui';

export const MyStoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { myStories, removeStory, stories } = useStore();
  const { isLoggedIn } = useAuth();

  // 从全量 stories 中取当前状态（确保点赞收藏数是最新的）
  const updatedMyStories = myStories
    .map((ms) => stories.find((s) => s.id === ms.id) || ms)
    .sort((a, b) => {
      // 按 ID（时间戳）倒序，最新的在前面
      const aTime = parseInt(a.id.replace('story-', ''), 10);
      const bTime = parseInt(b.id.replace('story-', ''), 10);
      return bTime - aTime;
    });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="我的故事" showBack onBack={() => navigate('/profile')} />
        <main className="max-w-md mx-auto px-4 py-12">
          <Card padding="lg" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="font-serif text-xl font-medium text-foreground mb-2">需要登录</h2>
            <p className="text-sm text-muted mb-6">登录后可以查看你发布的所有故事</p>
            <Button variant="primary" size="md" onClick={() => navigate('/login')}>
              立即登录
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header title="我的故事" showBack onBack={() => navigate('/profile')} />

      <main className="max-w-md mx-auto px-4 py-4">
        {updatedMyStories.length === 0 ? (
          <EmptyState
            icon="📖"
            title="你还没有发布故事"
            description="写下你的第一个故事，分享给大家吧"
            action={{ label: '发布故事', onClick: () => navigate('/publish') }}
          />
        ) : (
          <div className="space-y-4">
            {updatedMyStories.map((story) => (
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
                    onClick={() => {
                      if (confirm('确定删除这个故事吗？删除后无法恢复。')) {
                        removeStory(story.id);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-danger bg-danger/10 rounded-full hover:bg-danger/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyStoriesPage;
