import React from 'react';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Story, AGE_GROUP_LABELS, STORY_TYPE_LABELS, STORY_TYPE_COLORS } from '../../types';
import { useStore } from '../../store';

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
    <article
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
            {story.author.avatar}
          </div>
          <div>
            <div className="font-medium text-foreground">{story.author.nickname}</div>
            <div className="text-xs text-muted">
              {AGE_GROUP_LABELS[story.author.ageGroup]} · {story.createdAt}
            </div>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${STORY_TYPE_COLORS[story.type]}`}
        >
          {STORY_TYPE_LABELS[story.type]}
        </span>
      </div>

      {/* Content */}
      <h3 className="font-serif text-lg font-medium text-foreground mb-2 leading-relaxed">
        {story.title}
      </h3>
      <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
        {story.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {story.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 bg-gray-100 text-muted text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-50">
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
    </article>
  );
};
