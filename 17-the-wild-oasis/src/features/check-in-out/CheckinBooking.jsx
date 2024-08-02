import styled from 'styled-components';
import { useState } from 'react';
import { useMoveBack } from '../../hooks/useMoveBack';

import BookingDataBox from '../../features/bookings/BookingDataBox';

import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';
import Checkbox from '../../ui/Checkbox';

import useBooking from '../bookings/useBooking';
import Spinner from '../../ui/Spinner';
import useCheckin from './useCheckin';
import { formatCurrency } from '../../utils/helpers';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  // const history = use/

  const { booking, isLoading } = useBooking();
  const { checkin, isCheckingIn } = useCheckin();
  const [confirmPaid, setConfirmPaid] = useState(false);

  console.log('CheckinBooking', booking);

  if (isLoading) return <Spinner />;

  const {
    id: bookingId,
    status,
    is_paid: bookingIsPaid,
    // guests,
    total_price,
    // num_guests,
    // has_breakfast,
    // num_nights,
    guests: { full_name },
  } = booking;

  function handleCheckin() {
    checkin(
      { id: bookingId },
      {
        onSuccess: (data) => {
          console.log('checkin success', data);
        },
      }
    );
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Box>
        <Checkbox
          id="confirm"
          checked={confirmPaid || bookingIsPaid}
          disabled={bookingIsPaid}
          onChange={() => setConfirmPaid((paid) => !paid)}
        >
          I confirm that {full_name} has paid for the total amount of{' '}
          <strong>{formatCurrency(total_price)}</strong>
        </Checkbox>
      </Box>

      <ButtonGroup>
        {status === 'unconfirmed' && (confirmPaid || bookingIsPaid) && (
          <Button onClick={handleCheckin} disabled={isCheckingIn}>
            Check in booking #{bookingId}
          </Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
