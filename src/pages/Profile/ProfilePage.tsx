import React from 'react';
import {
  BookOpen,
  Bookmark,
  User,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Header, BottomNav } from '../../components/Layout';
import { useStore } from '../../store';
import { AGE_GROUP_LABELS, AgeGroup } from '../../types';
import { Card, Divider } from '../../components/ui';

const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  teen: '🌱',
  worker: '🌿',
  parent: '🌻',
  elder: '🍀',
};

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, myStories, stories, logout } = useStore();
  const collectedStories = stories.filter((story) => story.isCollected);

  const displayName = user?.nickname || '游客用户';
  const displayDesc = user ? AGE_GROUP_LABELS[user.ageGroup] : '登录后享受更多功能';
  const avatarIcon = user?.ageGroup ? AGE_GROUP_ICONS[user.ageGroup] : '😊';

  const handleAction = (path: string) => {
    if (!user && path !== '/login') {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const listItems = [
    {
      icon: BookOpen,
      label: '我的故事',
      value: myStories.length,
      onClick: () => handleAction('/profile/stories'),
    },
    {
      icon: Bookmark,
      label: '我的收藏',
      value: collectedStories.length,
      onClick: () => handleAction('/profile/collections'),
    },
    {
      icon: User,
      label: '个人信息',
      value: null,
      onClick: () => handleAction('/profile/edit'),
    },
    {
      icon: Settings,
      label: '设置',
      value: null,
      onClick: () => alert('设置功能即将上线～'),
    },
  ];

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/profile/edit');
    }
  };

  // 个人中心右侧：登录状态提示
  const profileRightContent = user ? (
    <button
      onClick={handleProfileClick}
      className="flex items-center gap-1.5 text-sm text-primary hover:text-primary transition-colors"
    >
      <User size={18} />
      <span>编辑</span>
    </button>
  ) : (
    <button
      onClick={() => navigate('/login')}
      className="text-sm text-primary hover:text-primary transition-colors"
    >
      登录
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="个人中心" rightContent={profileRightContent} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background">
        <div className="max-w-md mx-auto px-4 py-4">
          {/* 个人资料卡 */}
          <Card padding="md" className="mb-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-4 w-full"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
                {avatarIcon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-serif text-base font-medium text-foreground">
                  {displayName}
                </div>
                <div className="text-xs text-muted">{displayDesc}</div>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </button>

            <Divider className="my-4" />

            {/* 数字统计 */}
            <div className="flex items-center justify-around">
              <div className="text-center flex-1">
                <div className="text-lg font-semibold text-foreground">
                  {myStories.length}
                </div>
                <div className="text-xs text-muted">发布故事</div>
              </div>
              <div className="w-px h-8 bg-divider" />
              <div className="text-center flex-1">
                <div className="text-lg font-semibold text-foreground">
                  {collectedStories.length}
                </div>
                <div className="text-xs text-muted">收藏</div>
              </div>
              <div className="w-px h-8 bg-divider" />
              <div className="text-center flex-1">
                <div className="text-lg font-semibold text-foreground">
                  {myStories.reduce((acc, s) => acc + s.likes, 0)}
                </div>
                <div className="text-xs text-muted">获得温暖</div>
              </div>
            </div>
          </Card>

          {/* 功能列表 */}
          <Card padding="none" className="overflow-hidden mb-4">
            {listItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-surface-muted transition-colors ${
                  index !== listItems.length - 1 ? 'border-b border-divider' : ''
                }`}
              >
                <item.icon size={18} className="text-muted" />
                <span className="flex-1 text-left text-sm text-foreground">
                  {item.label}
                </span>
                {item.value !== null && (
                  <span className="text-xs text-muted">{item.value}</span>
                )}
                <ChevronRight size={16} className="text-muted" />
              </button>
            ))}
          </Card>

          {/* 退出登录 */}
          {user && (
            <Card padding="none" className="overflow-hidden">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3.5 hover:bg-surface-muted transition-colors text-sm text-danger"
              >
                <LogOut size={18} />
                退出登录
              </button>
            </Card>
          )}

          {/* 登录入口 */}
          {!user && (
            <Card padding="none" className="overflow-hidden">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 py-3.5 hover:bg-surface-muted transition-colors text-sm text-primary-dark"
              >
                <User size={18} />
                立即登录
              </button>
            </Card>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
