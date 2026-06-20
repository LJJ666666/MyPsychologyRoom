import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

import { Header } from '../../components/Layout';
import { useStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { AgeGroup, AGE_GROUP_LABELS } from '../../types';
import { Card, Button, Divider } from '../../components/ui';

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useStore();
  const { isLoggedIn } = useAuth();

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(user?.ageGroup || 'worker');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="个人信息" showBack onBack={() => navigate('/profile')} />
        <main className="max-w-md mx-auto px-4 py-12">
          <Card padding="lg" className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">🔒</span>
            </div>
            <h2 className="font-serif text-xl font-medium text-foreground mb-2">需要登录</h2>
            <p className="text-sm text-muted mb-6">登录后可以编辑你的个人信息</p>
            <Button variant="primary" size="md" onClick={() => navigate('/login')}>
              立即登录
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  const handleSave = () => {
    if (!nickname.trim()) return;

    setSaving(true);

    // 使用 updateUser 保留原有的 id 和 createdAt，只更新昵称、年龄段和邮箱
    updateUser({
      nickname: nickname.trim(),
      ageGroup,
      email: email.trim() || null,
    });

    setTimeout(() => {
      setSaving(false);
      navigate('/profile');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header title="个人信息" showBack onBack={() => navigate('/profile')} />

      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 当前头像展示 */}
        <Card padding="md" className="text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-4xl">
            {AGE_GROUP_ICONS[ageGroup]}
          </div>
          <div className="font-medium text-foreground">{nickname || '匿名用户'}</div>
          <div className="text-xs text-muted mt-1">{AGE_GROUP_LABELS[ageGroup]}</div>
        </Card>

        {/* 昵称编辑 */}
        <Card padding="md">
          <label className="block text-sm font-medium text-foreground mb-3">昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="给自己起一个温暖的名字..."
            maxLength={20}
            className="w-full px-4 py-3 bg-surface-muted border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
          <div className="text-xs text-muted text-right mt-1">{nickname.length}/20</div>
        </Card>

        {/* 年龄段选择 */}
        <Card padding="md">
          <label className="block text-sm font-medium text-foreground mb-3">年龄段</label>
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
        </Card>

        {/* 邮箱（选填，注册用户可见） */}
        <Card padding="md">
          <label className="block text-sm font-medium text-foreground mb-3">
            邮箱 <span className="text-xs text-muted">（选填，用于找回账号）</span>
          </label>
          <input
            type="email"
            value={email || ''}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-surface-muted border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
          />
        </Card>

        <Divider />

        {/* 保存按钮 */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth={false}
            onClick={() => navigate('/profile')}
          >
            取消
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleSave}
            disabled={!nickname.trim() || saving}
          >
            {saving ? (
              <>
                <Check size={16} className="mr-1" />
                保存中...
              </>
            ) : (
              '保存修改'
            )}
          </Button>
        </div>

        {/* 账号信息 */}
        <Card padding="md" className="bg-surface-muted/50 border-dashed">
          <h3 className="text-sm font-medium text-foreground mb-3">账号信息</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted">用户ID</span>
              <span className="text-foreground">{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">注册时间</span>
              <span className="text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '-'}
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EditProfilePage;
