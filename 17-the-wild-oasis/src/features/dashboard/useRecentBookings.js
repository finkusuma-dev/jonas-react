import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getBookingsAfterDate } from '../../services/apiBookings';
import { subDays } from 'date-fns';

export function useRecentBookings() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get('last') || 7;

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', `last ${numDays} days`],
    queryFn: () => {
      const queryDate = subDays(new Date(), numDays).toISOString();
      console.log('queryDate', queryDate);
      return getBookingsAfterDate(queryDate);
    },
  });

  return { bookings, isLoading };
}
