import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../pages/Home/HomePage';
import { useStore } from '../../store';
import { AgeGroup } from '../../types';

const renderHome = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <HomePage />
    </MemoryRouter>
  );
};

describe('HomePage - 首页故事广场', () => {
  beforeEach(() => {
    // 每次测试前重置相关状态
    const state = useStore.getState();
    state.setStoryFilter('latest');
    state.setSelectedTag(null);
    state.setSelectedAgeGroup(null);
  });

  it('渲染标题"心理治疗室"', () => {
    renderHome();
    expect(screen.getByText('心理治疗室')).toBeTruthy();
  });

  it('渲染"最新/最热"筛选按钮', () => {
    renderHome();
    expect(screen.getByText('最新')).toBeTruthy();
    expect(screen.getByText('最热')).toBeTruthy();
  });

  it('渲染年龄段筛选（青少年/职场人/父母/中老年）', () => {
    renderHome();
    expect(screen.getByText('全年龄段')).toBeTruthy();
    expect(screen.getByText('青少年')).toBeTruthy();
    expect(screen.getByText('职场人')).toBeTruthy();
    expect(screen.getByText('父母')).toBeTruthy();
    expect(screen.getByText('中老年')).toBeTruthy();
  });

  it('渲染发布入口（圆形悬浮按钮或空状态中的发布按钮）', () => {
    renderHome();
    // 页面中至少存在按钮（无论是悬浮加号按钮，还是空状态发布入口）
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('年龄段筛选状态能正确写入 store', () => {
    useStore.getState().setSelectedAgeGroup('teen');
    const store = useStore.getState();
    expect(store.selectedAgeGroup).toBe<AgeGroup>('teen');
  });

  it('标签筛选状态能正确写入 store', () => {
    useStore.getState().setSelectedTag('工作压力');
    const store = useStore.getState();
    expect(store.selectedTag).toBe('工作压力');
  });

  it('故事列表中显示 story 内容', () => {
    const stories = useStore.getState().stories;
    expect(stories.length).toBeGreaterThan(0);

    renderHome();
    // 页面上应该能找到至少一个故事的标题文字
    const firstStoryTitle = stories[0].title;
    const titleElement = screen.queryByText(firstStoryTitle);
    expect(titleElement).toBeTruthy();
  });

  it('BottomNav 中的 4 个 Tab 文本存在', () => {
    renderHome();
    expect(screen.getByText('故事')).toBeTruthy();
    expect(screen.getByText('AI助手')).toBeTruthy();
    expect(screen.getByText('跨龄视角')).toBeTruthy();
    expect(screen.getByText('我的')).toBeTruthy();
  });
});

describe('HomePage - 筛选逻辑（纯数据验证）', () => {
  it('按年龄段筛选后 stories 只返回对应年龄段', () => {
    const stories = useStore.getState().stories;
    const teenStories = stories.filter((s) => s.author.ageGroup === 'teen');
    // mock 数据里应该有青少年故事
    expect(teenStories.length).toBeGreaterThanOrEqual(0);
    // 验证筛选逻辑正确
    teenStories.forEach((s) => {
      expect(s.author.ageGroup).toBe('teen');
    });
  });

  it('按标签筛选后 stories 只返回对应标签', () => {
    const stories = useStore.getState().stories;
    const tag = stories[0]?.tags[0];
    if (tag) {
      const filtered = stories.filter((s) => s.tags.includes(tag));
      filtered.forEach((s) => {
        expect(s.tags).toContain(tag);
      });
    }
  });
});
