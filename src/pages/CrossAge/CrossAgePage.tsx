import React from 'react';
import { MessageCircle } from 'lucide-react';

import { Header, BottomNav } from '../../components/Layout';
import { useCrossAge } from '../../store';
import { AgeGroup } from '../../types';
import { Card, Tag } from '../../components/ui';
import { CrossAgeCard } from '../../components/CrossAge';

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const CrossAgePage: React.FC = () => {
  const {
    topics,
    activeTopicId,
    activePerspective,
    setActiveTopic,
    setActivePerspective,
    getActiveTopic,
  } = useCrossAge();

  const activeTopic = getActiveTopic();

  const crossAgeRightContent = (
    <span className="text-xs text-muted">{topics.length} 个话题</span>
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="跨龄视角" rightContent={crossAgeRightContent} />

      {/* 主内容区域 - 独立滚动 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        <div className="max-w-md mx-auto px-4 py-4">
          {/* Intro Card */}
          <Card className="!bg-gradient-to-br !from-primary/5 !to-secondary/30 !shadow-none !border-0 mb-6">
            <div className="animate-fade-in">
              <h2 className="font-serif text-lg font-medium text-foreground mb-2">走进彼此的世界</h2>
              <p className="text-sm text-muted leading-relaxed">
                同一个话题，不同年龄的人有不同的感受和想法。这里展示多元视角，帮助你理解他人，也被他人理解。
              </p>
            </div>
          </Card>

          {/* Topic Selector */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            {topics.map((topic) => (
              <Tag
                key={topic.id}
                variant={activeTopicId === topic.id ? 'primary' : 'outline'}
                onClick={() => setActiveTopic(topic.id)}
                className="!py-2 !px-4 !text-sm whitespace-nowrap"
              >
                {topic.title}
              </Tag>
            ))}
          </div>

          {/* Topic Content — 使用 CrossAgeCard 组件 */}
          {activeTopic && (
            <CrossAgeCard
              topic={activeTopic}
              activePerspective={activePerspective}
              onPerspectiveClick={setActivePerspective}
              variant="perspective"
              isActive
            />
          )}

          {/* 其他视角预览 */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageCircle size={16} />
              其他视角
            </h4>
            {activeTopic?.perspectives
              .filter((p) => p.ageGroup !== activePerspective)
              .map((perspective) => (
                <Card
                  key={perspective.ageGroup}
                  hoverable
                  padding="md"
                  onClick={() => setActivePerspective(perspective.ageGroup)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{AGE_GROUP_ICONS[perspective.ageGroup]}</span>
                    <span className="text-sm font-medium text-foreground">{perspective.authorName}</span>
                    <span className="text-xs text-muted">{perspective.ageGroupLabel}</span>
                  </div>
                  <p className="text-sm text-muted line-clamp-2">"{perspective.content}"</p>
                </Card>
              ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default CrossAgePage;
