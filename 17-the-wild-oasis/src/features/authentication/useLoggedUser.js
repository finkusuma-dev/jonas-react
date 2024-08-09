import { useQuery } from '@tanstack/react-query';
import { loggedUser } from '../../services/apiUsers';

function useLoggedUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['loggedUser'],
    queryFn: loggedUser,
    // cacheTime: 5 * 60 * 1000,
    // staleTime: 5 * 60 * 1000,
  });

  console.log('useLoggedUser', data?.user);

  return {
    user: data?.user,
    isAuthenticated: data?.user?.role === 'authenticated',
    isLoading,
    error,
  };
}

export default useLoggedUser;
