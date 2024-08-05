import styled from 'styled-components';
import PropTypes from 'prop-types';
import { format, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  HiArrowDownOnSquare,
  HiArrowTopRightOnSquare,
  HiEye,
} from 'react-icons/hi2';

import useCheckout from '../check-in-out/useCheckout';

import Tag from '../../ui/Tag';
import Table from '../../ui/Table';

import { formatCurrency } from '../../utils/helpers';
import { formatDistanceFromNow } from '../../utils/helpers';
import Menus from '../../ui/Menus';
import { useSearchParams } from 'react-router-dom';

const Booking = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
`;
BookingRow.propTypes = {
  booking: PropTypes.object,
};

function BookingRow({
  booking: {
    id: bookingId,
    // created_at,
    start_date,
    end_date,
    num_nights,
    // num_guests,
    total_price,
    status,
    guests: { full_name: guestName, email },
    cabins: { name: cabinName },
  },
}) {
  const navigate = useNavigate();
  const { checkout } = useCheckout();
  const [, setSearchParams] = useSearchParams();

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  function handleSeeDetail() {
    navigate(`/bookings?hrow=${bookingId}`, { replace: true });
    navigate(`/bookings/${bookingId}`);
  }

  function handleCheckin() {
    navigate(`/bookings?hrow=${bookingId}`, { replace: true });
    navigate(`/checkin/${bookingId}`);
  }

  function handleCheckout() {
    checkout(bookingId);
  }

  return (
    <Table.Row rowId={bookingId}>
      <Booking>{cabinName}</Booking>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(start_date))
            ? 'Today'
            : formatDistanceFromNow(start_date)}{' '}
          &rarr; {num_nights} night stay
        </span>
        <span>
          {format(new Date(start_date), 'MMM dd yyyy')} &mdash;{' '}
          {format(new Date(end_date), 'MMM dd yyyy')}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>

      <Amount>{formatCurrency(total_price)}</Amount>

      <Menus.Menu>
        <Menus.Toggle
          id={bookingId}
          onClick={() => {
            console.log('Menus.Toggle click id', bookingId);
            setSearchParams((params) => {
              params.set('hrow', bookingId);
              return params;
            });
          }}
        />
        <Menus.List id={bookingId}>
          <Menus.Button icon={<HiEye />} onClick={handleSeeDetail}>
            See details
          </Menus.Button>
          {status === 'unconfirmed' && (
            <Menus.Button
              icon={<HiArrowDownOnSquare />}
              onClick={handleCheckin}
            >
              Check-in
            </Menus.Button>
          )}
          {status === 'checked-in' && (
            <Menus.Button
              icon={<HiArrowTopRightOnSquare color="#854d0e" />}
              onClick={handleCheckout}
            >
              Check-out
            </Menus.Button>
          )}
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  );
}

export default BookingRow;
