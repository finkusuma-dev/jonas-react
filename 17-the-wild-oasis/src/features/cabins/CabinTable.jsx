import styled from 'styled-components';
import PropTypes from 'prop-types';
import CabinRow from './CabinRow';
import Modal, { ModalContext } from '../../ui/Modal';
import AddEditCabin from './AddEditCabin';
import { useContext } from 'react';
import { useState } from 'react';

const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

CabinTable.propTypes = {
  cabins: PropTypes.array,
};

function CabinTable({ cabins }) {
  const [cabinToEdit, setCabinToEdit] = useState(null);
  const { closeModal, openModal } = useContext(ModalContext);
  return (
    <>
      <Table role="table">
        <TableHeader role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </TableHeader>
        {cabins.map((cabin) => (
          <CabinRow
            key={cabin.id}
            cabin={cabin}
            onClick={() => {
              openModal('edit-cabin');
              setCabinToEdit(cabin);
            }}
          />
        ))}
      </Table>
      <Modal.Window name="edit-cabin">
        <AddEditCabin
          cabinToEdit={cabinToEdit}
          onCloseModal={() => {
            closeModal();
          }}
        />
      </Modal.Window>
    </>
  );
}

export default CabinTable;
