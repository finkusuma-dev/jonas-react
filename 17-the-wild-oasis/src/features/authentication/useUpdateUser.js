import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../services/apiUsers';
import toast from 'react-hot-toast';

function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationFn: ({ password, fullName, avatar }) =>
      updateUser({ password, fullName, avatar }),
    onSuccess: (user) => {
      console.log('new user data', user);
      toast.success('User update is successfully Updated');

      queryClient.invalidateQueries(['loggedUser']);
    },
    onError: (err) => toast.error(err.message),
  });

  return { update, isUpdating };
}

export { useUpdateUser };
