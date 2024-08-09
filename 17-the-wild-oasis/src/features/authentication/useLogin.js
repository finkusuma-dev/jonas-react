// import { loginApi } from '../../services/apiUsers';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi } from '../../services/apiUsers';
import toast from 'react-hot-toast';
// import toast from 'react-hot-toast';

function useLogin() {
  const queryClient = useQueryClient();

  const {
    mutate: login,
    isLoading: isLoggingIn,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (/* user */) => {
      // queryClient.setQueryData(['loggedUser'], user);
      toast.success('You are logged in successfully');
      // console.log('useLogin data', data);
      queryClient.invalidateQueries(['loggedUser']);
    },
    onError: (err) => {
      toast.error('Invalid email or password');
      console.log('useLogin onError', err);
    },
  });

  // console.log('useLogin error', error);

  return { login, isLoggingIn, error };
}

export default useLogin;
