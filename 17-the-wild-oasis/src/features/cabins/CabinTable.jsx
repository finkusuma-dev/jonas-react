import { useCabins } from '../../features/cabins/useCabins';
import Spinner from '../../ui/Spinner';

import CabinRow from './CabinRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useSearchParams } from 'react-router-dom';
import { camelToUnderscore } from '../../utils/helpers';
import Empty from '../../ui/Empty';

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  const discountFilter = searchParams.get('discount') || 'all';

  const sortBy = searchParams.get('sort') || 'name-asc';

  if (!cabins?.length) return <Empty resourceName="cabins" />;

  console.log('cabins', cabins);
  console.log('sortBy', sortBy);

  const filteredCabins = cabins?.filter(
    (cabin) =>
      discountFilter === 'all' ||
      (discountFilter == 'no-discount' && cabin.discount === 0) ||
      (discountFilter == 'with-discount' && cabin.discount > 0)
  );

  const [field, direction] = sortBy.split('-');

  const sortModifier = direction === 'asc' ? 1 : -1;

  const sortedCabins = filteredCabins?.sort((a, b) => {
    if (field === 'name') {
      /// For String fields
      return (
        (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1) * sortModifier
      );
    } else {
      /// For Number fields
      return (
        (a[camelToUnderscore(field)] - b[camelToUnderscore(field)]) *
        sortModifier
      );
    }
  });

  if (isLoading) return <Spinner />;

  return (
    <>
      <Menus>
        <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
          <Table.Header role="row">
            <div></div>
            <div>Cabin</div>
            <div>Capacity</div>
            <div>Price</div>
            <div>Discount</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={sortedCabins}
            render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
          />
        </Table>
      </Menus>
    </>
  );
}

export default CabinTable;
