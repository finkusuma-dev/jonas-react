import PropTypes from 'prop-types';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import CreateCabinForm from './CreateCabinForm';
import Modal from '../../ui/Modal';

AddEditCabin.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func,
};

function AddEditCabin({ cabinToEdit, onCloseModal }) {
  return (
    <Modal onClose={onCloseModal}>
      <Row>
        <Heading as="h2">
          {cabinToEdit ? 'Edit cabin' : 'Add a New Cabin'}
        </Heading>
        <CreateCabinForm
          onCloseModal={onCloseModal}
          cabinToEdit={cabinToEdit}
        />
      </Row>
    </Modal>
  );
}

export default AddEditCabin;
