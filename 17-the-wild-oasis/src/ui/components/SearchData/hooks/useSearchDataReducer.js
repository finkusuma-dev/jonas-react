import { useReducer } from 'react';

export const ActionType = Object.freeze({
  searchChange: 'search/change',
  clearSearch: 'search/clear',

  updateData: 'data/update',
  clearData: 'data/clear',
  updateDataSearchResults: 'dataSearchResults/update',
  clearDataSearchResults: 'dataSearchResults/clear',
  setDataSearch: 'dataSearch/set',

  setSearchText: 'searchText/set',
  setInputText: 'inputText/set',
  updateList: 'list/update',
  clearList: 'list/clear',

  setSelectedItemIdx: 'selectedItemIdx/set',
  clearSelectedItemIdx: 'selectedItemIdx/clear',

  inputKeyDown: 'input/keyDown',
  inputKeyUp: 'input/keyUp',
  showList: 'list/show',
  hideList: 'list/hide',
});

const initialState = {
  inputText: '', /// Input Text component's value
  searchText: '', /// The actual keyboard keys pressed/search by the user
  data: [],
  dataSearch: '',
  dataSearchResults: [],
  list: [], /// The results of searching the searchText
  isShowList: false, /// The state of showing the list
  selectedItemIdx: null, /// The active index of item in the list. Set when user presses keydown/keyup/click with mouse.
};

function useSearchDataReducer() {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  });

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
          selectedItemIdx: null,
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
      case ActionType.updateData:
        return {
          ...state,
          data: action.payload,
        };
      case ActionType.clearData:
        // console.log('clear data');
        return {
          ...state,
          data: [],
        };
      case ActionType.updateDataSearchResults:
        return {
          ...state,
          dataSearchResults: action.payload,
        };
      case ActionType.clearDataSearchResults:
        // console.log('clear data');
        return {
          ...state,
          dataSearchResults: [],
          dataSearch: '',
        };
      case ActionType.setDataSearch:
        return {
          ...state,
          dataSearch: action.payload,
        };
      case ActionType.updateList:
        return {
          ...state,
          list: action.payload,
        };

      case ActionType.clearList:
        return {
          ...state,
          list: [],
          isShowList: false,
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
          selectedItemIdx:
            state.selectedItemIdx === null
              ? 0
              : state.selectedItemIdx + 1 < state.list.length
              ? state.selectedItemIdx + 1
              : state.selectedItemIdx,
        };
      }
      case ActionType.inputKeyUp: {
        return {
          ...state,
          selectedItemIdx:
            state.selectedItemIdx === null
              ? 0
              : state.selectedItemIdx - 1 > -1
              ? state.selectedItemIdx - 1
              : state.selectedItemIdx,
        };
      }
      case ActionType.setSelectedItemIdx:
        return {
          ...state,
          selectedItemIdx: action.payload,
        };
      case ActionType.clearSelectedItemIdx:
        return {
          ...state,
          selectedItemIdx: null,
        };
      default:
        throw new Error('SearchDataReducer action is unknown');
    }
  }

  return { state, dispatch };
}

export default useSearchDataReducer;
