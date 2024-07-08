import { Form } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import { redirect } from 'react-router-dom';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { cartActions, cartGetters } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store';
import { userActions, userGetters } from '../user/userSlice';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isSubmitting = navigation.state === 'submitting';

  const {
    username,
    status: addressStatus,
    address,
    position,
    error: errorAddress,
  } = useSelector(userGetters.getUser);
  const isLoadingAddress = addressStatus === 'loading';
  const errors = useActionData();
  const cart = useSelector(cartGetters.getCart);
  const totalCartPrice = useSelector(cartGetters.getTotalCartPrice);

  const priorityPrice = withPriority ? 0.2 * totalCartPrice : 0;
  const cartPrice = priorityPrice + totalCartPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="mx-6 my-4">
      <h2 className="mb-10 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      <Form method="POST" className="">
        {/* Username */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start">
          <label className="sm:mt-1.5 sm:shrink-0 sm:basis-40">
            Phone number
          </label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {errors?.phone && (
              <div className="mt-2 rounded-lg bg-red-100 p-2 text-xs text-red-700">
                {errors.phone}
              </div>
            )}
          </div>
        </div>

        {/* Address - Input and Get position button */}
        <div className="relative mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              defaultValue={address}
              disabled={isLoadingAddress}
            />
          </div>
          <span className="absolute bottom-[3.5px] right-[3px] z-50 md:bottom-[1px]">
            {!position.latitude && !position.longitude && (
              <Button
                type="small"
                onClick={(e) => {
                  // if (userStatus !== 'idle') return;
                  e.preventDefault();
                  dispatch(userActions.fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                {addressStatus === 'loading' ? 'Loading...' : 'Get Position'}
              </Button>
            )}
          </span>
        </div>
        {addressStatus === 'error' && (
          <div className="my-2 rounded-lg bg-red-100 p-2 text-xs text-red-700">
            {errorAddress}
          </div>
        )}

        {/* Priority of the order */}
        <div className="mb-10 flex items-center gap-3">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-4 w-4 accent-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          {/* Hidden cart object & position */}
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ''
            }
          />
          {/* Submit button */}
          <Button disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? 'Placing order...'
              : `Order now from ${formatCurrency(cartPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  console.log('data', data);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on' || data.priority === 'true',
  };

  // console.log('order', order);

  const errors = {};
  if (!isValidPhone(data.phone)) {
    errors.phone =
      'Please enter your valid phone number. We might need to contact you.';
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  /// On action we cannot use `useDispatch` but import the store and use its dispatch directly.
  /// It's bit kind of a hack, so don't over use it because it deactivates couple of performance optimization of
  /// Redux on this page.
  ///
  store.dispatch(cartActions.clearCart());
  // console.log('order', order);

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
