import styled from 'styled-components';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/helpers';
import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2';
import { useInsertCabin } from './useInsertCabin';
import Table from '../../ui/Table';
import Menus from '../../ui/Menus';
import Modal from '../../ui/Modal';
import ConfirmDelete from '../../ui/ConfirmDelete';
import { useDeleteCabin } from './useDeleteCabin';
import CreateCabinForm from './CreateCabinForm';

// const TableRow = styled.div`
//   display: grid;
//   grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//   column-gap: 2.4rem;
//   align-items: center;
//   padding: 1.4rem 2.4rem;

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }
// `;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`;

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`;

CabinRow.propTypes = {
  cabin: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

function CabinRow({ cabin, onEdit, onDelete }) {
  const {
    // created_at,
    // description,
    discount,
    id: cabinId,
    name,
    max_capacity,
    regular_price,
    description,
    image,
  } = cabin;

  const { insertCabin } = useInsertCabin();
  const { deleteCabin } = useDeleteCabin();

  function handleDuplicate() {
    const newCabin = {
      name: `Copy of ${name}`,
      discount,
      max_capacity,
      regular_price,
      description,
      image,
    };

    // delete newCabin.id;
    // delete newCabin.created_at;

    console.log('duplicate, new cabin', newCabin);

    insertCabin(newCabin, {});
  }

  return (
    <Table.Row role="row">
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {max_capacity} guests</div>
      <Price>{formatCurrency(regular_price)}</Price>
      <Discount>
        {discount ? formatCurrency(discount) : <span>&mdash;</span>}
      </Discount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={cabinId} />
          <Menus.List id={cabinId}>
            <Menus.Button onClick={handleDuplicate}>
              <span>
                <HiSquare2Stack />
              </span>
              Duplicate
            </Menus.Button>
            <Modal.Open name="edit-cabin">
              <Menus.Button onClick={onEdit}>
                <span>
                  <HiPencil />
                </span>
                Edit
              </Menus.Button>
            </Modal.Open>
            <Modal.Open name="delete-cabin">
              <Menus.Button onClick={onDelete}>
                <span>
                  <HiTrash />
                </span>
                Delete
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="edit-cabin">
          <CreateCabinForm cabinToEdit={cabin} />
        </Modal.Window>
        <Modal.Window name="delete-cabin">
          <ConfirmDelete
            resourceName="cabins"
            onConfirm={() => {
              deleteCabin(cabin.id);
            }}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default CabinRow;
