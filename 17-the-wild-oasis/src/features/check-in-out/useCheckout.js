import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

function useCheckin() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (id) => {
      {
        // console.log('checkout id', id);
        // return null;
        return updateBooking(id, {
          status: 'checked-out',
        });
      }
    },
    onSuccess: (data) => {
      toast.success(`Checkout booking #${data.id} success`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: (err) => {
      console.error(err);
      toast.error('There was an error while checking out!');
    },
  });

  return { checkout, isCheckingOut };
}

export default useCheckin;
