import { useFetcher } from 'react-router-dom';
import Button from '../../ui/Button';
import PropTypes from 'prop-types';
import { updateOrder } from '../../services/apiRestaurant';

UpdateOrder.propTypes = {
  order: PropTypes.object,
};

function UpdateOrder({ order }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="PATCH" className="text-right">
      {/* The order object is not needed because we need to only send PATCH request
          with priority = true.
          
          After user clicking the button, the request will be performed on the ACTION part (below)
          to change priority to true, then the order data will be automatically refreshed to show new data.

          <input type="hidden" name="order" value={JSON.stringify(order)} /> 
      */}
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export default UpdateOrder;

// action.propTypes = {
//   request: PropTypes.object,
//   params: PropTypes.object,
// }

export async function action({ request, params }) {
  // console.log(
  //   'update order',
  //   Object.fromEntries(await request.formData()),
  //   params,
  // );
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}
