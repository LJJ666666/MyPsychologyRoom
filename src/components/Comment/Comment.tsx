import React from 'react';
import { Heart } from 'lucide-react';
import { Comment as CommentType, AGE_GROUP_LABELS } from '../../types';

interface CommentProps {
  comment: CommentType;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-50 last:border-0 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm flex-shrink-0">
        {comment.author.ageGroup === 'teen' && '🌱'}
        {comment.author.ageGroup === 'worker' && '🌿'}
        {comment.author.ageGroup === 'parent' && '🌻'}
        {comment.author.ageGroup === 'elder' && '🍀'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-foreground">
            {comment.author.nickname}
          </span>
          <span className="text-xs text-muted">
            {AGE_GROUP_LABELS[comment.author.ageGroup as keyof typeof AGE_GROUP_LABELS]}
          </span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">{comment.createdAt}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-2">
          {comment.content}
        </p>
        <button className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors">
          <Heart size={14} />
          <span>{comment.likes}</span>
        </button>
      </div>
    </div>
  );
};
