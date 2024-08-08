import BookingRow from './BookingRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import { useBookings } from './useBookings';
import Spinner from '../../ui/Spinner';
import Pagination from '../../ui/Pagination';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import { useEffect } from 'react';

function BookingTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookings, isLoading, count, error, dataError } = useBookings();

  useEffect(() => {
    if (bookings) {
      const pageCount = Math.ceil(count / PAGE_SIZE);
      console.log('pageCount', pageCount);
      if (bookings?.length === 0 && pageCount > 0) {
        searchParams.set('page', pageCount);
        setSearchParams(searchParams);
      }
    }
  });

  // console.log('BookingTable', bookings?.length, count);
  console.log('BookingTable error', error);
  console.log('BookingTable dataError', dataError);

  // console.log('bookings', bookings);

  if (isLoading) return <Spinner />;

  if (!bookings?.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
