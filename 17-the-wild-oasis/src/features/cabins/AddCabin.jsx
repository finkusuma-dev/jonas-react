import PropTypes from 'prop-types';
import CreateCabinForm from './CreateCabinForm';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
// import Modal from '../../ui/Modal';

AddCabin.propTypes = {
  cabinToEdit: PropTypes.object,
};

function AddCabin({ cabinToEdit = null }) {
  return (
    <Modal>
      <Modal.Open name="add-cabin">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="add-cabin">
        <CreateCabinForm cabinToEdit={cabinToEdit} />
      </Modal.Window>
    </Modal>
  );
}

export default AddCabin;
