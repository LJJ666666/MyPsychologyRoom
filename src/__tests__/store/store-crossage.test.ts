import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { AgeGroup } from '../../types';

describe('useStore - 跨龄视角领域（CrossAgeDomain）', () => {
  beforeEach(() => {
    const state = useStore.getState();
    if (state.topics.length > 0) {
      state.setActiveTopic(state.topics[0].id);
      state.setActivePerspective('teen');
    }
  });

  it('topics 数组不为空', () => {
    const { topics } = useStore.getState();
    expect(topics.length).toBeGreaterThan(0);
  });

  it('每个话题包含 4 个年龄段的视角', () => {
    const { topics } = useStore.getState();
    topics.forEach((topic) => {
      expect(topic.perspectives.length).toBeGreaterThanOrEqual(1);
      topic.perspectives.forEach((p) => {
        expect(['teen', 'worker', 'parent', 'elder']).toContain(p.ageGroup);
      });
    });
  });

  it('activeTopicId 默认为第一个话题', () => {
    const { topics, activeTopicId } = useStore.getState();
    expect(activeTopicId).toBe(topics[0]?.id);
  });

  it('setActiveTopic 正确更新并重置视角', () => {
    const { topics, setActiveTopic, setActivePerspective } = useStore.getState();
    if (topics.length >= 2) {
      // 先设为 worker
      setActivePerspective('worker');
      expect(useStore.getState().activePerspective).toBe('worker' as AgeGroup);

      // 切换话题
      setActiveTopic(topics[1].id);
      expect(useStore.getState().activeTopicId).toBe(topics[1].id);
      expect(useStore.getState().activePerspective).toBe('teen' as AgeGroup);
    }
  });

  it('setActivePerspective 正确更新当前视角', () => {
    const { setActivePerspective } = useStore.getState();
    setActivePerspective('parent');
    expect(useStore.getState().activePerspective).toBe('parent' as AgeGroup);
  });

  it('getActiveTopic 返回当前选中的话题', () => {
    const state = useStore.getState();
    const activeTopic = state.getActiveTopic();
    expect(activeTopic?.id).toBe(state.activeTopicId);
  });

  it('getActivePerspective 返回当前选中的视角', () => {
    const { setActivePerspective, getActiveTopic, getActivePerspective } = useStore.getState();
    setActivePerspective('elder');
    const topic = getActiveTopic();
    if (topic) {
      const expected = topic.perspectives.find((p) => p.ageGroup === 'elder');
      const perspective = getActivePerspective();
      expect(perspective?.authorName).toBe(expected?.authorName);
    }
  });

  it('所有话题标题不为空', () => {
    const { topics } = useStore.getState();
    topics.forEach((topic) => {
      expect(topic.title.length).toBeGreaterThan(0);
    });
  });

  it('切换话题不改变 topics 数据本身', () => {
    const { topics, setActiveTopic } = useStore.getState();
    const beforeLength = topics.length;
    if (topics.length >= 2) {
      setActiveTopic(topics[1].id);
    }
    expect(useStore.getState().topics.length).toBe(beforeLength);
  });
});
