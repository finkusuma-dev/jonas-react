import PropTypes from 'prop-types';
import Heading from '../../ui/Heading';
import Row from '../../ui/Row';
import CreateCabinForm from './CreateCabinForm';
// import Modal from '../../ui/Modal';

AddEditCabin.propTypes = {
  cabinToEdit: PropTypes.object,
  onCloseModal: PropTypes.func,
};

function AddEditCabin({ cabinToEdit, onCloseModal }) {
  return (
    <Row>
      <Heading as="h2">
        {cabinToEdit ? 'Edit cabin' : 'Add A New Cabin'}
      </Heading>
      <CreateCabinForm onCloseModal={onCloseModal} cabinToEdit={cabinToEdit} />
    </Row>
  );
}

export default AddEditCabin;
