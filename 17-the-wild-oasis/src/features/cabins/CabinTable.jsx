import { useCabins } from '../../features/cabins/useCabins';
import Spinner from '../../ui/Spinner';

import CabinRow from './CabinRow';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import { useSearchParams } from 'react-router-dom';

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();
  const discountFilter = searchParams.get('discount') || 'all';

  console.log('cabins', cabins);
  const filteredCabins = cabins?.filter(
    (cabin) =>
      discountFilter === 'all' ||
      (discountFilter == 'no-discount' && cabin.discount === 0) ||
      (discountFilter == 'with-discount' && cabin.discount > 0)
  );

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
            data={filteredCabins}
            render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
          />
        </Table>
      </Menus>
    </>
  );
}

export default CabinTable;
