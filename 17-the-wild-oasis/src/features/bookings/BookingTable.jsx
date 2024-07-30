import BookingRow from './BookingRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Empty from '../../ui/Empty';
import { useBookings } from './useBookings';
import Spinner from '../../ui/Spinner';
import { useSearchParams } from 'react-router-dom';
import { camelToUnderscore } from '../../utils/helpers';

function BookingTable() {
  // const bookings = [];

  const { bookings, isLoading } = useBookings();
  const [searchParams] = useSearchParams();
  const bookingsFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'startDate-desc';
  console.log('bookingsFilter', bookingsFilter);

  if (!bookings?.length) return <Empty resourceName="bookings" />;

  if (isLoading) return <Spinner />;

  const filteredBookings = bookings.filter((booking) => {
    return bookingsFilter === 'all' || bookingsFilter === booking.status;
  });

  const [field, direction] = sortBy.split('-');
  console.log('field, direction', field, direction);

  const sortModifier = direction === 'asc' ? 1 : -1;

  const sortedBookings = filteredBookings?.sort((a, b) => {
    // if (field === 'name') {
    //   /// For String fields
    //   return (
    //     (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * sortModifier
    //   );
    // } else
    if (field === 'startDate') {
      /// For Date fields
      return (
        (new Date(a[camelToUnderscore(field)]) -
          new Date(b[camelToUnderscore(field)])) *
        sortModifier
      );
    } else {
      /// For Number fields
      return (
        (a[camelToUnderscore(field)] - b[camelToUnderscore(field)]) *
        sortModifier
      );
    }
  });

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
          data={sortedBookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default BookingTable;
