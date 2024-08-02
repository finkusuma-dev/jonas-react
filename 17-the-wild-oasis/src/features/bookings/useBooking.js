import { useQuery } from '@tanstack/react-query';
import { getBooking } from '../../services/apiBookings';
import { useParams } from 'react-router-dom';

function useBooking() {
  const { bookingId } = useParams();

  // console.log('bookingId', bookingId);

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getBooking(bookingId),
    queryKey: ['booking', bookingId],
    retry: false, /// Disable retry the request for 3 times when failed
  });

  return { booking, isLoading, error };
}

export default useBooking;
