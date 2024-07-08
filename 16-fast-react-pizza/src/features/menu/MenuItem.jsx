import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers';
import Button from '../../ui/Button';
import { cartActions, cartGetters } from '../cart/cartSlice';
import UpdateItemQuantity from '../cart/UpdateItemQuantity';

MenuItem.propTypes = {
  pizza: PropTypes.object,
};

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQty = useSelector(cartGetters.getItemQuantityById(id));
  const dispatch = useDispatch();

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      unitPrice,
      quantity: 1,
      totalPrice: unitPrice,
    };

    dispatch(cartActions.addItem(newItem));
  }

  function handleDeleteItem() {
    dispatch(cartActions.deleteItem(pizza.id));
  }

  return (
    <li className="flex gap-3 py-3">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <p className="text-sm capitalize italic text-stone-500">
          {ingredients.join(', ')}
        </p>
        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium text-stone-500">Sold out</p>
          )}

          {currentQty > 0 && (
            <div className="flex items-center gap-3 sm:gap-8">
              <UpdateItemQuantity pizzaId={id} currentQty={currentQty} />
              <Button type="small" onClick={handleDeleteItem}>
                Delete
              </Button>
            </div>
          )}
          {currentQty === 0 && !soldOut && (
            <Button type="small" onClick={handleAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
