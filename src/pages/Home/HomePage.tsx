import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Clock } from 'lucide-react';
import { Header, BottomNav } from '../../components/Layout';
import { StoryCard } from '../../components/StoryCard';
import { TagFilter, EmptyState } from '../../components/common';
import { useStore } from '../../store';
import { popularTags } from '../../data/mock';

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
    <div className="min-h-screen bg-background pb-20">
      <Header title="心理治疗室" />

      <div className="sticky top-14 bg-background/95 backdrop-blur-sm z-30 px-4 py-3 border-b border-gray-100">
        <div className="max-w-md mx-auto flex items-center gap-4 mb-3">
          <button
            onClick={() => setStoryFilter('latest')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              storyFilter === 'latest'
                ? 'bg-primary text-white'
                : 'text-muted hover:bg-gray-100'
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
                : 'text-muted hover:bg-gray-100'
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

      <main className="max-w-md mx-auto px-4 py-4">
        {filteredStories.length === 0 ? (
          <EmptyState
            icon="📝"
            title="暂无故事"
            description={selectedTag ? '该话题下还没有故事，来发布第一篇吧' : '还没有人发布故事，你是第一个'}
            action={{ label: '发布故事', onClick: () => navigate('/publish') }}
          />
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

      <button
        onClick={() => navigate('/publish')}
        className="fixed right-4 bottom-20 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-40"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <BottomNav />
    </div>
  );
}
