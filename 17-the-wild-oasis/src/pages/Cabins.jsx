import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import Spinner from '../ui/Spinner';

import { useCabins } from '../features/cabins/useCabins';
import AddCabin from '../features/cabins/AddCabin';
// import Modal from '../ui/Modal';
// import Button from '../ui/Button';

function Cabins() {
  const { isLoading, cabins } = useCabins();

  console.log('cabins', cabins);

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <div>Filter/Sort</div>
      </Row>
      <Row>
        <AddCabin />
        <CabinTable cabins={cabins} />
      </Row>
    </>
  );
}

export default Cabins;
