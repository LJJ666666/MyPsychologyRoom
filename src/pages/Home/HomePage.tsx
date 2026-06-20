import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, TrendingUp, Clock, Bell } from 'lucide-react';
import { Header, BottomNav } from '../../components/Layout';
import { StoryCard } from '../../components/StoryCard';
import { TagFilter, AgeGroupFilter } from '../../components/common';
import { useStore } from '../../store';
import { popularTags } from '../../data/mock';
import { Button } from '../../components/ui';
import { AgeGroup } from '../../types';

type StoryFilter = 'latest' | 'hottest';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stories, setStoryFilter, setSelectedTag, setSelectedAgeGroup } = useStore();

  // 从 URL 读取筛选参数（storyFilter / selectedTag / selectedAgeGroup 同步到 URL）
  const storyFilter: StoryFilter = searchParams.get('filter') === 'hottest' ? 'hottest' : 'latest';
  const selectedTag: string | null = searchParams.get('tag');
  const selectedAgeGroup: AgeGroup | null =
    (searchParams.get('ageGroup') as AgeGroup) || null;

  // 同步 store（向后兼容）
  React.useEffect(() => {
    setStoryFilter(storyFilter);
    setSelectedTag(selectedTag);
    setSelectedAgeGroup(selectedAgeGroup);
  }, [
    storyFilter,
    selectedTag,
    selectedAgeGroup,
    setStoryFilter,
    setSelectedTag,
    setSelectedAgeGroup,
  ]);

  const handleFilterChange = (filter: StoryFilter) => {
    const next = new URLSearchParams(searchParams);
    if (filter === 'latest') {
      next.delete('filter');
    } else {
      next.set('filter', filter);
    }
    setSearchParams(next);
  };

  const handleTagChange = (tag: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!tag) {
      next.delete('tag');
    } else {
      next.set('tag', tag);
    }
    setSearchParams(next);
  };

  const handleAgeGroupChange = (ageGroup: AgeGroup | null) => {
    const next = new URLSearchParams(searchParams);
    if (!ageGroup) {
      next.delete('ageGroup');
    } else {
      next.set('ageGroup', ageGroup);
    }
    setSearchParams(next);
  };

  // 按 createdAt 倒序（最新），或按点赞数（最热）
  // 同时按标签 + 年龄段双维度筛选
  const filteredStories = stories
    .filter((story) => !selectedTag || story.tags.includes(selectedTag))
    .filter((story) => !selectedAgeGroup || story.author.ageGroup === selectedAgeGroup)
    .sort((a, b) => {
      if (storyFilter === 'hottest') {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // 首页右上角：通知图标（统一规范的可点击图标）
  const homeRightContent = (
    <button
      className="p-2 rounded-full hover:bg-surface-muted transition-colors relative"
      aria-label="通知"
      title="通知"
    >
      <Bell size={22} className="text-foreground" />
      <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
    </button>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="心理治疗室" rightContent={homeRightContent} />

      {/* 筛选栏：最新/最热 + 年龄段 + 话题标签 */}
      <div className="sticky top-14 bg-background/95 backdrop-blur-sm z-30 px-4 py-3 border-b border-divider">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => handleFilterChange('latest')}
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
              onClick={() => handleFilterChange('hottest')}
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
          <div className="mb-2">
            <AgeGroupFilter
              selectedAgeGroup={selectedAgeGroup}
              onSelectAgeGroup={handleAgeGroupChange}
            />
          </div>
          <TagFilter
            tags={popularTags.slice(0, 6)}
            selectedTag={selectedTag}
            onSelectTag={(tag) => handleTagChange(tag === selectedTag ? null : tag)}
          />
        </div>
      </div>

      {/* 故事列表 */}
      <main className="max-w-md mx-auto px-4 py-4">
        {filteredStories.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="font-medium text-foreground mb-2">
              {selectedAgeGroup && selectedTag
                ? '该年龄段和话题下暂无故事'
                : selectedAgeGroup
                  ? '该年龄段还没有故事'
                  : selectedTag
                    ? '该话题下暂无故事'
                    : '还没有人发布故事'}
            </h3>
            <p className="text-sm text-muted mb-6">
              {selectedAgeGroup || selectedTag
                ? '换个筛选条件，或者成为第一个分享者'
                : '分享你的故事，温暖彼此的心'}
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
