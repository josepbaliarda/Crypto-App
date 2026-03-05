import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/auth.store';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <LoadingSpinner fullScreen />;
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
