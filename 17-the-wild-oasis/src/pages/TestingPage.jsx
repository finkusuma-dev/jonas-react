import styled from 'styled-components';
import useGuests from '../features/guests/useGuests';
import Heading from '../ui/Heading';
import Highlight from '../ui/Highlight';
import SearchData from '../ui/components/SearchData/SearchData';
import Row from '../ui/Row';
import ButtonIcon from '../ui/ButtonIcon';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { useDarkMode } from '../context/DarkModeContext';

const StyledContainer = styled.div`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
`;

function TestingPage() {
  const { guests = [] } = useGuests();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <StyledContainer>
      <ButtonIcon
        onClick={toggleDarkMode}
        style={{ position: 'fixed', right: '1.5rem', top: '1.5rem' }}
      >
        {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
      </ButtonIcon>
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
            placeholder="Search email"
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

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '300px',
            marginBottom: '300px',
          }}
        >
          <span>Email</span>
          <SearchData
            data={guests}
            searchProp="email"
            placeholder="Search email"
            listWidth="70rem"
            autoComplete={true}
            asTable={true}
            tableColumns={[
              {
                header: 'Email',
              },
              {
                header: 'Full Name',
              },
              {
                header: 'National ID',
                width: '0.7fr',
              },
              {
                header: 'Country',
                width: '0.3fr',
                align: 'center',
              },
            ]}
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
                <div style={{ justifySelf: 'center' }}>
                  <img src={item.countryFlag} width="20rem" />
                </div>
              </>
            )}
            onSelect={(idx, selected) => console.log('onSelect', idx, selected)}
          />
        </div>

        <div>
          <select inputMode="search">
            <option>Giraffe</option>
            <option>Elephant</option>
          </select>
        </div>
        <div>
          <input type="text" name="city" list="cityname" autoComplete="true" />
          <datalist id="cityname">
            <option value="Boston">Boston</option>
            <option value="Cambridge">Cambridge</option>
          </datalist>
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
