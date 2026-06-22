import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { Header } from '../../components/Layout';
import { Comment } from '../../components/Comment';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { AGE_GROUP_LABELS, STORY_TYPE_LABELS } from '../../types';
import { Card, Avatar, Tag, Badge, Button } from '../../components/ui';
import { EmptyState } from '../../components/common';
import { formatRelativeTime } from '../../utils/formatTime';

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stories, likeStory, collectStory, addComment, likeComment, removeComment, user } = useStore();
  const { isLoggedIn } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const story = stories.find((s) => s.id === id) || null;

  const handleLike = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (story) likeStory(story.id);
  };

  const handleCollect = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (story) collectStory(story.id);
  };

  const handleComment = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (!commentText.trim() || !story) return;
    const prefix = replyTo
      ? `回复 @${story.comments.find((c) => c.id === replyTo)?.author.nickname || ''}：`
      : '';
    addComment(story.id, {
      content: `${prefix}${commentText.trim()}`,
      author: {
        nickname: user?.nickname || '',
        ageGroup: user?.ageGroup || 'worker',
        avatar: user?.avatar || '👤',
      },
    });
    setCommentText('');
    setReplyTo(null);
  };

  if (!story) {
    return (
      <div className="flex flex-col h-full">
        <Header title="故事详情" showBack onBack={() => navigate(-1)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background flex items-center justify-center">
          <EmptyState
            icon="🔍"
            title="故事不存在"
            description="该故事可能已被删除或链接错误"
            action={{ label: '返回首页', onClick: () => navigate('/') }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="故事详情" showBack onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        <div className="max-w-md mx-auto px-4 py-4 animate-fade-in">
          <Card className="mb-4">
            <div className="flex items-center gap-3 mb-5">
              <Avatar variant="secondary" size="lg">
                {story.author.avatar || '👤'}
              </Avatar>
              <div>
                <div className="font-medium text-foreground">{story.author.nickname}</div>
                <div className="text-xs text-muted">
                  {AGE_GROUP_LABELS[story.author.ageGroup]} · {formatRelativeTime(story.createdAt)}
                </div>
              </div>
              <Badge
                variant={story.type === 'vent' ? 'accent' : 'primary'}
                className="ml-auto"
              >
                {STORY_TYPE_LABELS[story.type]}
              </Badge>
            </div>

            <h1 className="font-serif text-xl font-semibold text-foreground mb-3 leading-snug">
              {story.title}
            </h1>

            <div className="mb-5">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {story.content}
              </p>
            </div>

            {story.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {story.tags.map((tag) => (
                  <Tag key={tag} size="sm" variant="outline">
                    #{tag}
                  </Tag>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-8 py-3 border-t border-divider">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  story.isLiked ? 'text-accent' : 'text-muted hover:text-accent'
                }`}
              >
                <Heart size={18} fill={story.isLiked ? 'currentColor' : 'none'} />
                <span>{story.likes}</span>
              </button>
              <button
                onClick={handleCollect}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  story.isCollected ? 'text-primary' : 'text-muted hover:text-primary'
                }`}
              >
                <Bookmark size={18} fill={story.isCollected ? 'currentColor' : 'none'} />
                <span>{story.isCollected ? '已收藏' : '收藏'}</span>
              </button>
              <button className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors">
                <Share2 size={18} />
                <span>分享</span>
              </button>
            </div>
          </Card>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-medium text-foreground">评论</h3>
              <span className="text-sm text-muted">{story.comments.length}</span>
            </div>

            {story.comments.length === 0 ? (
              <EmptyState
                icon="💬"
                title="暂无评论"
                description="分享你的想法，让故事更完整"
              />
            ) : (
              <div className="space-y-0">
                {story.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onLike={isLoggedIn ? () => likeComment(story.id, comment.id) : () => navigate('/login')}
                    onReply={isLoggedIn ? () => {
                      setReplyTo(comment.id);
                      const input = document.querySelector('input[data-comment-input]') as HTMLInputElement | null;
                      if (input) input.focus();
                    } : undefined}
                    onDelete={
                      isLoggedIn && comment.author.nickname === user?.nickname
                        ? () => {
                            if (confirm('确定删除这条评论吗？')) {
                              removeComment(story.id, comment.id);
                            }
                          }
                        : undefined
                    }
                    canDelete={
                      isLoggedIn && !!user && comment.author.nickname === user.nickname
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="bg-surface border-t border-border px-4 py-3">
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            placeholder={replyTo ? '输入回复内容...' : '写下你的评论...'}
            className="flex-1 px-5 py-3 bg-surface-muted rounded-full text-sm outline-none placeholder-muted focus:ring-2 focus:ring-primary/20 transition-shadow"
            data-comment-input
          />
          <Button variant="primary" size="md" onClick={handleComment}>
            发送
          </Button>
        </div>
        {replyTo && (
          <div className="max-w-md mx-auto mt-2">
            <button
              onClick={() => setReplyTo(null)}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              取消回复
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
