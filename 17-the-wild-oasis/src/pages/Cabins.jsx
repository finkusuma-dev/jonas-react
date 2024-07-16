import { useQuery } from '@tanstack/react-query';
import { getCabins } from '../services/apiCabins';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import CabinTable from '../features/cabins/CabinTable';
import Spinner from '../ui/Spinner';

function Cabins() {
  const {
    data: cabins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: getCabins,
  });

  console.log('cabins', cabins);

  if (isLoading) return <Spinner />;

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <div>Filter/Sort</div>
      </Row>
      <CabinTable cabins={cabins} />
    </>
  );
}

export default Cabins;
