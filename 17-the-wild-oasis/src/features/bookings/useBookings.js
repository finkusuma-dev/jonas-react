import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookings as getBookingsApi } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
// import PropTypes from 'prop-types';

// useBookings.propTypes = {
//   filter: PropTypes.string,
//   sort: PropTypes.string,
// };

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'startDate-desc';
  const [field, direction] = sortBy.split('-');

  const page = Number(searchParams.get('page') || 1);

  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'bookings',
      `status=${filterValue}`,
      `sort=${sortBy}`,
      `page=${page}`,
    ],
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
        page,
      });
    },
  });

  const isFirstPage = page === 1;
  const isLastPage = page === Math.ceil(count / PAGE_SIZE);

  // console.log('isLastPage', isLastPage);

  /// Prefetch previous page
  if (bookings && !isFirstPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'bookings',
        `status=${filterValue}`,
        `sort=${sortBy}`,
        `page=${page - 1}`,
      ],
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
          page: page - 1,
        });
      },
    });
  }

  /// Prefetch next page
  if (bookings && !isLastPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'bookings',
        `status=${filterValue}`,
        `sort=${sortBy}`,
        `page=${page + 1}`,
      ],
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
          page: page + 1,
        });
      },
    });
  }

  return { bookings, count, isLoading, error };
}
