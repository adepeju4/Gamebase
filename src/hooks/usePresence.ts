import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { updateUserStatus, isAuthenticated } from '../lib/auth';
import { UserStatus } from '../types/index';

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

export const usePresence = () => {
  const isAuthed = isAuthenticated();
  const storeUser = useStoreState((state: any) => state.user);
  const setUser = useStoreActions((actions: any) => actions.setUser);

  const syncStatus = (status: UserStatus) => {
    if (storeUser) {
      setUser({ ...storeUser, status });
    }
  };

  useQuery({
    queryKey: ['presence-heartbeat'],
    queryFn: async () => {
      await updateUserStatus(UserStatus.Online);
      return UserStatus.Online;
    },
    refetchInterval: HEARTBEAT_INTERVAL,
    enabled: isAuthed,
  });

  useEffect(() => {
    if (isAuthed && storeUser && !storeUser.status) {
      syncStatus(UserStatus.Online);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed, storeUser?.id]);

  const { mutate: setStatus } = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (_data, status) => syncStatus(status),
  });

  useEffect(() => {
    if (!isAuthed) return;

    const handleVisibilityChange = () => {
      setStatus(document.hidden ? UserStatus.Away : UserStatus.Online);
    };

    const handleFocus = () => setStatus(UserStatus.Online);
    const handleBlur = () => setStatus(UserStatus.Away);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isAuthed, setStatus]);
};
