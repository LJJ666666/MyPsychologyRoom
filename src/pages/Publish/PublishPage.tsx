import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from '../../components/Layout';
import { useStore } from '../../store';
import { StoryType, AgeGroup, AGE_GROUP_LABELS } from '../../types';
import { popularTags } from '../../data/mock';
import { Card, Button, Tag, Divider } from '../../components/ui';

const STORY_TYPES: { value: StoryType; label: string; description: string; icon: string }[] = [
  { value: 'vent', label: '倾诉', description: '表达情感，释放压力', icon: '💭' },
  { value: 'help', label: '求助', description: '遇到困惑，请求建议', icon: '🤝' },
  { value: 'share', label: '分享', description: '分享经历，传递温暖', icon: '✨' },
];

const anonymousNames = [
  '夜空中的星', '沉默的海洋', '晨曦微光', '山谷回声', '风的呢喃',
  '月光漫步', '落叶知秋', '远方的山', '静默的树', '溪流低语',
];

export const PublishPage: React.FC = () => {
  const navigate = useNavigate();
  const { addStory, user } = useStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<StoryType>('vent');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(user?.ageGroup || 'worker');
  const [step, setStep] = useState<'type' | 'content' | 'info'>('type');

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;

    const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)];

    addStory({
      title: title.trim(),
      content: content.trim(),
      type,
      tags: selectedTags,
      author: {
        nickname: nickname.trim() || randomName,
        ageGroup,
        avatar: ['🌱', '🌸', '🌻', '🌺', '🌷', '🍀', '🌿', '🦋'][
          Math.floor(Math.random() * 8)
        ],
      },
    });

    navigate('/');
  };

  const handleBack = () => {
    if (step === 'content') setStep('type');
    else if (step === 'info') setStep('content');
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header
        title={
          step === 'type' ? '选择故事类型' : step === 'content' ? '写下你的故事' : '发布设置'
        }
        showBack
        onBack={handleBack}
      />

      <main className="max-w-md mx-auto px-4 py-5">
        {/* 进度指示 */}
        <div className="flex gap-2 mb-6">
          {(['type', 'content', 'info'] as const).map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                ['type', 'content', 'info'].indexOf(step) >= i ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {/* Step 1: 选择故事类型 */}
        {step === 'type' && (
          <div className="space-y-3 animate-fade-in">
            {STORY_TYPES.map((item) => (
              <Card
                key={item.value}
                hoverable
                onClick={() => {
                  setType(item.value);
                  setStep('content');
                }}
                className={type === item.value ? 'ring-2 ring-primary' : ''}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted">{item.description}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Step 2: 标题 + 正文 + 标签 */}
        {step === 'content' && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">标题</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="一句话概括你的故事..."
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
                maxLength={50}
              />
              <div className="text-xs text-muted text-right mt-1">{title.length}/50</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">正文</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你的故事、困惑或想说的话..."
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow resize-none"
                rows={8}
                maxLength={2000}
              />
              <div className="text-xs text-muted text-right mt-1">{content.length}/2000</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                话题标签（可选，最多 3 个）
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Tag
                    key={tag}
                    variant="outline"
                    size="sm"
                    selected={selectedTags.includes(tag)}
                    onClick={() => handleTagToggle(tag)}
                    disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
                  >
                    #{tag}
                  </Tag>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setStep('info')}
              disabled={!title.trim() || !content.trim()}
            >
              下一步
            </Button>
          </div>
        )}

        {/* Step 3: 昵称 + 年龄段 + 发布 */}
        {step === 'info' && (
          <div className="space-y-4 animate-fade-in">
            <Card padding="md" className="!bg-primary/5 !shadow-none">
              <p className="text-sm text-muted">
                <span className="text-primary-dark font-medium">隐私提示：</span>
                你的故事将以匿名形式发布，不会暴露真实身份。
              </p>
            </Card>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">显示昵称（选填）</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="留空将使用随机匿名昵称"
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                年龄段（选填，帮助他人更好地理解你）
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['teen', 'worker', 'parent', 'elder'] as AgeGroup[]).map((group) => (
                  <button
                    key={group}
                    onClick={() => setAgeGroup(group)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      ageGroup === group
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-border text-muted hover:border-primary/50'
                    }`}
                  >
                    {AGE_GROUP_LABELS[group]}
                  </button>
                ))}
              </div>
            </div>

            <Divider />

            <Button variant="primary" size="lg" fullWidth onClick={handlePublish}>
              发布故事
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublishPage;
