import styled from 'styled-components';
import Stats from './Stats';
import Spinner from '../../ui/Spinner';
import { useRecentBookings } from './useRecentBookings';
import { useRecentStays } from './useRecentStays';
import { useCabins } from '../../features/cabins/useCabins';
import { useSearchParams } from 'react-router-dom';
import SalesChart from './SalesChart';
import DurationChart from './DurationChart';

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 40rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const { bookings, isLoading } = useRecentBookings();
  const { confirmedStays, isLoading2 } = useRecentStays();
  const { cabins, isLoading3 } = useCabins();
  const [searchParams] = useSearchParams();
  const numDays = Number(searchParams.get('last')) || 7;

  if (isLoading || isLoading2 || isLoading3) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numCabins={cabins?.length}
        numDays={numDays}
      />
      <div>Today&apos;s activity</div>
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
