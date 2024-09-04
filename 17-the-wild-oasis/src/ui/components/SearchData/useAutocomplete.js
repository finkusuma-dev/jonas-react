import { useRef } from 'react';
import { useEffect } from 'react';

function useAutocomplete({
  enabled,
  inputText,
  setInputText,
  searchText,
  refInput,
}) {
  const refApplied = useRef(false);

  /// AUTO COMPLETE part, step 3:
  /// Mark selection for autocomplete
  useEffect(() => {
    if (
      enabled &&
      refApplied.current
      // && inputText.indexOf(searchText) === 0
    ) {
      refInput.current.setSelectionRange(searchText.length, inputText.length);
    }
  }, [enabled, searchText, inputText, refInput]);

  function searchChange(newSearchString, newFirstItemStr) {
    /// AUTO COMPLETE part, step 2:
    /// Set input text for autocomplete
    if (enabled) {
      if (
        refApplied.current &&
        newFirstItemStr &&
        newFirstItemStr.indexOf(newSearchString) === 0
      ) {
        // console.log('setInputText');
        setInputText(newFirstItemStr);
      } else {
        refApplied.current = false;
      }
    }
  }

  function keyDown(e, firstItemStr) {
    /// AUTO COMPLETE part, step 1: determine isApplyAutoComplete on keyDown event
    /// Prevent autocomplete for keycode <= 47.
    if (enabled) {
      /// Only perform autocomplete when the cursor is on the end of searchText
      refApplied.current = false;

      if (e.target.selectionStart !== searchText.length) {
        return;
      }
      const selectedText = e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
      );

      /// If current selected text is from previous autocomplete,
      /// set the next autocomplete
      if (!selectedText.length || searchText + selectedText === firstItemStr) {
        refApplied.current = e.keyCode > 47;
      }

      // console.log(
      //   ' > ',
      //   searchText,
      //   ' + ',
      //   selectedText,
      //   ' === ',
      //   firstItem,
      //   searchText + selectedText === firstItem
      // );
    }
  }

  return { searchChange, keyDown };
}

export default useAutocomplete;
