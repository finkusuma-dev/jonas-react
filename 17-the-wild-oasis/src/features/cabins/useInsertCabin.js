import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useInsertCabin() {
  const queryClient = useQueryClient();

  const { mutate: insertCabin, isLoading: isInserting } = useMutation({
    mutationFn: updateCabinApi,
    onSuccess: () => {
      toast.success(' A new cabin is successfully inserted');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { insertCabin, isInserting };
}
