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
  data: PropTypes.array,
  dataSearch: PropTypes.string, // prop to search if data.element is an object
  searchField: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  // RenderDataItem: PropTypes.func,
  maxResults: PropTypes.number,
  listWidth: PropTypes.string,
  columns: PropTypes.array,
  autoComplete: PropTypes.bool,
  isClearable: PropTypes.bool,
  styles: PropTypes.object,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onSearch: PropTypes.func,
};

export const SearchDataContext = createContext();
export const useSearchData = () => useContext(SearchDataContext);

function SearchData({
  name: nameProp,
  data: dataProp = [],
  dataSearch: dataSearchProp,
  searchField: searchFieldProp,
  // RenderDataItem,
  placeholder: placeholderProp,
  maxResults = 7,
  listWidth,
  columns: columnsProp = [],
  autoComplete = false,
  isClearable = false,
  styles: stylesProp = [],

  /// Events
  onSelect,
  onDeselect,
  onSearch,
}) {
  const refInput = useRef();
  const refListBox = useRef();
  const refListItemsContainer = useRef();

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
      }
    },
    additionalCondition: !dataSearchProp,
  });

  // === useCompare ===
  /// For dynamic data passed to the dataProp as a result of
  /// a search api request.
  useCompare({
    newValue: dataProp,
    oldValue: state.data,
    callbackFn: (dataProp) => {
      if (dataProp.length > 0) {
        if (dataSearchProp) {
          // console.log('createNewList');
          createNewListNAutocomplete({
            newSearchString: dataSearchProp,
            newData: dataProp,
          });
        }
      }
    },
    additionalCondition:
      !!dataSearchProp && /// if dataSearchProp is not set (undefined) then additional condition is true
      dataSearchProp === state.dataSearchProp &&
      state.inputText.length >= MIN_CHARACTER_SEARCH,
  });

  // === useAutocomplete ===
  const {
    searchChange: autoCompleteSearchChange,
    keyDown: autoCompleteKeyDown,
  } = useAutocomplete({
    enabled: autoComplete,
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
    refInput,
    refListBox,
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

    const curentData = state.data;

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

  function createNewListNAutocomplete({ newSearchString, newData, oldData }) {
    let currentData = newData || oldData;
    if (newData) {
      /// If new data arrived, the search string & the data is saved
      ///
      dispatch({
        type: ActionType.updateData,
        payload: newData,
      });

      // console.log('> Use new data', currentData);
    } else if (oldData) {
      /// If not, using previous data
      ///
      // console.log('> Use saved data');
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
        /// Limit the number of items to only less or equal than maxResult
        .filter((el, i) => i < maxResults);

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
        listWidth,
        placeholderProp,
        searchFieldProp,
        maxResults,
        // RenderDataItem,/
        columnsProp,
        autoComplete,
        isClearable,
        dataProp,
        dataSearchProp,
        stylesProp,
        onDeselect,
        onSearch,

        //ref
        refInput,
        refListBox,
        refListItemsContainer,

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
      <Box>
        <SearchInput />
        {state.isShowList && state.list.length > 0 && <List />}
      </Box>
    </SearchDataContext.Provider>
  );
}

export default SearchData;
