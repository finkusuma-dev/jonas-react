import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getCabins } from '../services/apiCabins';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import CreateCabinForm from '../features/cabins/CreateCabinForm';

function Cabins() {
  const [showForm, setShowForm] = useState(false);
  const {
    data: cabins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  });

  console.log('cabins', cabins);

  if (isLoading) return <Spinner />;

  return (
    <>
      {/* <button onClick={() => toast.success('Testing the toast')}>Toast</button> */}
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <div>Filter/Sort</div>
      </Row>

      <Row>
        <CabinTable cabins={cabins} />
        <Button onClick={() => setShowForm((show) => !show)}>
          {showForm ? 'Close form' : 'Add new cabin'}
        </Button>
      </Row>
      {showForm && (
        <Row>
          <Heading as="h2">Add a New Cabin</Heading>
          <CreateCabinForm onInsertSuccess={() => setShowForm(false)} />
        </Row>
      )}
    </>
  );
}

export default Cabins;
