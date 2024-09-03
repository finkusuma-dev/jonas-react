import { createContext } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from './List';
import { useListPosition } from './useListPosition';
import SearchInput from './SearchInput';
import useSearchDataClickOutside from './useSearchDataClickOutside';

const Box = styled.div`
  position: relative;
`;

// const fakeData = ['dog', 'cat', 'horse', 'giraffe'];

SearchData.propTypes = {
  data: PropTypes.array.isRequired,
  searchProp: PropTypes.string, // prop to search if data.element is an object
  placeholder: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  renderItem: PropTypes.func,
  maxResults: PropTypes.number,
  listWidth: PropTypes.string,
  asTable: PropTypes.bool,
  tableColumns: PropTypes.array,
  autoComplete: PropTypes.bool,
};

const initialState = {
  inputText: '', /// Input Text component's value
  searchText: '', /// The actual keyboard keys pressed/search by the user
  data: [],
  list: [], /// The results of searching the searchText
  isShowList: false, /// The state of showing the list
  activeIdx: null, /// The active index of item in the list. Set when user presses keydown/keyup/click with mouse.
};

export const ActionType = Object.freeze({
  searchChange: 'searchChange',
  clearSearch: 'clearSearch',
  setSearchText: 'setSearchText',
  setInputText: 'setInputText',
  setList: 'setList',
  emptyList: 'emptyList',
  showList: 'IsShowList/true',
  hideList: 'IsShowList/false',
  setActiveIdx: 'setActiveIdx',
  inputKeyDown: 'input/keyDown',
  inputKeyUp: 'input/keyUp',
  clearActiveIdx: 'clearActiveIdx',
});

export const SearchDataContext = createContext();
export const useSearchData = () => useContext(SearchDataContext);

function SearchData({
  data,
  searchProp,
  onSelect,
  renderItem,
  placeholder,
  maxResults = 7,
  listWidth,
  asTable = false,
  tableColumns = [],
  autoComplete = false,
}) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, data });
  const {
    //  searchText, inputText,
    list,
    isShowList,
    activeIdx,
  } = state;

  const refInput = useRef();
  const refListBox = useRef();
  const refListItemsContainer = useRef();

  const { listPosition, calculateListPosition } = useListPosition({
    refAnchorElement: refInput,
  });

  useSearchDataClickOutside({ refInput, refListBox, isShowList, dispatch });

  /// refInput scroll event listener
  // useEffect(() => {
  //   function onScroll() {
  //     console.log('refListBox.current.scrollTop', refListBox.current.scrollTop);
  //   }
  //   console.log('isShowList', isShowList, refListBox.current);
  //   if (isShowList && refListBox.current) {
  //     console.log('inside');
  //     const ref = refListBox.current;
  //     const res = ref.addEventListener('scroll', onScroll);
  //     console.log('addevent result', res);

  //     return () => ref.removeEventListener('scroll', onScroll);
  //   }
  // }, [isShowList]);
  /** */

  /// Scroll item into view
  useEffect(() => {
    if (isShowList && refListBox.current && refListItemsContainer.current) {
      if (activeIdx === null) {
        refListBox.current.scrollTop = 0;
      } else {
        const firstItemTop =
          refListItemsContainer.current.children[0]?.offsetTop;
        const listHeight = refListBox.current.clientHeight;
        const itemTop =
          refListItemsContainer.current.children[activeIdx]?.offsetTop;
        const itemBottom =
          itemTop +
          refListItemsContainer.current.children[activeIdx]?.clientHeight;

        /// Scroll to bottom
        if (itemBottom > listHeight + refListBox.current.scrollTop) {
          console.log('scrollTop', itemBottom - listHeight + 8);
          refListBox.current.scrollTop = itemBottom - listHeight + 8;
        }
        /// Scroll to top
        else if (itemTop - firstItemTop < refListBox.current.scrollTop) {
          refListBox.current.scrollTop = itemTop - firstItemTop;
        }
      }
    }
  }, [isShowList, listPosition, activeIdx]);

  function reducer(state, action) {
    // console.log('reducer action', action);
    switch (action.type) {
      case ActionType.searchChange:
        // console.log('action.searchChange');
        return {
          ...state,
          searchText: action.payload,
          inputText: action.payload,
        };
      case ActionType.clearSearch:
        // console.log('action.searchChange');
        return {
          ...state,
          searchText: '',
          inputText: '',
          list: [],
          activeIdx: null,
          isShowList: false,
        };
      case ActionType.setSearchText:
        return {
          ...state,
          searchText: action.payload,
        };
      case ActionType.setInputText:
        return {
          ...state,
          inputText: action.payload,
        };
      case ActionType.setList:
        return {
          ...state,
          list: action.payload,
        };

      case ActionType.emptyList:
        return {
          ...state,
          list: [],
        };

      case ActionType.showList:
        return {
          ...state,
          isShowList: true,
        };
      case ActionType.hideList:
        return {
          ...state,
          isShowList: false,
        };
      case ActionType.inputKeyDown: {
        return {
          ...state,
          activeIdx:
            state.activeIdx === null
              ? 0
              : state.activeIdx + 1 < state.list.length
              ? state.activeIdx + 1
              : state.activeIdx,
        };
      }
      case ActionType.inputKeyUp: {
        return {
          ...state,
          activeIdx:
            state.activeIdx === null
              ? 0
              : state.activeIdx - 1 > -1
              ? state.activeIdx - 1
              : state.activeIdx,
        };
      }
      case ActionType.setActiveIdx:
        return {
          ...state,
          activeIdx: action.payload,
        };
      case ActionType.clearActiveIdx:
        return {
          ...state,
          activeIdx: null,
        };
      default:
        throw new Error('SearchDataReducer action is unknown');
    }
  }

  function showList() {
    dispatch({
      type: ActionType.showList,
    });

    calculateListPosition();
  }

  function selectItem(itemIdx) {
    dispatch({
      type: ActionType.hideList,
    });

    const dataIdx = data.findIndex((obj) =>
      typeof obj === 'string'
        ? obj === list[itemIdx]
        : searchProp !== undefined && obj[searchProp]
        ? obj[searchProp] === list[itemIdx][searchProp]
        : false
    );

    // console.log('selectedIdx', selectedIdx);

    const selectedText =
      typeof data[dataIdx] === 'string'
        ? data[dataIdx]
        : searchProp !== undefined
        ? data[dataIdx][searchProp]
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
    /// Otherwise it's defined by searchProp, searched text = item[searchProp]
    return (
      item &&
      (typeof item === 'string'
        ? item
        : searchProp !== undefined && item[searchProp])
    );
  }

  return (
    <SearchDataContext.Provider
      value={{
        // props
        listWidth,
        asTable,
        placeholder,
        searchProp,
        maxResults,
        renderItem,
        tableColumns,
        autoComplete,
        data,

        //state
        // list,
        // activeIdx,
        // inputText,
        // searchText,
        // isShowList,

        //ref
        refInput,
        refListBox,
        refListItemsContainer,

        listPosition,
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
