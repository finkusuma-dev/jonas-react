import { forwardRef } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';

import { ActionType } from '../hooks/useSearchDataReducer';
import { useSearchData } from '../SearchData';
import { getCustomStyle, StyleName } from '../helpers/styles';
import { cancelTimeout, processTimeout } from '../helpers/func';
import ClearButton from './ClearButton';
import SpinnerMini from './SpinnerMini';
import DropdownButton from './DropdownButton';

const MIN_CHARACTER_SEARCH = 2;

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

// const RightContainer = styled.div`
//   position: absolute;
//   right: 1px;
//   top: 1px;
//   bottom: 1px;
//   display: flex;
//   /* align-items: center; */
//   /* border: 1px solid red; */
// `;

const SearchInput = forwardRef(function SearchInput(props, ref) {
  const {
    // props
    // autoCompleteProp,
    isClearableProp,
    placeholderProp,
    // searchFieldProp,
    // maxItemsProp,
    // dataProp,
    stylesProp,
    onDeselect,
    onSearch,
    onSearchRequest,
    isLoadingProp,
    isUseDataProp,

    state,
    dispatch,

    //ref
    refInput,
    refIsUsingData,

    showList,
    hideList,
    selectItem,
    getSearchedTextFromItem,
    createNewListNAutocomplete,
    autoCompleteKeyDown,
  } = useSearchData();

  const refTimeout = useRef();

  const firstItemStr =
    state.list.length > 0 && getSearchedTextFromItem(state.list[0]);
  // console.log(
  //   'init firstItemStr',
  //   firstItemStr,
  //   'state.list.length',
  //   state.list.length
  // );

  function handleChange(e) {
    const newSearchString = e.target.value;

    dispatch({
      type: ActionType.searchChange,
      payload: newSearchString,
    });

    clearSelectedItemIdx();

    createNewListOrCallOnSearch(newSearchString);
    // console.log(
    //   'refSearchStringData.current',
    //   refSearchStringData.current,
    //   newSearchString
    // );
  }

  function createNewListOrCallOnSearch(newSearchString) {
    if ((onSearch || onSearchRequest) && !isUseDataProp) {
      cancelTimeout(refTimeout);
      if (newSearchString.length >= MIN_CHARACTER_SEARCH) {
        if (
          /// If new search string has saved search string as its substring,
          /// use previous saved data
          state.dataSearch &&
          state.dataSearch.length > 0 &&
          newSearchString.indexOf(state.dataSearch) > -1
        ) {
          return createNewListNAutocomplete({
            newSearchString,
            oldDataSearchResults: state.dataSearchResults,
          });
        }

        /// If not, request for a new data
        processTimeout(refTimeout, async () => {
          if (onSearch || onSearchRequest) {
            dispatch({
              type: ActionType.setDataSearch,
              payload: newSearchString,
            });

            if (onSearch) {
              /// Call onSearch. It's used when using dynamic data outside of the component.
              onSearch(newSearchString);
            } else if (onSearchRequest) {
              const newData = await onSearchRequest(newSearchString);

              /// Get the returned data
              if (newData) {
                createNewListNAutocomplete({ newSearchString, newData });
              }
            }
          }
        });
      } else {
        /// filling and clearing list uses useEffect
      }
    } else {
      /// If onSearch && onSearchRequest is not set
      if (newSearchString.length >= MIN_CHARACTER_SEARCH) {
        return createNewListNAutocomplete({
          newSearchString,
          oldData: state.data,
        });
      } else {
        /// filling and clearing list uses useEffect
      }
    }
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
      hideList();
      // dispatch({
      //   type: ActionType.hideList,
      // });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.selectedItemIdx) {
        selectItem(state.selectedItemIdx);
      } else if (firstItemStr?.indexOf(state.searchText) === 0) {
        selectItem(0);
        dispatch({
          type: ActionType.setSelectedItemIdx,
          payload: 0,
        });
      }
    } else if (e.key === 'Tab') {
      hideList();
      // dispatch({
      //   type: ActionType.hideList,
      // });
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
    clearSelectedItemIdx();
    dispatch({ type: ActionType.clearSearch });

    // if (isUseDataProp) {
    //   dispatch({ type: ActionType.updateList, payload: state.data });
    // } else {
    //   dispatch({ type: ActionType.clearList });
    // }
    refInput.current.focus();
  }

  function handleShowList() {
    if (!state.isShowList) {
      if (state.list.length) showList();
      refInput.current.focus();
    } else {
      // console.log('hideList');
      hideList();
      // dispatch({
      //   type: ActionType.hideList,
      // });
      refInput.current.focus();
    }
  }

  function clearSelectedItemIdx() {
    if (state.selectedItemIdx != null && onDeselect && onDeselect());

    dispatch({
      type: ActionType.clearSelectedItemIdx,
    });
  }

  const customStyle = getCustomStyle(StyleName.inputText, stylesProp);

  return (
    <>
      <Input
        type="text"
        value={state.inputText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        // onBlur={handleBlur}
        placeholder={placeholderProp || 'Search for data'}
        ref={(el) => {
          refInput.current = el;
          if (ref) ref.current = el;
        }}
        style={customStyle}
        {...props}
      />
      <div
        style={{
          position: 'absolute',
          right: '1px',
          top: '1px',
          bottom: '1px',
          display: 'flex',
        }}
      >
        {!isLoadingProp && isClearableProp && state.inputText.length > 0 && (
          <ClearButton onClick={handleClearInput} />
        )}
        {!!isLoadingProp && <SpinnerMini />}
        {refIsUsingData.current && state.list.length > 0 && (
          <DropdownButton
            onClick={handleShowList}
            isActive={state.isShowList}
          />
        )}
      </div>
    </>
  );
});

export default SearchInput;
