import { useMutation } from '@tanstack/react-query';
import { signUp as signUpApi } from '../../services/apiUsers';
import toast from 'react-hot-toast';

function useSignUp() {
  const { mutate: signUp, isLoading } = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      console.log('useSignUp onSuccess', data);
      toast.success(
        "Account is successfully created. Please verify the new account from the user's email address!"
      );
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { signUp, isLoading };
}

export default useSignUp;
