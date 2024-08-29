import useGuests from '../features/guests/useGuests';
import Heading from '../ui/Heading';
import Row from '../ui/Row';
import SearchData from '../ui/SearchData';
import Highlight from '../ui/Highlight';

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
              <Highlight
                key={i}
                highlightString={searchText}
                style={{
                  backgroundColor: 'var(--color-brand-700)',
                  color: 'white',
                }}
              >
                {item.email} - {item.fullName}
              </Highlight>
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
            listColumns="1fr 1fr 0.7fr 0.1fr"
            renderItem={(item, i, searchText) => (
              <>
                <Highlight
                  key={i}
                  highlightString={searchText}
                  style={{
                    backgroundColor: 'var(--color-brand-700)',
                    color: 'white',
                  }}
                >
                  {item.email}
                </Highlight>
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
      <Highlight
        highlightString="dee"
        style={{
          backgroundColor: 'var(--color-brand-200)',
          color: 'black',
        }}
      >
        Raindeer
      </Highlight>
    </>
  );
}

export default Guests;
