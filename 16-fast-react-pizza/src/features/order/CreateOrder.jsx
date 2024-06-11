import { Form } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import { redirect } from 'react-router-dom';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: 'Mediterranean',
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: 'Vegetale',
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: 'Spinach and Mushroom',
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const errors = useActionData();
  const cart = fakeCart;

  const className =
    'w-full rounded-full border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500';

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required className={className} />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required className={className} />
          </div>
          {errors?.phone && <div>{errors.phone}</div>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required className={className} />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-4 w-4 accent-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:ring-offset-2"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button
            disabled={isSubmitting}
            className="rounded-full bg-yellow-400 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Placing order...' : 'Order now'}
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // console.log('data', data);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };

  const errors = {};
  if (!isValidPhone(data.phone)) {
    errors.phone =
      'Please enter your valid phone number. We might need to contact you.';
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  // console.log('order', order);

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
