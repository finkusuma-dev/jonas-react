import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCabinApi } from '../../services/apiCabins';
import toast from 'react-hot-toast';

export function useUpdateCabin() {
  const queryClient = useQueryClient();

  const { mutate: updateCabin, isLoading: isUpdating } = useMutation({
    mutationFn: ({ cabin, cabinId }) => updateCabinApi(cabin, cabinId),
    onSuccess: () => {
      toast.success(' A new cabin is successfully updated');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateCabin, isUpdating };
}
