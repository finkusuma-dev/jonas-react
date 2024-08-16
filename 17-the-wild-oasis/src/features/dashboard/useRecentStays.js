import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getStaysAfterDate } from '../../services/apiBookings';
import { subDays } from 'date-fns';

export function useRecentStays() {
  const [searchParams] = useSearchParams();
  const numDays = searchParams.get('last') || 7;

  const { data: stays, isLoading } = useQuery({
    queryKey: ['stays', `last ${numDays} days`],
    queryFn: () => {
      const queryDate = subDays(new Date(), numDays).toISOString();
      console.log('queryDate', queryDate);
      return getStaysAfterDate(queryDate);
    },
  });

  const confirmedStays = stays?.filter(
    (item) => item.status === 'checked-in' || item.status === 'checked-out'
  );

  return { stays, confirmedStays, isLoading };
}
