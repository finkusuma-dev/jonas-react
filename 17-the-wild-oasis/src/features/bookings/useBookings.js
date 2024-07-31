import { useQuery } from '@tanstack/react-query';
import { getBookings as getBookingsApi } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
// import PropTypes from 'prop-types';

// useBookings.propTypes = {
//   filter: PropTypes.string,
//   sort: PropTypes.string,
// };

export function useBookings() {
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'startDate-desc';
  const [field, direction] = sortBy.split('-');

  // const queryClient = useQueryClient();
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bookings', `status=${filterValue}`, `sort=${sortBy}`],
    queryFn: () => {
      return getBookingsApi({
        filter: {
          field: 'status',
          value: filterValue,
          operator: 'eq',
        },
        sort: {
          field,
          direction,
        },
      });
    },
  });

  return { bookings, isLoading, error };
}
