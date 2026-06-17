import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Clock } from 'lucide-react';
import { Header, BottomNav } from '../../components/Layout';
import { StoryCard } from '../../components/StoryCard';
import { TagFilter } from '../../components/common';
import { useStore } from '../../store';
import { popularTags } from '../../data/mock';
import { Button } from '../../components/ui';

export default function HomePage() {
  const navigate = useNavigate();
  const { stories, storyFilter, setStoryFilter, selectedTag, setSelectedTag } = useStore();

  const filteredStories = stories
    .filter((story) => !selectedTag || story.tags.includes(selectedTag))
    .sort((a, b) => {
      if (storyFilter === 'hottest') {
        return b.likes - a.likes;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="心理治疗室" />

      {/* 筛选栏：最新/最热 + 话题标签 */}
      <div className="sticky top-14 bg-background/95 backdrop-blur-sm z-30 px-4 py-3 border-b border-divider">
        <div className="max-w-md mx-auto flex items-center gap-4 mb-3">
          <button
            onClick={() => setStoryFilter('latest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              storyFilter === 'latest'
                ? 'bg-primary text-white'
                : 'text-muted hover:bg-surface-muted'
            }`}
          >
            <Clock size={16} />
            最新
          </button>
          <button
            onClick={() => setStoryFilter('hottest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              storyFilter === 'hottest'
                ? 'bg-accent text-white'
                : 'text-muted hover:bg-surface-muted'
            }`}
          >
            <TrendingUp size={16} />
            最热
          </button>
        </div>
        <TagFilter
          tags={popularTags.slice(0, 6)}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      </div>

      {/* 故事列表 */}
      <main className="max-w-md mx-auto px-4 py-4">
        {filteredStories.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="font-medium text-foreground mb-2">
              {selectedTag ? '该话题下暂无故事' : '还没有人发布故事'}
            </h3>
            <p className="text-sm text-muted mb-6">
              {selectedTag ? '换个话题看看，或者成为第一个分享者' : '分享你的故事，温暖彼此的心'}
            </p>
            <Button variant="primary" size="md" onClick={() => navigate('/publish')}>
              <Plus size={16} className="mr-1" />
              发布故事
            </Button>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onClick={() => navigate(`/story/${story.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 悬浮发布按钮 */}
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/publish')}
        className="fixed right-4 bottom-20 w-14 h-14 rounded-full shadow-lg !p-0"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Button>

      <BottomNav />
    </div>
  );
}
