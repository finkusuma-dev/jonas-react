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
    // error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  });

  const [cabinToEdit, setCabinToEdit] = useState(null);

  function handleAddNewCabin() {
    setCabinToEdit(null);
    setShowForm((show) => !show);
  }

  function handleEditCabin(cabin) {
    setShowForm(true);
    setCabinToEdit(cabin);
  }

  function handleInsertOrUpdateSuccess() {
    setShowForm(false);
    setCabinToEdit(null);
  }

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
        <CabinTable cabins={cabins} onEditCabin={handleEditCabin} />
        <Button onClick={handleAddNewCabin}>
          {showForm ? 'Close form' : 'Add new cabin'}
        </Button>
      </Row>
      {showForm && (
        <Row>
          <Heading as="h2">
            {cabinToEdit ? 'Edit cabin' : 'Add a New Cabin'}
          </Heading>
          <CreateCabinForm
            onInsertSuccess={handleInsertOrUpdateSuccess}
            cabinToEdit={cabinToEdit}
          />
        </Row>
      )}
    </>
  );
}

export default Cabins;
