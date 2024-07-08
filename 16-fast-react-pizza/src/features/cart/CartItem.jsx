import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import { cartActions, cartGetters } from './cartSlice';
import UpdateItemQuantity from './UpdateItemQuantity';
import { useSelector } from 'react-redux';

CartItem.propTypes = {
  item: PropTypes.object,
};

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;
  const currentQty = useSelector(cartGetters.getItemQuantityById(pizzaId));
  const dispatch = useDispatch();

  function handleDeleteItem() {
    dispatch(cartActions.deleteItem(pizzaId));
  }

  return (
    <li className="py-2 sm:flex sm:items-center sm:justify-between">
      <p className="mb-0.5">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        <div className="flex items-center gap-3 sm:gap-8">
          <UpdateItemQuantity pizzaId={pizzaId} currentQty={currentQty} />
          <Button type="small" onClick={handleDeleteItem}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
