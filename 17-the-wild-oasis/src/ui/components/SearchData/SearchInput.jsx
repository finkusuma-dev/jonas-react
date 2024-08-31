import Input from '../../Input';
import { getSearchedTextFromItem } from './func';
import { useSearchData } from './SearchData';
import useAutocomplete from './useAutocomplete';

function SearchInput() {
  const {
    // props
    autoComplete,
    placeholder,
    searchProp,
    maxResults,

    //state
    data,
    list,
    setList,
    activeIdx,
    setActiveIdx,
    inputText,
    setInputText,
    searchText,
    setSearchText,

    //ref
    refInput,

    showList,
    isShowList,
    setIsShowList,
    selectItem,
  } = useSearchData();

  const {
    searchChange: autoCompleteSearchChange,
    keyDown: autoCompleteKeyDown,
  } = useAutocomplete({
    autoComplete,
    inputText,
    searchText,
    refInput,
    searchProp,
    setInputText,
    list,
  });

  function handleSearchChange(e) {
    // console.log('handleSearch', e.target.value);
    const searchString = e.target.value;
    setInputText(searchString); // inputText changes on handleSearchChange and on select result item.
    setSearchText(searchString); // searchText only changes on handleSearchChange.

    if (searchString.length < 2) setList([]);
    else {
      const aList = data
        /// Filter items based on the search string
        .filter((el) =>
          typeof el === 'string'
            ? String(el).includes(searchString)
            : searchProp !== undefined && el[searchProp]
            ? String(el[searchProp]).includes(searchString)
            : false
        )
        /// Sort items based on the index where the search string is found
        .sort((a, b) => {
          const aString = getSearchedTextFromItem(a, searchProp);
          const bString = getSearchedTextFromItem(b, searchProp);
          const aIdx = aString.indexOf(searchString);
          const bIdx = bString.indexOf(searchString);

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
              aString.indexOf(searchString) + searchString.length
            );
            const restbString = String(bString).substring(
              bString.indexOf(searchString) + searchString.length
            );
            const res =
              restAString < restbString
                ? -1
                : restAString > restbString
                ? 1
                : 0;
            // console.log('rest a:b', restAString, restbString, res);
            return res;
          }
        })
        /// Limit the number of items to only less or equal than maxResult
        .filter((el, i) => i < maxResults);

      /// AUTO COMPLETE part, step 2:
      /// Set input text for autocomplete
      autoCompleteSearchChange(aList, searchString);

      setList(aList);
    }

    showList();
    setActiveIdx(null);
  }

  function handleKeyDown(e) {
    console.log('handleKeyDown', e.key, e.keyCode);

    ///TODO: Scroll into view on pressing ArrowDown & ArrowUp
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isShowList) return showList();
      setActiveIdx((i) => {
        if (i === null) return 0;
        else if (i + 1 < list.length) {
          return i + 1;
        }
        return i;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isShowList) return showList();

      setActiveIdx((i) => {
        if (i - 1 > -1) return i - 1;
        return i;
      });
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsShowList(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx) {
        selectItem(activeIdx);
      } else if (
        list.length > 0 &&
        getSearchedTextFromItem(list[0], searchProp).indexOf(searchText) === 0
      ) {
        selectItem(0);
      }
    } else if (e.key === 'Tab') {
      setIsShowList(false);
    }

    /// AUTO COMPLETE part, step 1: determine isAutoComplete on keyDown event
    /// Prevent autocomplete for keycode <= 47.
    autoCompleteKeyDown(e);

    // console.log(
    //   'get selection range',
    //   e.target.value.substring(e.target.selectionStart, e.target.selectionEnd),
    //   'searchText',
    //   searchText
    // );
  }

  return (
    <Input
      type="text"
      value={inputText}
      onChange={handleSearchChange}
      onKeyDown={handleKeyDown}
      // onBlur={handleBlur}
      placeholder={placeholder || 'Search for data'}
      ref={refInput}
    />
  );
}

export default SearchInput;
