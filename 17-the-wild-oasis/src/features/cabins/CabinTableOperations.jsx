import Filter from '../../ui/Filter';
import TableOperations from '../../ui/TableOperations';

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        name="discount"
        options={['all', 'no-discount', 'with-discount']}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
