import PropTypes from 'prop-types'
import { formatCurrency } from "../../utils/helpers";

CartItem.propTypes = {
  item: PropTypes.object
}


function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  return (
    <li>
      <p>
        {quantity}&times; {name}
      </p>
      <div>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default CartItem;
