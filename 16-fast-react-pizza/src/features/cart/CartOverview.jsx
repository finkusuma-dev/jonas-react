import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cartGetters } from './cartSlice';

function CartOverview() {
  const totalCartQty = useSelector(cartGetters.getTotalCartQuantity);
  const totalPrice = useSelector(cartGetters.getTotalCartPrice);

  if (totalCartQty === 0) return null;
  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
      <p className="space-x-4 text-stone-300 sm:space-x-6">
        <span>{totalCartQty} pizzas</span>
        <span>${totalPrice}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
