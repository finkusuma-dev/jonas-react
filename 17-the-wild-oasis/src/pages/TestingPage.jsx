import styled from 'styled-components';
import useGuests from '../features/guests/useGuests';
import Heading from '../ui/Heading';
import { Highlight } from '../ui/components/SearchData/components/Highlight';
import SearchData from '../ui/components/SearchData/SearchData';
import Row from '../ui/Row';
import ButtonIcon from '../ui/ButtonIcon';
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import { useDarkMode } from '../context/DarkModeContext';
import { searchEmail } from '../services/apiGuests';
import useSearchEmail from '../features/guests/useSearchEmail';
import { useState } from 'react';

const StyledContainer = styled.div`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  min-height: 100vh;
`;

function TestingPage() {
  const { guests = [], isLoading } = useGuests();
  const [emailSearch, setEmailSearch] = useState('');
  const { guests: guestsFound = [], isLoading: isSearching } = useSearchEmail({
    search: emailSearch,
  });
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // if (isLoading) return <Spinner />;
  console.log(
    `emailSearch: ${emailSearch}`,
    'guestsFound',
    guestsFound.map((guest) => guest.email)
  );

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

        {/* 
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Animal</span>
            <SearchData
              key="search_data_animal"
              name="search_data_animal"
              // data={['dog', 'cat', 'giraw', 'giraffe']}
              data={[
                { name: 'dog', color: 'white' },
                { name: 'cat', color: 'blue' },
                { name: 'dinosaurus', color: 'grey' },
                { name: 'duck', color: 'orange' },
              ]}
              searchField="name"
              placeholder="Search animal"
              // listWidth="40rem"
              columns={[
                {
                  field: 'name',
                },
                {
                  field: 'color',
                },
              ]}
              autoComplete
              onSelect={(idx, selected) =>
                console.log('onSelect', idx, selected)
              }
            />
          </div>
         */}

        {
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Email</span>
            <SearchData
              key="search_data_guests"
              name="static_data_guests"
              data={guests}
              searchField="email"
              placeholder="Search email"
              autoComplete
              isClearable
              styles={{
                inputText: {
                  border: '1px solid var(--color-grey-300)',
                  backgroundColor: 'var(--color-grey-0)',
                  boxShadow: 'var(--shadow-sm)',
                },
                inputTextClearButton: {
                  color: 'red', //var(--color-grey-500)
                },
                list: {
                  backgroundColor: 'var(--color-grey-0)',
                  border: '1px solid var(--color-grey-300)',
                },
                item: {
                  borderBottom: '1px solid var(--color-grey-100)',
                },
                itemActive: {
                  backgroundColor: 'var(--color-brand-500)',
                  color: 'var(--color-grey-0)',
                },
                textHighlight: {
                  backgroundColor: 'var(--color-brand-700)',
                  color: 'white',
                },
              }}
              onSelect={(idx, selected) =>
                console.log('onSelect', idx, selected)
              }
              // RenderDataItem={(dataItem, i, searchText) => (
              //   <Highlight
              //     key={i}
              //     highlightString={searchText}
              //     style={{
              //       backgroundColor: 'var(--color-brand-700)',
              //       color: 'white',
              //     }}
              //   >
              //     {dataItem.email} - {dataItem.fullName}
              //   </Highlight>
              // )}
            />
          </div>
        }
        {
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              // marginTop: '300px',
              // marginBottom: '300px',
            }}
          >
            <span>Email</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <SearchData
                key="dynamic_data_guests"
                name="dynamic_data_guests"
                data={guestsFound}
                dataSearch={emailSearch}
                onSearch={(search) => {
                  // return await searchEmail(search);
                  setEmailSearch(search);
                  // return null;
                }}
                isLoading={isSearching}
                searchField="email"
                placeholder="Search email"
                listWidth="70rem"
                autoComplete
                isClearable
                onSelect={(idx, selected) =>
                  console.log('onSelect', idx, selected)
                }
                onDeselect={() => console.log('Deselect item')}
                columns={[
                  {
                    title: 'Email',
                    field: 'email',
                  },
                  {
                    title: 'Full Name',
                    field: 'fullName',
                  },
                  {
                    title: 'National ID',
                    field: 'nationalID',
                    width: '0.7fr',
                    // align: 'right',
                  },
                  {
                    title: 'Country',
                    field: 'countryFlag',
                    type: 'image',
                    image: {
                      scale: '40%',
                    },
                    width: '0.3fr',
                    align: 'center',
                  },
                ]}
                styles={{
                  inputText: {
                    border: '1px solid var(--color-grey-300)',
                    backgroundColor: 'var(--color-grey-0)',
                    borderRadius: 'var(--border-radius-sm)',
                    padding: '0.8rem 1.2rem',
                    boxShadow: 'var(--shadow-sm)',
                  },
                  inputTextClearButton: {
                    // backgroundColor: '#eee',
                    // borderTopRightRadius: 'var(--border-radius-sm)',
                    // borderBottomRightRadius: 'var(--border-radius-sm)',
                    color: 'var(--color-grey-500)',
                  },
                  inputTextSpinner: {
                    color: 'var(--color-grey-500)',
                  },
                  header: {
                    backgroundColor: 'var(--color-grey-200)',
                    color: 'var(--color-grey-700)',
                  },
                  headerTitle: {
                    // fontWeight: 'bold',
                    // fontStyle: 'italic',
                  },
                  list: {
                    backgroundColor: 'var(--color-grey-0)',
                    borderRadius: 'var(--border-radius-sm)',
                    boxShadow: 'var(--shadow-sm)',
                    fontSize: '1.4rem',
                    border: '1px solid var(--color-grey-300)',
                  },
                  item: {
                    borderBottom: '1px solid var(--color-grey-100)',
                  },
                  itemActive: {
                    backgroundColor: 'var(--color-brand-500)',
                    color: 'var(--color-grey-0)',
                  },
                  textHighlight: {
                    backgroundColor: 'var(--color-brand-700)',
                    color: 'white',
                  },
                }}

                // RenderDataItem={(dataItem, i, searchText) => (
                //   <>
                //     <Highlight
                //       highlightString={searchText}
                //       style={{
                //         backgroundColor: 'var(--color-brand-700)',
                //         color: 'white',
                //       }}
                //     >
                //       {dataItem.email}
                //     </Highlight>
                //     <div>{dataItem.fullName}</div>
                //     <div>{dataItem.nationality}</div>
                //     <div>
                //       <img src={dataItem.countryFlag} width="px" />
                //     </div>
                //   </>
                // )}
              />
              {/* {isSearching && <SpinnerMini />} */}
            </div>
          </div>
        }

        {/* <div>
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
        </div> */}
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
