import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditProfilePage from '../../pages/EditProfile/EditProfilePage';
import { useStore } from '../../store';

const renderEdit = () => {
  return render(
    <MemoryRouter initialEntries={['/profile/edit']}>
      <EditProfilePage />
    </MemoryRouter>
  );
};

describe('EditProfilePage - 编辑个人信息', () => {
  beforeEach(() => {
    const state = useStore.getState();
    state.setUser({ nickname: '原昵称', ageGroup: 'teen', avatar: '🌱' });
  });

  it('渲染标题"个人信息"', () => {
    renderEdit();
    expect(screen.getByText('个人信息')).toBeTruthy();
  });

  it('显示当前用户的昵称', () => {
    renderEdit();
    expect(screen.getByText('原昵称')).toBeTruthy();
  });

  it('能修改昵称并保存', () => {
    renderEdit();
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { value: '新的昵称' } });
    expect(input.value).toBe('新的昵称');

    const saveBtn = screen.getByText('保存修改');
    act(() => {
      fireEvent.click(saveBtn);
    });

    const user = useStore.getState().user;
    expect(user?.nickname).toBe('新的昵称');
  });

  it('修改年龄段并保存', () => {
    renderEdit();

    // 点击年龄段 —— 先选中 worker 类
    const workerBtn = screen.getByText('职场人');
    fireEvent.click(workerBtn);

    const saveBtn = screen.getByText('保存修改');
    act(() => {
      fireEvent.click(saveBtn);
    });

    const user = useStore.getState().user;
    expect(user?.ageGroup).toBe('worker');
  });

  it('显示账号信息区域（注册时间）', () => {
    renderEdit();
    expect(screen.getByText('账号信息')).toBeTruthy();
  });
});
