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

const Box = styled.div`
  position: relative;
`;

SearchData.propTypes = {
  data: PropTypes.array.isRequired,
  searchField: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  // RenderDataItem: PropTypes.func,
  maxResults: PropTypes.number,
  listWidth: PropTypes.string,
  columns: PropTypes.array,
  autoComplete: PropTypes.bool,
  styles: PropTypes.object,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
};

export const SearchDataContext = createContext();
export const useSearchData = () => useContext(SearchDataContext);

function SearchData({
  data,
  searchField,
  // RenderDataItem,
  placeholder,
  maxResults = 7,
  listWidth,
  columns: columnsProp = [],
  autoComplete = false,
  styles: stylesProp = [],

  /// Events
  onSelect,
  onDeselect,
}) {
  const { state, dispatch } = useSearchDataReducer(data);

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

    const dataIdx = data.findIndex((obj) =>
      typeof obj === 'string'
        ? obj === list[itemIdx]
        : searchField !== undefined && obj[searchField]
        ? obj[searchField] === list[itemIdx][searchField]
        : false
    );

    // console.log('selectedIdx', selectedIdx);

    const selectedText =
      typeof data[dataIdx] === 'string'
        ? data[dataIdx]
        : searchField !== undefined
        ? data[dataIdx][searchField]
        : '';
    const selectedObj = data[dataIdx];

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
        data,
        stylesProp,
        onDeselect,

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
