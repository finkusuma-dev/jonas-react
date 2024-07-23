import { useState } from 'react';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import Spinner from '../ui/Spinner';

import { useCabins } from '../features/cabins/useCabins';
import AddEditCabin from '../features/cabins/AddEditCabin';
import Modal, { ModalContext } from '../ui/Modal';
import Button from '../ui/Button';

function Cabins() {
  const { isLoading, cabins } = useCabins();
  const [cabinToEdit, setCabinToEdit] = useState(null);

  console.log('cabins', cabins);

  if (isLoading) return <Spinner />;

  return (
    <Modal>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <div>Filter/Sort</div>
      </Row>

      <ModalContext.Consumer>
        {({ setWindowOpen, closeWindow }) => (
          <>
            <Row>
              <div>
                <Button
                  onClick={() => {
                    setWindowOpen('add-edit-cabin');
                    setCabinToEdit(null);
                  }}
                >
                  Add new cabin
                </Button>
              </div>
              <CabinTable
                cabins={cabins}
                onEditCabin={(cabin) => {
                  setWindowOpen('add-edit-cabin');
                  setCabinToEdit(cabin);
                }}
              />
            </Row>

            <Modal.Window name="add-edit-cabin">
              <AddEditCabin
                cabinToEdit={cabinToEdit}
                onCloseModal={() => {
                  closeWindow();
                  setCabinToEdit(null);
                }}
              />
            </Modal.Window>
          </>
        )}
      </ModalContext.Consumer>
    </Modal>
  );
}

export default Cabins;
