import { useState } from 'react';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { useCabins } from '../features/cabins/useCabins';
import AddEditCabin from '../features/cabins/AddEditCabin';

function Cabins() {
  const { isLoading, cabins } = useCabins();

  const [showForm, setShowForm] = useState(false);
  const [cabinToEdit, setCabinToEdit] = useState(null);

  function handleAddNewCabin() {
    setCabinToEdit(null);
    setShowForm((show) => !show);
  }

  function handleEditCabin(cabin) {
    setCabinToEdit(cabin);
    setShowForm(true);
  }

  function onCloseModal() {
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
        <div>
          <Button onClick={handleAddNewCabin}>
            {showForm ? 'Close form' : 'Add new cabin'}
          </Button>
        </div>
        <CabinTable cabins={cabins} onEditCabin={handleEditCabin} />
      </Row>

      {showForm && (
        <AddEditCabin cabinToEdit={cabinToEdit} onCloseModal={onCloseModal} />
      )}
    </>
  );
}

export default Cabins;
