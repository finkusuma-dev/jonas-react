// import { loginApi } from '../../services/apiUsers';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '../../services/apiUsers';
import toast from 'react-hot-toast';

function useLogout() {
  const queryClient = useQueryClient();

  const {
    mutate: logout,
    isLoading: isLoggingOut,
    error,
  } = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      toast.success('Logged out successfully');
      // console.log('useLogout data', data);
      queryClient.invalidateQueries(['loggedUser']);
    },
  });
  return { logout, isLoggingOut, error };
}

export default useLogout;
