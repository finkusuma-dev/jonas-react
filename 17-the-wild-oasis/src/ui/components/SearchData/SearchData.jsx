import { createContext } from 'react';
import { useContext } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import List from './List';
import { useListPosition } from './useListPosition';
import SearchInput from './SearchInput';
import { useReducer } from 'react';

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
  searchText: '',
  inputText: '',
  list: [],
  isShowList: false,
  activeIdx: null,
};

export const actionType = Object.freeze({
  searchChange: 'searchChange',
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    //  searchText, inputText,
    list,
    isShowList,
  } = state;

  const refInput = useRef();
  const refListBox = useRef();

  const { listPosition, calculateListPosition } = useListPosition({
    refAnchorElement: refInput,
  });

  /// Ref to use with Custom click outside

  useEffect(
    /// Custom click outside, used to close the list
    /// Not using useClickOutside because needs to trigger it outside of 2 components
    function () {
      function handleClick(e) {
        // e.stopPropagation();
        // console.log('clickOutside', ref.current, e.target);
        if (
          isShowList &&
          refInput.current &&
          refListBox.current &&
          !refInput.current.contains(e.target) &&
          !refListBox.current.contains(e.target)
        ) {
          // console.log('Click outside');
          dispatch({
            type: actionType.hideList,
          });
        }
      }

      document.addEventListener('click', handleClick, false);

      return () => document.removeEventListener('click', handleClick);
    },
    [isShowList]
  );

  function reducer(state, action) {
    // console.log('reducer action', action);
    switch (action.type) {
      case actionType.searchChange:
        // console.log('action.searchChange');
        return {
          ...state,
          searchText: action.payload,
          inputText: action.payload,
        };
      case actionType.setSearchText:
        return {
          ...state,
          searchText: action.payload,
        };
      case actionType.setInputText:
        return {
          ...state,
          inputText: action.payload,
        };
      case actionType.setList:
        return {
          ...state,
          list: action.payload,
        };

      case actionType.emptyList:
        return {
          ...state,
          list: [],
        };

      case actionType.showList:
        return {
          ...state,
          isShowList: true,
        };
      case actionType.hideList:
        return {
          ...state,
          isShowList: false,
        };
      case actionType.inputKeyDown: {
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
      case actionType.inputKeyUp: {
        return {
          ...state,
          activeIdx:
            state.activeIdx - 1 > -1 ? state.activeIdx - 1 : state.activeIdx,
        };
      }
      case actionType.setActiveIdx:
        return {
          ...state,
          activeIdx: action.payload,
        };
      case actionType.clearActiveIdx:
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
      type: actionType.showList,
    });

    calculateListPosition();
  }

  function selectItem(itemIdx) {
    dispatch({
      type: actionType.hideList,
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
      type: actionType.setInputText,
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

        listPosition,
        showList,
        selectItem,

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
