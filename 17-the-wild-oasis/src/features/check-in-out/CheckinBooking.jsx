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
import { useSettings } from '../settings/useSettings';
import { useEffect } from 'react';

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

const Total = styled.span`
  font-weight: bold;
  font-size: large;
`;

function CheckinBooking() {
  const moveBack = useMoveBack();
  // const history = use/

  const { booking, isLoading } = useBooking();
  const { checkin, isCheckingIn } = useCheckin();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const { settings, isLoading: isLoadingSettings } = useSettings();

  useEffect(() => {
    setAddBreakfast(booking?.hasBreakfast);
  }, [booking?.hasBreakfast]);

  if (isLoading || isLoadingSettings) return <Spinner />;

  const { breakfastPrice } = settings;

  // console.log('settings', settings);
  // console.log('CheckinBooking', booking);

  const {
    id: bookingId,
    status: dbStatus,
    isPaid: dbIsPaid,
    // guests,
    cabinPrice: dbCabinPrice,
    numGuests: dbNumGuests,
    numNights: dbNumNights,
    hasBreakfast: dbHasBreakfast,
    guests: { fullName: dbGuestFullName },
  } = booking;

  function handleCheckin() {
    if (addBreakfast) {
      checkin({
        id: bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrice: optionalBreakfastPrice,
          totalPrice: totalPrice,
        },
      });
    } else {
      checkin({
        id: bookingId,
        breakfast: {
          hasBreakfast: false,
          extrasPrice: 0,
          totalPrice: dbCabinPrice,
        },
      });
    }
  }

  /// Conditions:
  ///
  /// 1. Havent paid, doesn't have breakfast.
  ///    - Hide checkin.
  ///    - show confirm payment (cabin).
  ///    - Show add breakfast.
  ///       - If breakfast is added, show confirm payment (cabin & breakfast).
  ///         - If confirm paid, show checkin.
  /// 2. Havent paid, has breakfast.
  ///    - Hide checkin.
  ///    - show confirm payment (cabin & breakfast).
  ///    - Show cancel breakfast.
  ///       - if breakfast is canceled, show confirm payment (cabin)
  ///         - If confirm paid, show checkin
  /// 3. Paid, doesn't have breakfast.
  ///    - Show checkin
  ///    - Show add breakfast.
  ///       - if breakfast is added, show confirm payment (breakfast), hide checkin.
  ///         - If confirm paid, show checkin
  /// 4. Paid, has breakfast.
  ///    - Show checkin.

  const showAddBreakfast = !dbIsPaid || !dbHasBreakfast;
  const showConfirmPayment =
    !dbIsPaid || (dbIsPaid && !dbHasBreakfast && addBreakfast);
  const showCheckIn =
    (dbIsPaid && (dbHasBreakfast || !addBreakfast)) || confirmPaid;

  const checkPaid = (dbIsPaid && !addBreakfast) || confirmPaid;
  const optionalBreakfastPrice = dbNumGuests * dbNumNights * breakfastPrice;
  const totalPrice = dbCabinPrice + (addBreakfast ? optionalBreakfastPrice : 0);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {showAddBreakfast && (
        <Box>
          <Checkbox
            id="confirm-breakfast"
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((check) => !check);
              setConfirmPaid(false);
            }}
          >
            Want to add breakfast
            {(!dbIsPaid || !dbHasBreakfast) && (
              <span>(for {formatCurrency(optionalBreakfastPrice)})</span>
            )}
          </Checkbox>
        </Box>
      )}

      {showConfirmPayment && (
        <Box>
          <Checkbox
            id="confirm"
            checked={checkPaid}
            // disabled={disablePaid}
            onChange={() => setConfirmPaid((paid) => !paid)}
          >
            <Row>
              {/* Confirm payment for breakfast price only or total price */}
              <p>
                I confirm that {dbGuestFullName} has paid for{' '}
                {dbIsPaid && addBreakfast ? (
                  /* Confirm only for breakfast price when it's paid but breakfast is added */
                  <span>
                    breakfast{' '}
                    <Total> {formatCurrency(optionalBreakfastPrice)}</Total>.
                  </span>
                ) : (
                  /* Confirm for total price */
                  <span>
                    the total amount of{' '}
                    <Total> {formatCurrency(totalPrice)}</Total>.
                  </span>
                )}
              </p>
              {/*If breakfast is added, show extra info of cabin & breakfast prices */}
              {addBreakfast && (
                <p>
                  (cabin: {formatCurrency(dbCabinPrice)} + breakfast:{' '}
                  {formatCurrency(optionalBreakfastPrice)})
                </p>
              )}
            </Row>
          </Checkbox>
        </Box>
      )}

      <ButtonGroup>
        {dbStatus === 'unconfirmed' && showCheckIn && (
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
