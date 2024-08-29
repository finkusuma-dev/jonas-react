import styled from 'styled-components';
import useGuests from '../features/guests/useGuests';
import Heading from '../ui/Heading';
import Highlight from '../ui/Highlight';
import SearchData from '../ui/SearchData';
import Row from '../ui/Row';

const StyledContainer = styled.div`
  padding: 4rem 4.8rem 6.4rem;
`;

function TestingPage() {
  const { guests = {}, isLoading } = useGuests();

  return (
    <StyledContainer>
      <Row>
        <Heading as="h1">Testing Page</Heading>
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


        <Highlight
          highlightString="dee"
          style={{
            backgroundColor: 'var(--color-brand-300)',
            color: 'black',
          }}
        >
          Raindeer
        </Highlight>
      </Row>
    </StyledContainer>
  );
}

export default TestingPage;
