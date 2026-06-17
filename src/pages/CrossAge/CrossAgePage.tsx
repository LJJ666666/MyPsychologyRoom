import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Header } from '../../components/Layout';
import { crossAgeTopics } from '../../data/mock';
import { CrossAgeTopic, AgeGroup, AGE_GROUP_LABELS } from '../../types';

const AGE_GROUP_ORDER: AgeGroup[] = ['teen', 'worker', 'parent', 'elder'];

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const CrossAgePage: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<CrossAgeTopic>(crossAgeTopics[0]);
  const [activePerspective, setActivePerspective] = useState<AgeGroup>('teen');

  const currentPerspective = activeTopic.perspectives.find(
    (p) => p.ageGroup === activePerspective
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="跨龄视角" />

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Intro Card */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary p-5 rounded-2xl mb-6 animate-fade-in">
          <h2 className="font-serif text-lg font-medium text-foreground mb-2">
            走进彼此的世界
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            同一个话题，不同年龄的人有不同的感受和想法。这里展示多元视角，帮助你理解他人，也被他人理解。
          </p>
        </div>

        {/* Topic Selector */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {crossAgeTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => {
                setActiveTopic(topic);
                setActivePerspective('teen');
              }}
              className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTopic.id === topic.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-muted hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>

        {/* Topic Content */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6 animate-fade-in">
          <h3 className="font-serif text-lg font-medium text-foreground mb-2">
            {activeTopic.title}
          </h3>
          <p className="text-sm text-muted mb-4">{activeTopic.description}</p>

          {/* Perspective Tabs */}
          <div className="flex gap-2 border-b border-gray-100 pb-3 mb-4 overflow-x-auto scrollbar-hide">
            {AGE_GROUP_ORDER.map((group) => (
              <button
                key={group}
                onClick={() => setActivePerspective(group)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activePerspective === group
                    ? 'bg-secondary text-foreground'
                    : 'text-muted hover:bg-gray-50'
                }`}
              >
                <span>{AGE_GROUP_ICONS[group]}</span>
                <span>{AGE_GROUP_LABELS[group]}</span>
              </button>
            ))}
          </div>

          {/* Current Perspective Content */}
          {currentPerspective && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                  {AGE_GROUP_ICONS[currentPerspective.ageGroup]}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {currentPerspective.authorName}
                  </div>
                  <div className="text-xs text-muted">
                    {currentPerspective.ageGroupLabel}
                  </div>
                </div>
              </div>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                "{currentPerspective.content}"
              </p>
            </div>
          )}
        </div>

        {/* All Perspectives Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageCircle size={16} />
            其他视角
          </h4>
          {activeTopic.perspectives
            .filter((p) => p.ageGroup !== activePerspective)
            .map((perspective) => (
              <button
                key={perspective.ageGroup}
                onClick={() => setActivePerspective(perspective.ageGroup)}
                className="w-full bg-white rounded-xl p-4 shadow-soft text-left hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{AGE_GROUP_ICONS[perspective.ageGroup]}</span>
                  <span className="text-sm font-medium text-foreground">
                    {perspective.authorName}
                  </span>
                  <span className="text-xs text-muted">
                    {perspective.ageGroupLabel}
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-2">
                  "{perspective.content}"
                </p>
              </button>
            ))}
        </div>
      </main>
    </div>
  );
};
