import React from 'react';
import { Card, Avatar } from '../ui';
import { CrossAgeTopic, AgeGroup, AGE_GROUP_LABELS } from '../../types';

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export interface CrossAgeCardProps {
  topic: CrossAgeTopic;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'topic' | 'perspective';
  activePerspective?: AgeGroup;
  onPerspectiveClick?: (perspective: AgeGroup) => void;
}

export const CrossAgeCard: React.FC<CrossAgeCardProps> = ({
  topic,
  isActive = false,
  onClick,
  variant = 'topic',
  activePerspective,
  onPerspectiveClick,
}) => {
  if (variant === 'perspective') {
    const perspective = topic.perspectives.find((p) => p.ageGroup === activePerspective);
    if (!perspective) return null;
    return (
      <Card padding="lg" className="animate-fade-in">
        <div>
          <h3 className="font-serif text-lg font-medium text-foreground mb-2">{topic.title}</h3>
          <p className="text-sm text-muted mb-4">{topic.description}</p>

          <div className="flex gap-2 pb-3 mb-4 overflow-x-auto scrollbar-hide">
            {topic.perspectives.map((p) => (
              <button
                key={p.ageGroup}
                onClick={() => onPerspectiveClick?.(p.ageGroup)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm whitespace-nowrap rounded-full transition-colors ${
                  p.ageGroup === activePerspective
                    ? 'bg-primary text-foreground-on-primary'
                    : 'bg-surface-muted text-foreground hover:bg-secondary'
                }`}
              >
                <span>{AGE_GROUP_ICONS[p.ageGroup]}</span>
                <span>{AGE_GROUP_LABELS[p.ageGroup]}</span>
              </button>
            ))}
          </div>

          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <Avatar size="md" variant="secondary">
                {AGE_GROUP_ICONS[perspective.ageGroup]}
              </Avatar>
              <div>
                <div className="font-medium text-foreground">{perspective.authorName}</div>
                <div className="text-xs text-muted">{perspective.ageGroupLabel}</div>
              </div>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              "{perspective.content}"
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      padding="md"
      hoverable
      onClick={onClick}
      className={isActive ? 'ring-2 ring-primary' : ''}
    >
      <div className="flex items-start gap-3">
        <Avatar size="md" variant="secondary">
          💭
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-foreground text-sm mb-1">{topic.title}</div>
          <p className="text-xs text-muted line-clamp-2">{topic.description}</p>
        </div>
      </div>
    </Card>
  );
};

export default CrossAgeCard;
