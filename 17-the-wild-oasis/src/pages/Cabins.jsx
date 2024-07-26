import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import Spinner from '../ui/Spinner';

import { useCabins } from '../features/cabins/useCabins';
import AddEditCabin from '../features/cabins/AddEditCabin';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

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
      <Modal>
        <Row>
          <div>
            <Modal.Open name="add-cabin">
              <Button>Add new cabin</Button>
            </Modal.Open>
          </div>
          <CabinTable cabins={cabins} />
        </Row>

        <Modal.Window name="add-cabin">
          <AddEditCabin />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default Cabins;
