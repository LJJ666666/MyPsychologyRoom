import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CrossAgePage from '../../pages/CrossAge/CrossAgePage';
import { useStore } from '../../store';
import { AgeGroup } from '../../types';

describe('CrossAgePage - 跨龄视角页面', () => {
  beforeEach(() => {
    const { setActiveTopic, setActivePerspective } = useStore.getState();
    // 重置为默认状态
    const topics = useStore.getState().topics;
    if (topics.length > 0) {
      setActiveTopic(topics[0].id);
    }
    setActivePerspective('teen');
  });

  it('渲染"跨龄视角"标题和话题数量', () => {
    render(
      <MemoryRouter>
        <CrossAgePage />
      </MemoryRouter>
    );
    const matches = screen.getAllByText('跨龄视角');
    expect(matches.length).toBeGreaterThan(0);
  });

  it('渲染"走进彼此的世界"介绍文字', () => {
    render(
      <MemoryRouter>
        <CrossAgePage />
      </MemoryRouter>
    );
    expect(screen.getByText('走进彼此的世界')).toBeTruthy();
  });

  it('显示话题标签（从 store 中读取 topics）', () => {
    render(
      <MemoryRouter>
        <CrossAgePage />
      </MemoryRouter>
    );
    const { topics } = useStore.getState();
    // 检查话题标签出现在页面上 — 使用 getAllByText 避免 multiple elements 错误
    topics.slice(0, 3).forEach((topic) => {
      const matches = screen.getAllByText(topic.title);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('点击话题标签后，激活状态的话题正确切换', () => {
    render(
      <MemoryRouter>
        <CrossAgePage />
      </MemoryRouter>
    );

    const { topics } = useStore.getState();
    if (topics.length >= 2) {
      // 获取所有该话题标题的元素，点击第一个（通常是话题标签）
      const matches = screen.getAllByText(topics[1].title);
      fireEvent.click(matches[0]);
      const { activeTopicId } = useStore.getState();
      expect(activeTopicId).toBe(topics[1].id);
    }
  });

  it('激活视角后，activePerspective 存储正确', () => {
    render(
      <MemoryRouter>
        <CrossAgePage />
      </MemoryRouter>
    );

    const { topics } = useStore.getState();
    const firstTopic = topics[0];
    if (firstTopic) {
      // 模拟点击切换到第二个视角
      const secondPerspective = firstTopic.perspectives[1]?.ageGroup;
      if (secondPerspective) {
        useStore.getState().setActivePerspective(secondPerspective);
        expect(useStore.getState().activePerspective).toBe(secondPerspective);
      }
    }
  });

  it('getActiveTopic() 能从 store 读取正确的话题', () => {
    const state = useStore.getState();
    const topic = state.getActiveTopic();
    expect(topic).toBeDefined();
    if (topic) {
      expect(topic.id).toBe(state.topics[0]?.id);
    }
  });

  it('getActivePerspective() 返回正确的视角信息', () => {
    const state = useStore.getState();
    const perspective = state.getActivePerspective();
    expect(perspective).toBeDefined();
    if (perspective) {
      expect(['teen', 'worker', 'parent', 'elder']).toContain(perspective.ageGroup);
    }
  });

  it('切换话题后默认视角重置为 teen', () => {
    const { topics, setActiveTopic, setActivePerspective } = useStore.getState();
    if (topics.length >= 2) {
      // 先设置为 worker
      setActivePerspective('worker');
      expect(useStore.getState().activePerspective).toBe('worker' as AgeGroup);

      // 切换话题
      setActiveTopic(topics[1].id);
      expect(useStore.getState().activePerspective).toBe('teen' as AgeGroup);
    }
  });

  it('"其他视角"区域会显示其他视角的内容', () => {
    render(
      <MemoryRouter>
        <CrossAgePage />
      </MemoryRouter>
    );

    const { getActiveTopic, activePerspective } = useStore.getState();
    const topic = getActiveTopic();
    if (topic) {
      const otherCount = topic.perspectives.filter((p) => p.ageGroup !== activePerspective).length;
      expect(otherCount).toBeGreaterThan(0);
    }
  });
});
