import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '../../store';
import { AgeGroup, AGE_GROUP_LABELS } from '../../types';
import { Card, Button } from '../../components/ui';

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);

  const handleLogin = () => {
    if (!nickname.trim() || !ageGroup) return;

    setUser({
      nickname: nickname.trim(),
      ageGroup,
    });

    navigate('/profile');
  };

  const handleQuickLogin = () => {
    const nicknames = ['夜空中的星', '沉默的海洋', '晨曦微光', '山谷回声', '风的呢喃'];
    const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const ageGroups: AgeGroup[] = ['teen', 'worker', 'parent', 'elder'];
    const randomAgeGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];

    setUser({
      nickname: randomNickname,
      ageGroup: randomAgeGroup,
    });

    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-1 -ml-1 rounded-lg hover:bg-surface-muted transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-serif text-xl font-semibold text-foreground">
            匿名登录
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8">
        <Card padding="lg" className="mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">💫</span>
            </div>
            <h2 className="font-serif text-xl font-medium text-foreground mb-2">
              开启你的心灵之旅
            </h2>
            <p className="text-sm text-muted">
              为了更好地理解你，需要一些简单的信息
            </p>
          </div>

          {/* 昵称输入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              昵称（选填，将显示在你的故事中）
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="给自己起一个温暖的名字..."
              maxLength={20}
              className="w-full px-4 py-3 bg-surface-muted border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
            />
          </div>

          {/* 年龄段选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              年龄段（帮助他人更好地理解你）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['teen', 'worker', 'parent', 'elder'] as AgeGroup[]).map((group) => (
                <button
                  key={group}
                  onClick={() => setAgeGroup(group)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                    ageGroup === group
                      ? 'bg-primary text-white'
                      : 'bg-surface-muted border border-border text-muted hover:border-primary/50'
                  }`}
                >
                  <span>{AGE_GROUP_ICONS[group]}</span>
                  <span>{AGE_GROUP_LABELS[group]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 隐私提示 */}
          <div className="bg-primary/5 rounded-xl p-4 mb-6">
            <p className="text-xs text-muted text-center">
              <span className="text-primary-dark font-medium">🌿 隐私保护：</span>
              你的身份信息完全匿名，不会被任何人知晓
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleLogin}
            disabled={!nickname.trim() || !ageGroup}
          >
            开始探索
          </Button>
        </Card>

        {/* 快速登录 */}
        <Card padding="md">
          <button
            onClick={handleQuickLogin}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted hover:text-foreground transition-colors"
          >
            <span className="text-lg">🎲</span>
            <span>随机身份快速体验</span>
          </button>
        </Card>
      </main>
    </div>
  );
};

export default LoginPage;
