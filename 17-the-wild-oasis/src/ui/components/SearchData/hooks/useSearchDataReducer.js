import { useReducer } from 'react';

export const ActionType = Object.freeze({
  searchChange: 'searchChange',
  clearSearch: 'clearSearch',
  setSearchText: 'searchText/set',
  setInputText: 'inputText/set',
  setList: 'list/set',
  clearList: 'list/clear',
  showList: 'isShowList/true',
  hideList: 'isShowList/false',
  setActiveIdx: 'activeIdx/set',
  clearActiveIdx: 'activeIdx/clear',
  inputKeyDown: 'input/keyDown',
  inputKeyUp: 'input/keyUp',
});

const initialState = {
  inputText: '', /// Input Text component's value
  searchText: '', /// The actual keyboard keys pressed/search by the user
  data: [],
  list: [], /// The results of searching the searchText
  isShowList: false, /// The state of showing the list
  activeIdx: null, /// The active index of item in the list. Set when user presses keydown/keyup/click with mouse.
};

function useSearchDataReducer(data) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, data });

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

      case ActionType.clearList:
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

  return { state, dispatch };
}

export default useSearchDataReducer;
