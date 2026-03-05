import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      await setAuth(data.accessToken, data.user);
      router.replace('/(tabs)');
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: async (data) => {
      await setAuth(data.accessToken, data.user);
      router.replace('/(tabs)');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return async () => {
    await logout();
    router.replace('/(auth)/login');
  };
}
