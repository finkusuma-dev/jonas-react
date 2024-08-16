import PropTypes from 'prop-types';

import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';

import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';

Stats.propTypes = {
  bookings: PropTypes.array,
  confirmedStays: PropTypes.array,
  numCabins: PropTypes.number,
  numDays: PropTypes.number,
};

function Stats({ bookings, confirmedStays, numCabins, numDays }) {
  // console.log('booking', bookings);
  // console.log('stays', stays);

  const numBookings = bookings?.length;
  const totalSales = bookings?.reduce((acc, item) => acc + item.total_price, 0);

  const numStays = confirmedStays?.length;

  const occupancyRate =
    confirmedStays?.reduce((acc, item) => acc + item.num_nights, 0) /
    (numCabins * numDays);

  // console.log('occupancy', occupancy);

  return (
    <>
      <Stat
        title="Booking"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(totalSales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={numStays}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupancyRate * 100) + '%'}
      />
    </>
  );
}

export default Stats;
