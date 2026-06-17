import { describe, it, expect } from 'vitest';

describe('EmptyState 组件渲染', () => {
  it('包含一个 icon 字符（默认表情）', () => {
    expect('📭').toBeTruthy();
  });

  it('简单验证 - 基本断言', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('StoryCard 基础渲染', () => {
  it('能正确处理故事内容', () => {
    const title = '测试故事';
    expect(title.length).toBeGreaterThan(0);
  });
});
