# 测试驱动开发 (TDD) 指南

本项目采用 Vitest + React Testing Library 进行测试驱动开发。

## 快速开始

```bash
# 运行所有测试（单次）
npm test

# 监听模式开发
npm run test:watch

# 可视化界面
npm run test:ui

# 覆盖率报告
npm run test:coverage
```

## 工作流程（Red-Green-Refactor）

### RED - 先写失败的测试
1. 为想要实现的功能写一个**最小化**的测试
2. 测试描述要清晰：`test('rejects empty content when publishing story', () => ...)`
3. 运行测试，**观察它失败**（证明测试有效）

```bash
npm test src/__tests__/components/PublishStory.test.tsx
```

### GREEN - 写最少的代码让测试通过
1. 写刚好能让测试通过的代码
2. 不要过度设计，不要加"以后会用到"的功能
3. 保持每个改动最小

### REFACTOR - 清理代码
1. 测试保持绿色的前提下，重构
2. 提取重复代码，改善命名
3. 再跑一次测试确保一切正常

## 测试文件命名规则

- 组件测试：`src/__tests__/components/{ComponentName}.test.tsx`
- Store 测试：`src/__tests__/store/{storeName}.test.ts`
- 工具函数测试：`src/__tests__/utils/{utilName}.test.ts`
- 页面测试：`src/__tests__/pages/{PageName}.test.tsx`

## 常见测试场景模板

### 1. 组件渲染测试
```typescript
test('renders story title and author', () => {
  render(<StoryCard story={mockStory} />);
  expect(screen.getByText('测试故事标题')).toBeInTheDocument();
  expect(screen.getByText('匿名用户')).toBeInTheDocument();
});
```

### 2. 用户交互测试
```typescript
test('calls onClick when card is clicked', () => {
  const onClick = vi.fn();
  render(<StoryCard story={mockStory} onClick={onClick} />);
  fireEvent.click(screen.getByRole('article'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### 3. 状态/Store 测试
```typescript
test('adds a new story to the store', () => {
  const store = useStore.getState();
  const initialCount = store.stories.length;

  store.addStory({ title: '新故事', content: '内容', author: {...}, ... });

  expect(useStore.getState().stories.length).toBe(initialCount + 1);
});
```

### 4. 表单验证测试
```typescript
test('disables publish button when content is empty', () => {
  render(<PublishPage onBack={() => {}} />);
  const button = screen.getByRole('button', { name: /发布/i });
  expect(button).toBeDisabled();
});
```

## Mock 数据约定

- 测试数据放在 `src/test/mock-data.ts` 中
- 常用 mock 数据命名用 `mock` 前缀：`mockStory`, `mockComment`
- 不要在测试里直接用生产 mock.ts 的数据（避免耦合）

## 原则清单

- [ ] 每个测试只测一件事（名字里有"且"就要拆分）
- [ ] 测试描述行为（what），不描述实现（how）
- [ ] 先让测试失败，再让它通过（不然不知道测试到底测了啥）
- [ ] 新增功能前，先有测试
- [ ] 修 bug 前，先写一个能复现 bug 的测试

## 新功能开发 TDD 步骤模板

1. `mkdir -p src/__tests__/{components,pages,store,utils}` 确保目录存在
2. 写第一个测试文件（比如 `src/__tests__/components/NewFeature.test.tsx`）
3. `npm run test:watch` 启动监听，确认测试**失败**
4. 在 `src/components/` 或对应目录创建实现代码
5. 最小化实现，让测试**通过**
6. 写更多测试（边界情况、错误处理），重复步骤 4-5
7. 重构（提取公共逻辑、改善命名），保持测试通过
