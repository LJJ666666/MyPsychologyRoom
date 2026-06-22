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
    <div className="flex flex-col h-full">
      <Header title="心理治疗室" rightContent={homeRightContent} />

      {/* 筛选栏 - 固定定位在 Header 下方 */}
      <div className="fixed left-0 right-0 top-14 bg-background/95 backdrop-blur-sm z-30 px-4 py-3 border-b border-divider">
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

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <AgeGroupFilter
              selectedAgeGroup={selectedAgeGroup}
              onSelectAgeGroup={handleAgeGroupChange}
            />
          </div>
        </div>
      </div>

      {/* 主内容区域 - 独立滚动 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background pt-24">
        {/* 故事列表 */}
        <div className="max-w-md mx-auto px-4 py-4">
          {filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-muted text-sm">暂无符合条件的故事</p>
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
        </div>
      </main>

      {/* 悬浮发布按钮 */}
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/publish')}
        className="fixed right-4 bottom-20 w-14 h-14 rounded-full shadow-lg !p-0 z-50"
      >
        <Plus size={28} strokeWidth={2.5} />
      </Button>

      <BottomNav />
    </div>
  );
}
