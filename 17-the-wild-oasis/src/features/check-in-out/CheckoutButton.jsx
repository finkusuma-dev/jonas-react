import PropTypes from 'prop-types';

import useCheckout from './useCheckout';
import Button from '../../ui/Button';

CheckoutButton.propTypes = {
  bookingId: PropTypes.number,
};

function CheckoutButton({ bookingId }) {
  const { checkout, isCheckingOut } = useCheckout();

  function handleClick() {
    checkout(bookingId);
  }

  return (
    <Button
      variation="primary"
      size="small"
      onClick={handleClick}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
