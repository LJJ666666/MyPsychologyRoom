import React from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Story, AGE_GROUP_LABELS, STORY_TYPE_LABELS } from '../../types';
import { Card, Avatar, Tag, Badge, Divider } from '../ui';
import { useStore } from '../../store';
import { formatRelativeTime } from '../../utils/formatTime';

interface StoryCardProps {
  story: Story;
  onClick?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  const { likeStory, collectStory } = useStore();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeStory(story.id);
  };

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    collectStory(story.id);
  };

  return (
    <Card hoverable onClick={onClick}>
      {/* Header: 头像 + 昵称 + 故事类型 Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar variant="secondary">{story.author.avatar}</Avatar>
          <div>
            <div className="font-medium text-foreground text-sm">{story.author.nickname}</div>
            <div className="text-2xs text-muted">
              {AGE_GROUP_LABELS[story.author.ageGroup]} · {formatRelativeTime(story.createdAt)}
            </div>
          </div>
        </div>
        <Badge variant={story.type === 'vent' ? 'accent' : 'primary'}>
          {STORY_TYPE_LABELS[story.type]}
        </Badge>
      </div>

      {/* Content: 标题 + 正文摘要 + 话题标签 */}
      <h3 className="font-serif text-lg font-medium text-foreground mb-2 leading-snug">
        {story.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
        {story.content}
      </p>

      {story.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags.map((tag) => (
            <Tag key={tag} size="sm" variant="outline">
              #{tag}
            </Tag>
          ))}
        </div>
      )}

      {/* Actions: 点赞 + 评论 + 收藏 */}
      <Divider />
      <div className="flex items-center gap-6 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            story.isLiked ? 'text-accent' : 'text-muted hover:text-accent'
          }`}
        >
          <Heart
            size={18}
            fill={story.isLiked ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
          <span>{story.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors">
          <MessageCircle size={18} strokeWidth={2} />
          <span>{story.comments.length}</span>
        </button>
        <button
          onClick={handleCollect}
          className={`flex items-center gap-1.5 text-sm ml-auto transition-colors ${
            story.isCollected ? 'text-primary' : 'text-muted hover:text-primary'
          }`}
        >
          <Bookmark
            size={18}
            fill={story.isCollected ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>
      </div>
    </Card>
  );
};

export default StoryCard;
