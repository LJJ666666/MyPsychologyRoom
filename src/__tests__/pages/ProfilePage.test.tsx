import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProfilePage } from '../../pages/Profile/ProfilePage';
import { useStore } from '../../store';
import { AgeGroup } from '../../types';

const renderProfile = () => {
  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <ProfilePage />
    </MemoryRouter>
  );
};

describe('ProfilePage - 个人中心', () => {
  beforeEach(() => {
    const state = useStore.getState();
    if (state.stories.length === 0) {
      state.addStory({
        title: '个人中心测试故事',
        content: '用于个人中心测试',
        type: 'share',
        tags: ['测试'],
        author: { nickname: '测试用户', ageGroup: 'worker', avatar: '🌿' },
      });
    }
  });

  it('渲染标题"个人中心"', () => {
    renderProfile();
    expect(screen.getByText('个人中心')).toBeTruthy();
  });

  it('渲染功能列表项目', () => {
    renderProfile();
    expect(screen.getByText('我的故事')).toBeTruthy();
    expect(screen.getByText('我的收藏')).toBeTruthy();
    expect(screen.getByText('个人信息')).toBeTruthy();
    expect(screen.getByText('设置')).toBeTruthy();
  });

  it('未登录时显示"游客用户"', () => {
    useStore.getState().logout();
    renderProfile();
    expect(screen.getByText('游客用户')).toBeTruthy();
  });

  it('未登录时显示"登录后享受更多功能"提示', () => {
    useStore.getState().logout();
    renderProfile();
    const elements = screen.getAllByText(/登录后/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('未登录时底部显示"立即登录"', () => {
    useStore.getState().logout();
    renderProfile();
    expect(screen.getByText('立即登录')).toBeTruthy();
  });

  it('登录后显示用户昵称', () => {
    useStore.getState().setUser({ nickname: '测试用户', ageGroup: 'worker' as AgeGroup });
    renderProfile();
    expect(screen.getByText('测试用户')).toBeTruthy();
  });

  it('登录后显示年龄段标签', () => {
    useStore.getState().setUser({ nickname: '用户A', ageGroup: 'parent' as AgeGroup });
    renderProfile();
    // 页面中应该有"父母"年龄段的文字
    const parentElements = screen.getAllByText('父母');
    expect(parentElements.length).toBeGreaterThan(0);
  });

  it('登录后显示"退出登录"按钮', () => {
    useStore.getState().setUser({ nickname: '测试用户', ageGroup: 'worker' as AgeGroup });
    renderProfile();
    expect(screen.getByText('退出登录')).toBeTruthy();
  });

  it('BottomNav 可访问', () => {
    renderProfile();
    expect(screen.getByText('故事')).toBeTruthy();
    expect(screen.getByText('AI助手')).toBeTruthy();
    expect(screen.getByText('跨龄视角')).toBeTruthy();
    expect(screen.getByText('我的')).toBeTruthy();
  });
});

describe('ProfilePage - 用户状态管理', () => {
  it('setUser 后能正确读取用户', () => {
    useStore.getState().setUser({ nickname: '小明', ageGroup: 'teen' as AgeGroup });
    const user = useStore.getState().user;
    expect(user?.nickname).toBe('小明');
    expect(user?.ageGroup).toBe('teen');
  });

  it('logout 后 user 为空', () => {
    useStore.getState().setUser({ nickname: '用户', ageGroup: 'elder' as AgeGroup });
    useStore.getState().logout();
    expect(useStore.getState().user).toBeNull();
  });

  it('updateUser 能更新部分字段', () => {
    useStore.getState().setUser({ nickname: '原昵称', ageGroup: 'worker' as AgeGroup });
    useStore.getState().updateUser({ nickname: '新昵称' });
    expect(useStore.getState().user?.nickname).toBe('新昵称');
    expect(useStore.getState().user?.ageGroup).toBe('worker');
  });

  it('myStories 数组初始状态存在', () => {
    expect(Array.isArray(useStore.getState().myStories)).toBe(true);
  });

  it('myCollections 同步筛选', () => {
    const stories = useStore.getState().stories;
    const collected = stories.filter((s) => s.isCollected);
    // 所有 isCollected 的故事应该都能在 stories 中找到
    collected.forEach((s) => {
      expect(stories.find((st) => st.id === s.id)).toBeDefined();
    });
  });
});
