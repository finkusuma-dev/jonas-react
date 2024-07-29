import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';
import TableOperations from '../../ui/TableOperations';

function CabinTableOperations() {
  return (
    <>
      <TableOperations>
        <Filter
          type="white"
          name="discount"
          options={['all', 'no-discount', 'with-discount']}
        />
      </TableOperations>
      <SortBy
        options={[
          {
            label: 'Order by name (A-Z)',
            value: 'name-asc',
          },
          {
            label: 'Order by name (Z-A)',
            value: 'name-desc',
          },
          {
            label: 'Order by price (Low to High)',
            value: 'regularPrice-asc',
          },
          {
            label: 'Order by price ( High to Low)',
            value: 'regularPrice-desc',
          },

          {
            label: 'Order by capacity (Low to High)',
            value: 'maxCapacity-asc',
          },
          {
            label: 'Order by capacity (High to Low)',
            value: 'maxCapacity-desc',
          },
        ]}
      />
    </>
  );
}

export default CabinTableOperations;
