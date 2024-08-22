import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckinIn } = useMutation({
    // mutationFn: ({ id, payload: { breakfastPrice = 0, totalPrice = 0 } }) => {
    mutationFn: ({ id, breakfast = {} }) => {
      {
        const payload = {
          status: 'checked-in',
          isPaid: true,
          ...breakfast,
        };
        // if (breakfastPrice) {
        //   payload.hasBreakfast = true;
        //   payload.extrasPrice = breakfastPrice;
        //   payload.totalPrice = totalPrice;
        // }
        console.log('payload', payload);
        // return null;
        return updateBooking(id, payload);
      }
    },
    onSuccess: (data) => {
      toast.success(`Checkin booking #${data.id} success`);
      queryClient.invalidateQueries({ active: true });
      navigate(-1);
      // navigate(`/bookings/${data.id}`, {
      //   replace: true,
      // });
    },
    onError: () => toast.error('There was an error while checking in!'),
  });

  return { checkin, isCheckinIn };
}

export default useCheckin;
