import Heading from '../ui/Heading';
import Row from '../ui/Row';
import SearchInput from '../ui/SearchInput';

function Guests() {
  return (
    <Row>
      <Heading as="h1">Guest</Heading>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span>Guest</span>
        <SearchInput
          // data={['dog', 'cat', 'giraw', 'giraffe']}
          data={[
            { name: 'dog', color: 'white' },
            { name: 'cat', color: 'grey' },
            { name: 'giraw', color: 'none' },
            { name: 'giraffe', color: 'orange' },
          ]}
          field="name"
          onSelect={(idx, selected) => console.log('onSelect', idx, selected)}
          render={(el, i) => (
            <div key={i}>
              {i + 1}. a {el.color} {el.name}
            </div>
          )}
        />
      </div>
      <div> Next line</div>
    </Row>
  );
}

export default Guests;
