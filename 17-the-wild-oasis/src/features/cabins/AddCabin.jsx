import PropTypes from 'prop-types';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import CreateCabinForm from './CreateCabinForm';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
// import Modal from '../../ui/Modal';

AddCabin.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func,
};

function AddCabin({ cabinToEdit = null, onCloseModal }) {
  return (
    <Modal>
      <Modal.Open name="add-cabin">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="add-cabin">
        <Row>
          <Heading as="h2">
            {cabinToEdit ? 'Edit cabin' : 'Add A New Cabin'}
          </Heading>
          <CreateCabinForm
            onCloseModal={onCloseModal}
            cabinToEdit={cabinToEdit}
          />
        </Row>
      </Modal.Window>
    </Modal>
  );
}

export default AddCabin;
