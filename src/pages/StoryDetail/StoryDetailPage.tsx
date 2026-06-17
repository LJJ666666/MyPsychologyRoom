import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Share2 } from 'lucide-react';
import { Header } from '../../components/Layout';
import { Comment } from '../../components/Comment';
import { EmptyState } from '../../components/common';
import { useStore } from '../../store';
import { AGE_GROUP_LABELS, STORY_TYPE_LABELS, STORY_TYPE_COLORS } from '../../types';

export const StoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stories, likeStory, collectStory, addComment, user } = useStore();
  const [commentText, setCommentText] = useState('');

  const story = stories.find((s) => s.id === id) || null;

  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="故事详情" showBack onBack={() => navigate(-1)} />
        <EmptyState
          icon="🔍"
          title="故事不存在"
          description="该故事可能已被删除或不存在"
          action={{ label: '返回', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const handleLike = () => {
    likeStory(story.id);
  };

  const handleCollect = () => {
    collectStory(story.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="故事详情" showBack onBack={() => navigate(-1)} />

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Story Content */}
        <article className="bg-white rounded-2xl p-5 shadow-card mb-4 animate-fade-in">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
              {story.author.avatar || '👤'}
            </div>
            <div>
              <div className="font-medium text-foreground">{story.author.nickname}</div>
              <div className="text-sm text-muted">
                {AGE_GROUP_LABELS[story.author.ageGroup]} · {story.createdAt}
              </div>
            </div>
            <span
              className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${STORY_TYPE_COLORS[story.type]}`}
            >
              {STORY_TYPE_LABELS[story.type]}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-xl font-semibold text-foreground mb-3 leading-relaxed">
            {story.title}
          </h1>

          {/* Content */}
          <div className="prose prose-sm max-w-none mb-4">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {story.content}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 pt-4 border-t border-gray-100">
            {story.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-muted text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                story.isLiked
                  ? 'bg-accent/10 text-accent'
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              <Heart
                size={18}
                fill={story.isLiked ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-medium">{story.likes}</span>
            </button>
            <button
              onClick={handleCollect}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                story.isCollected
                  ? 'bg-primary/10 text-primary'
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              <Bookmark
                size={18}
                fill={story.isCollected ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-medium">收藏</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-muted hover:bg-gray-200 transition-all ml-auto">
              <Share2 size={18} />
            </button>
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded-2xl p-5 shadow-card">
          <h2 className="font-medium text-foreground mb-4">
            留言 ({story.comments.length})
          </h2>

          {story.comments.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted text-sm mb-4">还没有留言</p>
              <p className="text-muted text-xs">成为第一个安慰Ta的人吧</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {story.comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            placeholder="写下你的安慰或建议..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm outline-none placeholder-muted focus:ring-2 focus:ring-primary/20"
          />
          <button
            onClick={handleComment}
            disabled={!commentText.trim()}
            className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};
