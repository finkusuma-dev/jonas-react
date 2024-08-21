import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import useCheckout from '../check-in-out/useCheckout';

import BookingDataBox from './BookingDataBox';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import useBooking from './useBooking';
import Spinner from '../../ui/Spinner';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteBooking } from './useDeleteBooking';
import Empty from '../../ui/Empty';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading, error } = useBooking();
  const { deleteBooking, isDeleting } = useDeleteBooking();

  const { checkout, isCheckingOut } = useCheckout();
  const navigate = useNavigate();

  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  if (isLoading) return <Spinner />;

  if (booking === undefined)
    return (
      <>
        <Empty resourceName="booking" />
      </>
    );

  const { id: bookingId, status } = booking;

  function handleCheckin() {
    navigate(`/checkin/${bookingId}`);
  }

  function handleCheckout() {
    checkout(bookingId);
  }

  function handleDelete() {
    deleteBooking(bookingId);
    navigate(-1);
  }

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking.id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace('-', ' ')}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <Modal>
        <ButtonGroup>
          {status === 'unconfirmed' && (
            <Button onClick={handleCheckin}>Check in</Button>
          )}
          {status === 'checked-in' && (
            <Button
              bookingId={bookingId}
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              Check out
            </Button>
          )}
          {status !== 'Xchecked-out' && (
            <Modal.Open name="delete-booking">
              <Button
                variation="danger"
                // bookingId={bookingId}
                // onClick={handleCheckout}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </Modal.Open>
          )}
          <Button variation="secondary" onClick={moveBack}>
            Back
          </Button>
        </ButtonGroup>
        <Modal.Window name="delete-booking">
          <ConfirmDelete
            resourceName="booking"
            onConfirm={() => {
              handleDelete(bookingId);
            }}
          />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default BookingDetail;
