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
import { useRef } from 'react';
import FormRow from '../ui/FormRow';
import Form from '../ui/Form';
import Button from '../ui/Button';
import { useForm } from 'react-hook-form';

const StyledContainer = styled.div`
  background-color: var(--color-grey-50);
  padding: 4rem 4.8rem 6.4rem;
  min-height: 100vh;
`;

function TestingPage() {
  const { guests = [], isLoading } = useGuests();
  const [emailSearch, setEmailSearch] = useState('');
  const [showAllGuests, setshowAllGuests] = useState(false);
  const { guests: guestsFound = [], isLoading: isSearching } = useSearchEmail({
    search: emailSearch,
  });
  const [isShowList, setIsShowList] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const refSearchData = useRef();

  const { register, handleSubmit, setValue, formState, watch, reset, trigger } =
    useForm();
  const { errors } = formState;
  console.log('errors', errors);

  const sortedGuests = guests.sort((a, b) =>
    a.email < b.email ? -1 : a.email > b.email ? 1 : 0
  );

  function onSubmit(data) {
    console.log('data', data);
  }

  // if (isLoading) return <Spinner />;
  // console.log(
  //   `emailSearch: ${emailSearch}`,
  //   'guestsFound',
  //   guestsFound.map((guest) => guest.email)
  // );

  const email2Value = watch('email2');
  // console.log('email2', email2Value);

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

        {
          /* 
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Animal</span>
            <div /* style={{ display: 'flex', alignItems: 'center', gap: '20px' }} */
          // >
          //   <SearchData
          //     key="search_data_animal"
          //     name="search_data_animal"
          //     // data={['dog', 'cat', 'giraw', 'giraffe']}
          //     data={[
          //       { name: 'dog', color: 'white' },
          //       { name: 'cat', color: 'blue' },
          //       { name: 'dinosaurus', color: 'grey' },
          //       { name: 'duck', color: 'orange' },
          //     ]}
          //     searchField="name"
          //     placeholder="Search animal"
          //     // listWidth="40rem"
          //     columns={[
          //       {
          //         field: 'name',
          //       },
          //       {
          //         field: 'color',
          //       },
          //     ]}
          //     autoComplete
          //     onSelect={(idx, selected) =>
          //       console.log('onSelect', idx, selected)
          //     }
          //   />
          // </div>
        }

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}> */}
          {/* <span>Email</span> */}
          <FormRow label="Email 1">
            <SearchData
              key="search_data_guests"
              name="email1"
              data={sortedGuests}
              searchField="email"
              placeholder="Search email"
              autoComplete
              isClearable
              onChange={(e) => setValue('email1', e.target.value)}
              styles={{
                inputText: {
                  border: '1px solid var(--color-grey-300)',
                  backgroundColor: 'var(--color-grey-0)',
                  boxShadow: 'var(--shadow-sm)',
                },
                inputTextDropDownButton: {
                  color: 'var(--color-grey-500)',
                },
                inputTextDropDownButtonActive: {
                  color: 'var(--color-brand-500)',
                },
                inputTextClearButton: {
                  color: 'var(--color-grey-500)',
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
          </FormRow>
          <div
            style={{
              marginTop: '100px',
            }}
          ></div>

          {/* </div> */}

          {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              // marginTop: '300px',
              // marginBottom: '300px',
            }}
          > */}
          {/* <span>Email</span> */}
          <FormRow label="Email 2" errorMsg={errors?.email2?.message}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <SearchData
                key="dynamic_data_guests"
                name="email2"
                ref={refSearchData}
                data={sortedGuests}
                searchData={guestsFound}
                search={emailSearch}
                onSearch={setEmailSearch}
                isLoading={isSearching}
                isShowList={isShowList}
                onShowList={(show) => {
                  // setshowAllGuests(show);
                  setIsShowList(show);
                }}
                searchField="email"
                placeholder="Search email"
                listWidth="70rem"
                isUseData={showAllGuests}
                autoComplete
                isClearable
                /* Props to be passed to input text  */
                disabled={false}
                /* --- */
                {...register('email2', {
                  required: 'Please insert email',
                })}
                value={email2Value}
                onChange={(e) => {
                  console.log('onChange', e);
                  // if (e.target.value) {
                  //   errors.email2.message = undefined;
                  // }
                  setValue('email2', e.target.value);

                  /// trigger revalidation (reset the error of email2)
                  trigger('email2');
                }}
                ///
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
                  inputTextDropDownButton: {
                    borderTopRightRadius: 'var(--border-radius-sm)',
                    borderBottomRightRadius: 'var(--border-radius-sm)',
                    backgroundColor: 'var(--color-grey-100)',
                    paddingLeft: '10px',
                    color: 'var(--color-grey-500)',
                  },
                  inputTextDropDownButtonActive: {
                    color: 'var(--color-brand-500)',
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
              {
                <label
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setshowAllGuests((show) => !show);
                    setIsShowList(!showAllGuests);
                    refSearchData.current.focus();
                  }}
                >
                  {showAllGuests ? 'Hide all guests' : 'Show all guests'}
                </label>
              }
            </div>
          </FormRow>
          <FormRow>
            <Button
              className="formButton"
              variation="secondary"
              type="reset"
              onClick={() => reset()}
            >
              Cancel
            </Button>
            <Button className="formButton" variation="primary">
              Submit
            </Button>
          </FormRow>

          {/* </div>           */}
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
        </Form>
      </Row>
      <div style={{ marginTop: '100px' }} />
      <Highlight
        highlightString="dee"
        style={{
          backgroundColor: 'var(--color-brand-300)',
          color: 'black',
        }}
      >
        Raindeer
      </Highlight>
    </StyledContainer>
  );
}

export default TestingPage;
