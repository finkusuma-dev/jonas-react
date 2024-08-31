import { useEffect } from 'react';
import { useState } from 'react';
import { getSearchedTextFromItem } from './func';

function useAutocomplete({
  autoComplete,
  inputText,
  searchText,
  refInput,
  searchProp,
  setInputText,
  list,
}) {
  const [isApplyAutoComplete, setIsApplyAutoComplete] = useState(false);

  /// AUTO COMPLETE part, step 3:
  /// Mark selection for autocomplete
  useEffect(() => {
    if (
      autoComplete &&
      isApplyAutoComplete &&
      inputText.indexOf(searchText) === 0
    ) {
      // console.log('setSelectionRange', searchText.length, inputText.length);
      refInput.current.setSelectionRange(searchText.length, inputText.length);
    }
  }, [autoComplete, isApplyAutoComplete, searchText, inputText, refInput]);

  function searchChange(list, searchString) {
    /// AUTO COMPLETE part, step 2:
    /// Set input text for autocomplete
    console.log('list.length', list.length);
    if (autoComplete) {
      if (isApplyAutoComplete && list.length > 0) {
        const str = getSearchedTextFromItem(list[0], searchProp);

        if (str.indexOf(searchString) === 0) {
          setInputText(str);
        }
      }
    }
  }

  function keyDown(e) {
    /// AUTO COMPLETE part, step 1: determine isApplyAutoComplete on keyDown event
    /// Prevent autocomplete for keycode <= 47.
    if (autoComplete) {
      // console.log(
      //   'e.target.selectionStart',
      //   e.target.selectionStart,
      //   searchText.length
      // );

      /// Only perform autocomplete when the cursor is on the end of searchText
      if (e.target.selectionStart !== searchText.length) {
        return setIsApplyAutoComplete(false);
      }
      const selectedText = e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
      );

      const firstItem =
        list.length > 0 ? getSearchedTextFromItem(list[0], searchProp) : '';
      // console.log(
      //   ' > ',
      //   searchText,
      //   ' + ',
      //   selectedText,
      //   ' === ',
      //   firstItem,
      //   searchText + selectedText === firstItem
      // );

      /// If current selected text is from previous autocomplete,
      /// set the next autocomplete
      if (
        selectedText.length === 0 ||
        searchText + selectedText === firstItem
      ) {
        setIsApplyAutoComplete(e.keyCode > 47);
      }
    }
  }

  return { searchChange, keyDown };
}

export default useAutocomplete;
