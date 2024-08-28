import useGuests from '../features/guests/useGuests';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import SearchData from '../ui/SearchData';
import SpanHighlight from '../ui/SpanHighlight';

function Guests() {
  const { guests = {}, isLoading } = useGuests();
  // console.log('guests', guests);
  return (
    <>
      <Row>
        <Heading as="h1">Guest</Heading>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Email</span>
          <SearchData
            // data={['dog', 'cat', 'giraw', 'giraffe']}
            // data={[
            //   { name: 'dog', color: 'white' },
            //   { name: 'cat', color: 'grey' },
            //   { name: 'giraw', color: 'none' },
            //   { name: 'giraffe', color: 'orange' },
            // ]}
            data={guests}
            searchProp="email"
            placeholder="Insert email"
            onSelect={(idx, selected) => console.log('onSelect', idx, selected)}
            renderItem={(item, i, searchText) => (
              <SpanHighlight
                key={i}
                highlightString={searchText}
                style={{
                  backgroundColor: 'var(--color-brand-700)',
                  color: 'white',
                }}
              >
                {item.email} - {item.fullName}
              </SpanHighlight>
            )}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span>Email</span>
          <SearchData
            data={guests}
            searchProp="email"
            placeholder="Insert email"
            listWidth="70rem"
            listColumns="1fr 1fr 0.7fr 0.3fr"
            renderItem={(item, i, searchText) => (
              <>
                <SpanHighlight
                  key={i}
                  highlightString={searchText}
                  style={{
                    backgroundColor: 'var(--color-brand-700)',
                    color: 'white',
                  }}
                >
                  {item.email}
                </SpanHighlight>
                <div>{item.fullName}</div>
                <div>{item.nationality}</div>
                <div>
                  <img src={item.countryFlag} width="20rem" />
                </div>
              </>
            )}
            onSelect={(idx, selected) => console.log('onSelect', idx, selected)}
          />
        </div>

        <div> Next line</div>
      </Row>
      <SpanHighlight
        highlightString="dee"
        style={{
          backgroundColor: 'var(--color-brand-200)',
          color: 'black',
        }}
      >
        Raindeer
      </SpanHighlight>
    </>
  );
}

export default Guests;
