import { createContext, useEffect } from 'react';
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
import { forwardRef } from 'react';
import { useCallback } from 'react';

const MIN_CHARACTER_SEARCH = 2;

const Box = styled.div`
  position: relative;
`;

export const SearchDataContext = createContext();
export const useSearchData = () => useContext(SearchDataContext);

// const testComp = forwardRef((props, ref) => <div>test</div>);

const SearchData = forwardRef(function SearchData(
  {
    name: nameProp,
    isUseData: isUseDataProp,
    data: dataProp = [],
    searchData: dataSearchResultsProp = [],
    search: dataSearchProp,
    searchField: searchFieldProp,
    isLoading: isLoadingProp,

    isShowList: isShowListProp,
    onShowList,
    // RenderDataItem,
    placeholder: placeholderProp,
    maxItems: maxItemsProp = 7,
    listWidth: listWidthProp,

    columns: columnsProp = [],
    styles: stylesProp = [],

    autoComplete: autoCompleteProp = false,
    isClearable: isClearableProp = false,
    /// Events
    onSelect,
    onDeselect,
    onSearch,
    onSearchRequest,
  },
  ref
) {
  const refInput = useRef();
  const refListBox = useRef();
  const refListItemsContainer = useRef();
  const refThisComponent = useRef(null);
  const refIsUsingData = useRef();

  // TODO: add ref to this component input box

  const { state, dispatch } = useSearchDataReducer();

  // === useCompare ===
  // For static data passed to the dataProp.
  // console.log('isUseDataProp', isUseDataProp);
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
    // additionalCondition: !dataSearchProp,
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

  // console.log('isUseDataProp', nameProp, isUseDataProp);
  // console.log('SearchData.length', nameProp, !state.dataSearchResults.lengths);

  /// isUsingdata :
  /// - dataProp is filled & isUseDataProp is undefined.
  /// - dataProp is filled & onSearch is set and isUseDataProp: true.
  ///   Not using dataSearchResultsProp.length because at start it's empty.
  refIsUsingData.current = isUseDataProp || !onSearch;
  // console.log('refIsUsingData', nameProp, refIsUsingData.current);

  /// If isUsingData fill list with data
  useEffect(() => {
    if (state.inputText.length < MIN_CHARACTER_SEARCH && state.data.length) {
      if (refIsUsingData.current) {
        // console.log('Fill List', nameProp);
        dispatch({ type: ActionType.updateList, payload: state.data });
      } else {
        dispatch({ type: ActionType.clearList });
      }
    }
  }, [state.inputText.length, state.data.length, isUseDataProp, state.data, onSearch, dispatch]);

  /// show & hide list from outside, based on isShowList prop value.
  useCompare({
    newValue: isShowListProp,
    oldValue: state.isShowList,
    callbackFn: () => {
      if (isShowListProp) {
        showList();
      } else {
        hideList();
      }
    },
    additionalCondition: isShowListProp != undefined,
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

  // === useCalculateListWindow ===
  useCalculateListWindow({
    refInput,
    refListBox,
    refListItemsContainer,
    state,
  });

  // === useSearchDataClickOutside ===
  useSearchDataClickOutside({
    ref: refThisComponent,
    // isShowList: state.isShowList,
    // dispatch,
    onClick: () => {
      if (state.isShowList) hideList();
    },
  });

  /// == useScrollItemIntoView ===
  useScrollItemIntoView({
    enabled: state.isShowList,
    itemIdx: state.selectedItemIdx,
    refListContainer: refListItemsContainer,
  });

  // ----- The end of hooks -----

  const showList = useCallback(
    function showList() {
      dispatch({
        type: ActionType.showList,
      });

      // calculateListWindow();
      // positionListWindow();
      if (onShowList && isShowListProp != undefined && isShowListProp !== true)
        onShowList(true);
    },
    [
      // calculateListWindow,
      // positionListWindow,
      dispatch,
      onShowList,
      isShowListProp,
    ]
  );

  const hideList = useCallback(
    function hideList() {
      dispatch({
        type: ActionType.hideList,
      });

      if (onShowList && isShowListProp != undefined && isShowListProp !== false)
        onShowList(false);
    },
    [dispatch, isShowListProp, onShowList]
  );

  function selectItem(itemIdx) {
    hideList();
    // dispatch({
    //   type: ActionType.hideList,
    // });

    const curentData = refIsUsingData.current
      ? state.data
      : state.dataSearchResults;

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
        isUseDataProp,
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
        refIsUsingData,

        // listWindow,
        showList,
        hideList,
        selectItem,
        getSearchedTextFromItem,
        createNewListNAutocomplete,
        autoCompleteSearchChange,
        autoCompleteKeyDown,

        state,
        dispatch,
      }}
    >
      <Box
        // ref={ref}
        ref={(el) => {
          refThisComponent.current = el;
          // if (refProp) refProp.current = el;
        }}
      >
        <SearchInput ref={ref} />
        {state.isShowList && state.list.length > 0 && <List />}
      </Box>
    </SearchDataContext.Provider>
  );
});

SearchData.propTypes = {
  name: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  data: PropTypes.array,
  searchData: PropTypes.array,
  search: PropTypes.string, // prop to search if data.element is an object
  searchField: PropTypes.string, // prop to search if data.element is an object
  isLoading: PropTypes.bool,
  // RenderDataItem: PropTypes.func,
  maxItems: PropTypes.number,
  listWidth: PropTypes.string,
  columns: PropTypes.array,
  isUseData: PropTypes.bool,
  autoComplete: PropTypes.bool,
  isClearable: PropTypes.bool,
  styles: PropTypes.object,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  onSearch: PropTypes.func,
  onSearchRequest: PropTypes.func,
};

export default SearchData;
