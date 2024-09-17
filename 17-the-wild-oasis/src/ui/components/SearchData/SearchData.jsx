import { createContext } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import useSearchDataReducer, { ActionType } from './hooks/useSearchDataReducer';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from './components/List';
import { useCalculateListWindow } from './hooks/useCalculateListWindow';
import SearchInput from './components/SearchInput';
import useSearchDataClickOutside from './hooks/useSearchDataClickOutside';
import useScrollItemIntoView from './hooks/useScrollItemIntoView';
import useCompare from './hooks/useCompare';
import useAutocomplete from './hooks/useAutocomplete';

const MIN_CHARACTER_SEARCH = 2;

const Box = styled.div`
  position: relative;
`;

SearchData.propTypes = {
  name: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  data: PropTypes.array,
  searchResults: PropTypes.array,
  search: PropTypes.string, // prop to search if data.element is an object
  searchField: PropTypes.string, // prop to search if data.element is an object
  isLoading: PropTypes.bool,
  // RenderDataItem: PropTypes.func,
  maxItems: PropTypes.number,
  listWidth: PropTypes.string,
  columns: PropTypes.array,
  defaultFilled: PropTypes.bool,
  dropDownButton: PropTypes.bool,
  autoComplete: PropTypes.bool,
  isClearable: PropTypes.bool,
  styles: PropTypes.object,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onSearch: PropTypes.func,
  onSearchRequest: PropTypes.func,
};

export const SearchDataContext = createContext();
export const useSearchData = () => useContext(SearchDataContext);

function SearchData({
  name: nameProp,
  data: dataProp = [],
  searchResults: dataSearchResultsProp = [],
  search: dataSearchProp,
  searchField: searchFieldProp,
  isLoading: isLoadingProp,
  // RenderDataItem,
  placeholder: placeholderProp,
  maxItems: maxItemsProp = 7,
  listWidth: listWidthProp,
  columns: columnsProp = [],
  defaultFilled: defaultFilledProp = false,
  dropDownButton: dropDownButtonProp = false,
  autoComplete: autoCompleteProp = false,
  isClearable: isClearableProp = false,
  styles: stylesProp = [],

  /// Events
  onSelect,
  onDeselect,
  onSearch,
  onSearchRequest,
}) {
  const refInput = useRef();
  const refListBox = useRef();
  const refListItemsContainer = useRef();
  const refThisComponent = useRef();

  const { state, dispatch } = useSearchDataReducer();

  // === useCompare ===
  // For static data passed to the dataProp.
  useCompare({
    newValue: dataProp,
    oldValue: state.data,
    callbackFn: (dataProp) => {
      if (dataProp.length > 0) {
        /// When using static data passed into dataProp.
        console.log('>> Save dataProp', dataProp);
        dispatch({
          type: ActionType.updateData,
          payload: dataProp,
        });
        if (defaultFilledProp) {
          dispatch({
            type: ActionType.updateList,
            payload: dataProp,
          });
        }
      }
    },
    additionalCondition: !dataSearchProp,
  });

  // === useCompare ===
  /// For dynamic data passed to the dataSearchResultsProp as a result of
  /// an api request.
  useCompare({
    newValue: dataSearchResultsProp,
    oldValue: state.dataSearchResults,
    callbackFn: (dataSearchResultsProp) => {
      // console.log('createNewList');
      createNewListNAutocomplete({
        newSearchString: dataSearchProp,
        newDataSearchResults: dataSearchResultsProp,
      });
    },
    additionalCondition:
      dataSearchProp && /// if dataSearchProp is not set (undefined) then additional condition is true
      dataSearchProp === state.dataSearch &&
      dataSearchResultsProp.length > 0 &&
      state.inputText.length >= MIN_CHARACTER_SEARCH,
  });

  // === useAutocomplete ===
  const {
    searchChange: autoCompleteSearchChange,
    keyDown: autoCompleteKeyDown,
  } = useAutocomplete({
    enabled: autoCompleteProp,
    inputText: state.inputText,
    setInputText: (input) => {
      dispatch({ type: ActionType.setInputText, payload: input });
    },
    searchText: state.searchText,
    refInput,
  });

  // === usePositionListWindow ===
  const { listWindow, calculateListWindow } = useCalculateListWindow({
    refInput,
    refListBox,
    refListItemsContainer,
  });

  // === useSearchDataClickOutside ===
  useSearchDataClickOutside({
    ref: refThisComponent,
    isShowList: state.isShowList,
    dispatch,
  });

  /// == useScrollItemIntoView ===
  useScrollItemIntoView({
    enabled: state.isShowList,
    itemIdx: state.selectedItemIdx,
    refListContainer: refListItemsContainer,
  });

  // ----- The end of hooks -----

  function showList() {
    dispatch({
      type: ActionType.showList,
    });

    calculateListWindow();
  }

  function selectItem(itemIdx) {
    dispatch({
      type: ActionType.hideList,
    });

    const curentData = state.dataSearchResults.length
      ? state.dataSearchResults
      : state.data;

    const dataIdx = curentData.findIndex((obj) =>
      typeof obj === 'string'
        ? obj === state.list[itemIdx]
        : searchFieldProp !== undefined && obj[searchFieldProp]
        ? obj[searchFieldProp] === state.list[itemIdx][searchFieldProp]
        : false
    );

    // console.log('selectedIdx', selectedIdx);

    const selectedText =
      typeof curentData[dataIdx] === 'string'
        ? curentData[dataIdx]
        : searchFieldProp !== undefined
        ? curentData[dataIdx][searchFieldProp]
        : '';
    const selectedObj = curentData[dataIdx];

    dispatch({
      type: ActionType.setInputText,
      payload: selectedText,
    });

    refInput.current.setSelectionRange(
      selectedText.length,
      selectedText.length
    );

    if (onSelect) {
      onSelect(dataIdx, selectedObj);
    }
  }

  function createNewListNAutocomplete({
    newSearchString,
    newDataSearchResults,
    oldDataSearchResults,
    newData,
    oldData,
  }) {
    const currentData =
      newDataSearchResults || oldDataSearchResults || newData || oldData;
    if (newDataSearchResults) {
      // console.log('newDataSearchResults', newDataSearchResults);
      /// If new data arrived, the search string & the data is saved
      ///
      dispatch({
        type: ActionType.updateDataSearchResults,
        payload: newDataSearchResults,
      });
    } else if (newData) {
      /// If new data arrived, the search string & the data is saved
      ///
      dispatch({
        type: ActionType.updateData,
        payload: newData,
      });

      console.log('> Use new data searchResult');
    }

    if (newSearchString.length < MIN_CHARACTER_SEARCH) {
      //
    } else {
      const newList = currentData
        /// Filter items based on the search string
        .filter((item) =>
          typeof item === 'string'
            ? String(item).includes(newSearchString)
            : searchFieldProp !== undefined && item[searchFieldProp]
            ? String(item[searchFieldProp]).includes(newSearchString)
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
        /// Limit the number of items to less or equal than maxItemsProp
        .filter((el, i) => i < maxItemsProp);

      // console.log('newList', newList);

      const firstItemInList = getSearchedTextFromItem(newList[0]);
      /// AUTO COMPLETE part, step 2:
      /// Set input text for autocomplete
      autoCompleteSearchChange(newSearchString, firstItemInList);

      dispatch({
        type: ActionType.updateList,
        payload: newList,
      });
      showList();
    }
  }

  function getSearchedTextFromItem(item) {
    /// Searched text is item itself if it's a string,
    /// Otherwise it's defined by searchFieldProp, searched text = item[searchFieldProp]
    return (
      item &&
      (typeof item === 'string'
        ? item
        : searchFieldProp !== undefined && item[searchFieldProp])
    );
  }

  return (
    <SearchDataContext.Provider
      value={{
        // props
        nameProp,
        listWidthProp,
        placeholderProp,
        searchFieldProp,
        isLoadingProp,

        maxItemsProp,
        // RenderDataItem,/
        columnsProp,
        defaultFilledProp,
        dropDownButtonProp,
        autoCompleteProp,
        isClearableProp,
        dataProp,
        dataSearchProp,
        stylesProp,
        onDeselect,
        onSearch,
        onSearchRequest,

        //ref
        refInput,
        refListBox,
        refListItemsContainer,
        refThisComponent,

        listWindow,
        showList,
        selectItem,
        getSearchedTextFromItem,
        createNewListNAutocomplete,
        autoCompleteSearchChange,
        autoCompleteKeyDown,

        state,
        dispatch,
      }}
    >
      <Box ref={refThisComponent}>
        <SearchInput />
        {state.isShowList && state.list.length > 0 && <List />}
      </Box>
    </SearchDataContext.Provider>
  );
}

export default SearchData;
