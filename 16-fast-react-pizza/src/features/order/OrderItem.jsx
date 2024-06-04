import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/helpers';

OrderItem.propTypes = {
  item: PropTypes.object,
  isLoadingIngredients: PropTypes.bool,
  ingredients: PropTypes.array,  
}

function OrderItem({ item, isLoadingIngredients, ingredients }) {
  const { quantity, name, totalPrice } = item;

  return (
    <li>
      <div>
        <p>
          <span>{quantity}&times;</span> {name}
        </p>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default OrderItem;
