import { useStore } from '../store';
import { User, AgeGroup } from '../types';

/**
 * UserService — 用户领域服务层
 *
 * 提供登录、登出、资料更新和权限判断。
 */
export function useUserService() {
  const { user, setUser, updateUser, logout } = useStore();

  /** 获取当前用户 */
  const getCurrentUser = (): User | null => user;

  /** 是否已登录 */
  const isLoggedIn = (): boolean => user !== null;

  /** 登录/注册（匿名用户） */
  const login = (nickname: string, ageGroup: AgeGroup): void => {
    setUser({ nickname, ageGroup });
  };

  /** 登出 */
  const signOut = (): void => logout();

  /** 更新用户资料 */
  const updateProfile = (partialUser: Partial<Omit<User, 'id' | 'createdAt'>>): void => {
    updateUser(partialUser);
  };

  /** 更新昵称 */
  const setNickname = (nickname: string): void => updateUser({ nickname });

  /** 更新年龄段 */
  const setAgeGroup = (ageGroup: AgeGroup): void => updateUser({ ageGroup });

  return {
    getCurrentUser,
    isLoggedIn,
    login,
    signOut,
    updateProfile,
    setNickname,
    setAgeGroup,
  };
}

export type UserService = ReturnType<typeof useUserService>;
export default useUserService;
