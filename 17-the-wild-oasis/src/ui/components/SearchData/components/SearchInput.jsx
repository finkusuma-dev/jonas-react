import styled from 'styled-components';
import { useSearchData } from '../SearchData';
import useAutocomplete from '../hooks/useAutocomplete';
import { ActionType } from '../hooks/useSearchDataReducer';
import { getCustomStyle, StyleType } from '../helpers/styles';

const Input = styled.input`
  /* border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm); */
  position: relative;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 0.6rem 1.1rem;
  background-color: white;

  &:focus {
    outline: 2px solid #4f46e5; //var(--color-brand-600);
    outline-offset: -1px;
  }
`;

const ClearButton = styled.button`
  border: none;
  padding: 10px;
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  background-color: transparent;
  color: #4b5563;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

function SearchInput() {
  const {
    // props
    autoComplete,
    placeholder,
    searchField,
    maxResults,
    data,
    stylesProp,

    state,
    dispatch,

    //ref
    refInput,

    showList,
    selectItem,
    getSearchedTextFromItem,
  } = useSearchData();

  const firstItemStr =
    state.list.length > 0 && getSearchedTextFromItem(state.list[0]);
  // console.log(
  //   'init firstItemStr',
  //   firstItemStr,
  //   'state.list.length',
  //   state.list.length
  // );

  // const { list, activeIdx, inputText, searchText, isShowList } = state;
  const setInputText = (input) => {
    dispatch({ type: ActionType.setInputText, payload: input });
  };

  const {
    searchChange: autoCompleteSearchChange,
    keyDown: autoCompleteKeyDown,
  } = useAutocomplete({
    enabled: autoComplete,
    inputText: state.inputText,
    setInputText,
    searchText: state.searchText,
    refInput,
  });

  function handleChange(e) {
    const newSearchString = e.target.value;

    dispatch({
      type: ActionType.searchChange,
      payload: newSearchString,
    });

    if (newSearchString.length < 2) dispatch({ type: ActionType.clearList });
    else {
      const newList = data
        /// Filter items based on the search string
        .filter((item) =>
          typeof item === 'string'
            ? String(item).includes(newSearchString)
            : searchField !== undefined && item[searchField]
            ? String(item[searchField]).includes(newSearchString)
            : false
        )
        /// Sort items based on the index where the search string is found
        .sort((a, b) => {
          const aString = getSearchedTextFromItem(a);
          const bString = getSearchedTextFromItem(b);
          const aIdx = aString.indexOf(newSearchString);
          const bIdx = bString.indexOf(newSearchString);

          if (aIdx !== bIdx) {
            /// If idx are not the same, simply substract the idx.
            /// Ex: [li]ght !== f[li]ght.
            /// 'light' should appear before 'flight'.
            return aIdx - bIdx;
          } else {
            /// If idx are the same, compare the remaining word
            /// Ex: [li]ght === [li]brary. Compare 'ght' with 'brary'
            /// In this case 'library' should appear before 'light'
            ///
            const restAString = String(aString).substring(
              aString.indexOf(newSearchString) + newSearchString.length
            );
            const restbString = String(bString).substring(
              bString.indexOf(newSearchString) + newSearchString.length
            );
            const res =
              restAString < restbString
                ? -1
                : restAString > restbString
                ? 1
                : 0;
            return res;
          }
        })
        /// Limit the number of items to only less or equal than maxResult
        .filter((el, i) => i < maxResults);

      // console.log('newList', newList);

      const newFirstItemStr = getSearchedTextFromItem(newList[0]);
      /// AUTO COMPLETE part, step 2:
      /// Set input text for autocomplete
      autoCompleteSearchChange(newSearchString, newFirstItemStr);

      dispatch({
        type: ActionType.setList,
        payload: newList,
      });
    }

    showList();
    dispatch({
      type: ActionType.clearActiveIdx,
    });
  }

  function handleKeyDown(e) {
    // console.log('handleKeyDown', e.key, e.keyCode);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!state.isShowList) return showList();
      dispatch({
        type: ActionType.inputKeyDown,
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!state.isShowList) return showList();

      dispatch({
        type: ActionType.inputKeyUp,
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dispatch({
        type: ActionType.hideList,
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.activeIdx) {
        selectItem(state.activeIdx);
      } else if (firstItemStr?.indexOf(state.searchText) === 0) {
        selectItem(0);
        dispatch({
          type: ActionType.setActiveIdx,
          payload: 0,
        });
      }
    } else if (e.key === 'Tab') {
      dispatch({
        type: ActionType.hideList,
      });
    }

    /// AUTO COMPLETE part, step 1: determine isAutoComplete on keyDown event
    autoCompleteKeyDown(e, firstItemStr);

    // console.log(
    //   'get selection range',
    //   e.target.value.substring(e.target.selectionStart, e.target.selectionEnd),
    //   'searchText',
    //   searchText
    // );
  }

  function handleClearInput() {
    dispatch({ type: ActionType.clearSearch });
    refInput.current.focus();
  }

  const customStyle = getCustomStyle(StyleType.inputText, stylesProp);

  const clearButtonCustomStyle = getCustomStyle(
    StyleType.inputTextClearButton,
    stylesProp
  );

  return (
    <>
      <Input
        type="text"
        value={state.inputText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        // onBlur={handleBlur}
        placeholder={placeholder || 'Search for data'}
        ref={refInput}
        style={customStyle}
      />
      {state.inputText.length > 0 && (
        /// Clear Button
        <ClearButton onClick={handleClearInput} style={clearButtonCustomStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
          </svg>
        </ClearButton>
      )}
    </>
  );
}

export default SearchInput;
