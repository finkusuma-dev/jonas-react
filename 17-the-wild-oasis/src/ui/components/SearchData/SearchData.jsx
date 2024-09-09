import { createContext } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import useSearchDataReducer, { ActionType } from './hooks/useSearchDataReducer';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from './components/List';
import { usePositionListWindow } from './hooks/usePositionListWindow';
import SearchInput from './components/SearchInput';
import useSearchDataClickOutside from './hooks/useSearchDataClickOutside';
import useScrollItemIntoView from './hooks/useScrollItemIntoView';
// import { useMemo } from 'react';

const Box = styled.div`
  position: relative;
`;

SearchData.propTypes = {
  data: PropTypes.array,
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
  data: dataProp = [],
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
  const isSameData =
    JSON.stringify(state.savedData) === JSON.stringify(dataProp);

  useEffect(() => {
    if (dataProp.length > 0 && !isSameData) {
      console.log('>> Save dataProp, data the same', isSameData, dataProp);
      dispatch({
        type: ActionType.saveData,
        payload: dataProp,
      });
    }
  }, [isSameData, dataProp]);
  // console.log('data', data);

  //console.log('autoComplete', typeof autoComplete, autoComplete);

  const {
    //  searchText, inputText,
    list,
    isShowList,
    activeIdx,
  } = state;

  const refInput = useRef();
  const refListBox = useRef();
  const refListItemsContainer = useRef();

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

    /// [x]: currently there are two conditions, using state.savedData or dataProp
    // const data = state.savedData.length > 0 ? state.savedData : dataProp;
    const curentData = state.savedData;

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
        listWidth,
        placeholder,
        searchField,
        maxResults,
        // RenderDataItem,/
        columnsProp,
        autoComplete,
        isClearable,
        dataProp,
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
