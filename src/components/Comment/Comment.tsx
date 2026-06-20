import React from 'react';
import { Heart, Trash2, MessageCircle } from 'lucide-react';
import { Comment as CommentType, AGE_GROUP_LABELS } from '../../types';
import { formatRelativeTime } from '../../utils/formatTime';

interface CommentProps {
  comment: CommentType;
  onLike?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  canDelete?: boolean;
}

const AGE_GROUP_ICON: Record<string, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const Comment: React.FC<CommentProps> = ({ comment, onLike, onDelete, onReply, canDelete }) => {
  const isLiked = !!comment.isLiked;
  return (
    <div className="flex gap-3 py-4 border-b border-divider last:border-0 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm flex-shrink-0">
        {AGE_GROUP_ICON[comment.author.ageGroup] || '🌿'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-foreground">{comment.author.nickname}</span>
          <span className="text-xs text-muted">
            {AGE_GROUP_LABELS[comment.author.ageGroup as keyof typeof AGE_GROUP_LABELS]}
          </span>
          <span className="text-xs text-muted">·</span>
          <span className="text-xs text-muted">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-xs transition-colors ${
              isLiked ? 'text-accent' : 'text-muted hover:text-accent'
            }`}
          >
            <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{comment.likes}</span>
          </button>
          {onReply && (
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
            >
              <MessageCircle size={14} />
              <span>回复</span>
            </button>
          )}
          {canDelete && onDelete && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-xs text-muted hover:text-danger transition-colors"
            >
              <Trash2 size={14} />
              <span>删除</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
