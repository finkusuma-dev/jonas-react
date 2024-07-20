import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSettingApi } from '../../services/apiSettings';
import toast from 'react-hot-toast';

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  const { isLoading: isUpdating, mutate: updateSetting } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success('Settings is updated');
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      });
    },
    onError: (err) => {
      console.log('update settings error', err.message);
      toast.error('Settings is failed to be updated');
    },
  });

  return { isUpdating, updateSetting };
}
