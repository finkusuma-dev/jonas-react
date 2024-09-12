import { createContext } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import useSearchDataReducer, { ActionType } from './hooks/useSearchDataReducer';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from './components/List';
import { usePositionListWindow } from './hooks/usePositionListWindow';
import SearchInput from './components/SearchInput';
import useSearchDataClickOutside from './hooks/useSearchDataClickOutside';
import useScrollItemIntoView from './hooks/useScrollItemIntoView';
import useCompare from './hooks/useCompare';
import useAutocomplete from './hooks/useAutocomplete';
// import { useMemo } from 'react';

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
  name,
  data: dataProp = [],
  dataSearch,
  searchField,
  // RenderDataItem,
  placeholder,
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
  const { state, dispatch } = useSearchDataReducer();

  /// NOTE: using useEffect to save data results in infinite loop

  // const currentData = useMemo(() => dataProp, [dataProp]);

  /// Save data to reducer whenever it changes.
  useCompare({
    newValue: dataProp,
    prevValue: state.data,
    callbackFn: (dataProp) => {
      if (dataProp.length > 0) {
        if (dataSearch) {
          // console.log('createNewList');
          createNewListNAutocomplete({
            newSearchString: dataSearch,
            newData: dataProp,
          });
        } else {
          console.log('>> Save dataProp', dataProp);
          dispatch({
            type: ActionType.saveData,
            payload: dataProp,
          });
        }
      }
    },    
    extraCondition:
      dataSearch && /// if dataSearch is not set (undefined) then extra condition is true
      dataSearch === state.dataSearch &&
      state.inputText.length >= MIN_CHARACTER_SEARCH,
  });

  const refInput = useRef();
  const refListBox = useRef();
  const refListItemsContainer = useRef();

  //console.log('autoComplete', typeof autoComplete, autoComplete);
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

  const {
    //  searchText, inputText,
    list,
    isShowList,
    activeIdx,
  } = state;

  const { listWindow, calculateListWindow } = usePositionListWindow({
    refInput,
    refListBox,
    refListItemsContainer,
  });

  useSearchDataClickOutside({ refInput, refListBox, isShowList, dispatch });

  /// refInput scroll event listener
  // useEffect(() => {
  //   function onScroll() {
  //     console.log(
  //       'refListItemsContainer.scrollTop',
  //       refListItemsContainer.current.scrollTop
  //     );
  //   }
  //   // console.log('isShowList', isShowList, refListBox.current);
  //   if (isShowList && refListItemsContainer.current) {
  //     console.log('inside');
  //     const ref = refListItemsContainer.current;
  //     const res = ref.addEventListener('scroll', onScroll);
  //     console.log('addevent result', res);

  //     return () => ref.removeEventListener('scroll', onScroll);
  //   }
  // }, [isShowList]);
  /** */

  /// Scroll item into view
  useScrollItemIntoView({
    isShowList,
    activeIdx,
    refListItemsContainer,
  });

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

    /// [x]: currently there are two conditions, using state.data or dataProp
    // const data = state.data.length > 0 ? state.data : dataProp;
    const curentData = state.data;

    const dataIdx = curentData.findIndex((obj) =>
      typeof obj === 'string'
        ? obj === list[itemIdx]
        : searchField !== undefined && obj[searchField]
        ? obj[searchField] === list[itemIdx][searchField]
        : false
    );

    // console.log('selectedIdx', selectedIdx);

    const selectedText =
      typeof curentData[dataIdx] === 'string'
        ? curentData[dataIdx]
        : searchField !== undefined
        ? curentData[dataIdx][searchField]
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
        type: ActionType.saveData,
        payload: newData,
      });

      console.log('> Use new data', currentData);
    } else if (oldData) {
      /// If not, using previous data
      ///
      console.log('> Use saved data');
    }

    if (newSearchString.length < MIN_CHARACTER_SEARCH) {
      //
    } else {
      const newList = currentData
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
      showList();
    }
  }

  function getSearchedTextFromItem(item) {
    /// Searched text is item itself if it's a string,
    /// Otherwise it's defined by searchField, searched text = item[searchField]
    return (
      item &&
      (typeof item === 'string'
        ? item
        : searchField !== undefined && item[searchField])
    );
  }

  return (
    <SearchDataContext.Provider
      value={{
        // props
        name,
        listWidth,
        placeholder,
        searchField,
        maxResults,
        // RenderDataItem,/
        columnsProp,
        autoComplete,
        isClearable,
        dataProp,
        dataSearch,
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
        {isShowList && list.length > 0 && <List />}
      </Box>
    </SearchDataContext.Provider>
  );
}

export default SearchData;
