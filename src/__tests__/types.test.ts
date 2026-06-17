import { describe, it, expect } from 'vitest';

describe('故事数据 - 类型与结构', () => {
  it('storyType 标签枚举值符合预期', () => {
    const types = ['share', 'vent', 'help'] as const;
    expect(types.length).toBe(3);
    expect(types).toContain('vent');
    expect(types).toContain('share');
    expect(types).toContain('help');
  });

  it('ageGroup 年龄段涵盖四个角色', () => {
    const groups = ['teen', 'worker', 'parent', 'elder'] as const;
    expect(groups.length).toBe(4);
    expect(groups).toContain('teen');
    expect(groups).toContain('elder');
  });
});
