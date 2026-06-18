import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { Header } from '../../components/Layout';
import { Comment } from '../../components/Comment';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { AGE_GROUP_LABELS, STORY_TYPE_LABELS } from '../../types';
import { Card, Avatar, Tag, Badge, Divider, Button } from '../../components/ui';

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stories, likeStory, collectStory, addComment, user } = useStore();
  const { isLoggedIn } = useAuth();
  const [commentText, setCommentText] = useState('');

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
    addComment(story.id, {
      content: commentText.trim(),
      author: {
        nickname: user?.nickname || '匿名用户',
        ageGroup: user?.ageGroup || 'worker',
        avatar: '',
      },
    });
    setCommentText('');
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="故事详情" showBack onBack={() => navigate(-1)} />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-medium text-foreground mb-2">故事不存在</h3>
          <p className="text-sm text-muted mb-6">该故事可能已被删除或链接错误</p>
          <Button variant="primary" size="md" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="故事详情" showBack onBack={() => navigate(-1)} />

      <main className="max-w-md mx-auto px-4 py-4 animate-fade-in">
        {/* 故事正文卡片 */}
        <Card className="mb-4">
          {/* 作者信息 + 故事类型 */}
          <div className="flex items-center gap-3 mb-5">
            <Avatar variant="secondary" size="lg">
              {story.author.avatar || '👤'}
            </Avatar>
            <div>
              <div className="font-medium text-foreground">{story.author.nickname}</div>
              <div className="text-xs text-muted">
                {AGE_GROUP_LABELS[story.author.ageGroup]} · {story.createdAt}
              </div>
            </div>
            <Badge
              variant={story.type === 'vent' ? 'accent' : 'primary'}
              className="ml-auto"
            >
              {STORY_TYPE_LABELS[story.type]}
            </Badge>
          </div>

          {/* 标题 */}
          <h1 className="font-serif text-xl font-semibold text-foreground mb-3 leading-snug">
            {story.title}
          </h1>

          {/* 正文 */}
          <div className="mb-5">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
          </div>

          {/* 标签 */}
          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {story.tags.map((tag) => (
                <Tag key={tag} size="sm" variant="outline">
                  #{tag}
                </Tag>
              ))}
            </div>
          )}

          <Divider />

          {/* 操作栏 */}
          <div className="flex items-center gap-6 pt-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                story.isLiked
                  ? 'bg-accent/10 text-accent'
                  : 'bg-surface-muted text-muted hover:text-foreground'
              }`}
            >
              <Heart size={18} fill={story.isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{story.likes}</span>
            </button>
            <button
              onClick={handleCollect}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                story.isCollected
                  ? 'bg-primary/10 text-primary-dark'
                  : 'bg-surface-muted text-muted hover:text-foreground'
              }`}
            >
              <Bookmark size={18} fill={story.isCollected ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">
                {story.isCollected ? '已收藏' : '收藏'}
              </span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted text-muted hover:text-foreground transition-all ml-auto">
              <Share2 size={18} />
            </button>
          </div>
        </Card>

        {/* 评论区 */}
        <Card padding="md">
          <h2 className="font-medium text-foreground mb-4">
            留言 ({story.comments.length})
          </h2>

          {story.comments.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted text-sm mb-1">还没有人留言</p>
              <p className="text-muted text-xs">成为第一个安慰 Ta 的人吧 💛</p>
            </div>
          ) : (
            <div className="space-y-1">
              {story.comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <Comment comment={comment} />
                </React.Fragment>
              ))}
            </div>
          )}
        </Card>
      </main>

      {/* 底部评论输入栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-3 z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            placeholder={isLoggedIn ? '写下你的安慰或建议...' : '登录后可以留言'}
            disabled={!isLoggedIn}
            className={`flex-1 px-5 py-3 rounded-full text-sm outline-none transition-shadow ${
              isLoggedIn
                ? 'bg-surface-muted placeholder-muted focus:ring-2 focus:ring-primary/30'
                : 'bg-surface-muted/50 placeholder-muted/50 cursor-not-allowed'
            }`}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleComment}
            disabled={!commentText.trim() || !isLoggedIn}
          >
            {isLoggedIn ? '发送' : '登录'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailPage;
