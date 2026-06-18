import React, { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
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

const anonymousNames = [
  '夜空中的星', '沉默的海洋', '晨曦微光', '山谷回声', '风的呢喃',
  '月光漫步', '落叶知秋', '远方的山', '静默的树', '溪流低语',
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useStore();
  
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!nickname.trim() || !ageGroup || !agreeTerms) return;

    if (isRegister) {
      if (!password || password !== confirmPassword) return;
    }

    setUser({
      nickname: nickname.trim(),
      ageGroup,
      email: isRegister ? email : null,
    });

    navigate('/profile');
  };

  const handleQuickLogin = () => {
    const randomNickname = anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
    const ageGroups: AgeGroup[] = ['teen', 'worker', 'parent', 'elder'];
    const randomAgeGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];

    setUser({
      nickname: randomNickname,
      ageGroup: randomAgeGroup,
      email: null,
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
            {isRegister ? '注册账号' : '匿名登录'}
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        <Card padding="lg" className="mb-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">💫</span>
            </div>
            <h2 className="font-serif text-xl font-medium text-foreground mb-2">
              {isRegister ? '开启你的心灵之旅' : '开启你的心灵之旅'}
            </h2>
            <p className="text-sm text-muted">
              {isRegister ? '创建账号，开始记录你的故事' : '为了更好地理解你，需要一些简单的信息'}
            </p>
          </div>

          {isRegister && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">邮箱（用于找回密码）</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入你的邮箱地址"
                className="w-full px-4 py-3 bg-surface-muted border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
              />
            </div>
          )}

          {/* 昵称输入 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              昵称{isRegister ? '（必填）' : '（选填）'}
              <span className="text-danger">*</span>
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-3">
              年龄段 <span className="text-danger">*</span>
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

          {isRegister && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  密码 <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="设置登录密码"
                    className="w-full px-4 py-3 pr-12 bg-surface-muted border border-border rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  确认密码 <span className="text-danger">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className={`w-full px-4 py-3 bg-surface-muted border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-shadow ${
                    password && confirmPassword && password !== confirmPassword
                      ? 'border-danger'
                      : 'border-border focus:border-primary'
                  }`}
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-danger mt-1">两次输入的密码不一致</p>
                )}
              </div>
            </>
          )}

          {/* 隐私协议 */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  agreeTerms ? 'bg-primary border-primary' : 'border-border'
                }`}
              >
                {agreeTerms && <Check size={14} className="text-white" />}
              </button>
              <span className="text-xs text-muted leading-relaxed">
                我已阅读并同意
                <button className="text-primary-dark hover:underline mx-1">《用户协议》</button>
                和
                <button className="text-primary-dark hover:underline mx-1">《隐私政策》</button>
              </span>
            </label>
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
            disabled={
              !nickname.trim() || 
              !ageGroup || 
              !agreeTerms ||
              (isRegister && (!password || password !== confirmPassword))
            }
          >
            {isRegister ? '注册账号' : '开始探索'}
          </Button>
        </Card>

        {/* 切换登录/注册 */}
        <div className="text-center mb-4">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setPassword('');
              setConfirmPassword('');
              setEmail('');
            }}
            className="text-sm text-primary-dark hover:underline"
          >
            {isRegister ? '已有账号？直接登录' : '需要注册账号？'}
          </button>
        </div>

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
