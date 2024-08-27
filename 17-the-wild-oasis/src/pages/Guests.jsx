import Heading from '../ui/Heading';
import Row from '../ui/Row';
import SearchInput from '../ui/SearchInput';

function Guests() {
  return (
    <Row>
      <Heading as="h1">Guest</Heading>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span>Guest</span>
      </div>
      <div> Next line</div>
    </Row>
  );
}

export default Guests;
