import { useDispatch } from 'react-redux';
import { cartActions } from './cartSlice';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';

UpdateItemQuantity.propTypes = {
  pizzaId: PropTypes.number,
  currentQty: PropTypes.number,
};

function UpdateItemQuantity({ pizzaId, currentQty }) {
  const dispatch = useDispatch();

  function handleIncQty() {
    dispatch(cartActions.incItemQuantity(pizzaId));
  }
  function handleDecQty() {
    dispatch(cartActions.decItemQuantity(pizzaId));
  }

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <Button type="round" onClick={handleDecQty}>
        -
      </Button>
      <div className="text-sm">{currentQty}</div>
      <Button type="round" onClick={handleIncQty}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
