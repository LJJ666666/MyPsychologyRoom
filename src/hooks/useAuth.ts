import { useStore } from '../store';

export type Permission = 'read' | 'publish' | 'comment' | 'like' | 'collect' | 'chat';

interface PermissionResult {
  can: boolean;
  redirectTo?: string;
}

export const useAuth = () => {
  const { user } = useStore();
  const isLoggedIn = !!user;

  const checkPermission = (permission: Permission): PermissionResult => {
    switch (permission) {
      case 'read':
        return { can: true };
      case 'chat':
        return { can: true };
      case 'publish':
        return isLoggedIn ? { can: true } : { can: false, redirectTo: '/login' };
      case 'comment':
        return isLoggedIn ? { can: true } : { can: false, redirectTo: '/login' };
      case 'like':
        return isLoggedIn ? { can: true } : { can: false, redirectTo: '/login' };
      case 'collect':
        return isLoggedIn ? { can: true } : { can: false, redirectTo: '/login' };
      default:
        return { can: false };
    }
  };

  const requireAuth = (permission: Permission) => {
    const result = checkPermission(permission);
    if (!result.can && result.redirectTo) {
      window.location.href = result.redirectTo;
      return false;
    }
    return result.can;
  };

  return {
    user,
    isLoggedIn,
    checkPermission,
    requireAuth,
    permissions: {
      read: checkPermission('read').can,
      publish: checkPermission('publish').can,
      comment: checkPermission('comment').can,
      like: checkPermission('like').can,
      collect: checkPermission('collect').can,
      chat: checkPermission('chat').can,
    },
  };
};
