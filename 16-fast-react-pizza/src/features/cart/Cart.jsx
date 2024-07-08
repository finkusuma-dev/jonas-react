import { useSelector, useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import LinkButton from '../../ui/LinkButton';
import CartItem from './CartItem';
import { cartActions, cartGetters } from './cartSlice';
import EmptyCart from './EmptyCart';

function Cart() {
  // const cart = fakeCart;
  const username = useSelector((store) => store.user.username);
  const cart = useSelector(cartGetters.getCart);
  const dispatch = useDispatch();

  // console.log('cart', cart);

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="mx-4 my-3">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className="mt-7 text-xl font-semibold">Your cart, {username}</h2>

      <ul className="mt-3 divide-y divide-stone-200 border-b">
        {cart.map((item) => (
          <CartItem key={item.pizzaId} item={item}></CartItem>
        ))}
      </ul>
      <div className="mt-6 space-x-2">
        <Button to="/order/new">Order pizzas</Button>
        <Button
          type="secondary"
          onClick={() => dispatch(cartActions.clearCart())}
        >
          Clear cart
        </Button>
      </div>
    </div>
  );
}

export default Cart;
