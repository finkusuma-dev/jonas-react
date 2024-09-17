import useGuests from '../features/guests/useGuests';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Guests() {
  const { guests = {}, isLoading } = useGuests();
  // console.log('guests', guests);
  return (
    <>
      <Row>
        <Heading as="h1">Guest</Heading>
      </Row>
    </>
  );
}

export default Guests;
