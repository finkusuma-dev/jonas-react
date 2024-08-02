import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckinIn } = useMutation({
    mutationFn: ({ id }) =>
      updateBooking(id, {
        status: 'checked-in',
        is_paid: true,
      }),
    onSuccess: (data) => {
      toast.success(`Checkin booking #${data.id} success`);
      queryClient.invalidateQueries({ active: true });
      navigate(`/bookings/${data.id}`, {
        replace: true,
      });
    },
    onError: () => toast.error('There was an error while checking in!'),
  });

  return { checkin, isCheckinIn };
}

export default useCheckin;
