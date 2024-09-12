import { useRef } from 'react';
import { useEffect } from 'react';

/**
 * Custom hook to implement autocomplete functionality based on user input and a list of suggestions.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {boolean} params.enabled - Enable or disable the autocomplete functionality.
 * @param {string} params.inputText - The current state of the input text.
 * @param {Function} params.setInputText - Function to update the input text state.
 * @param {string} params.searchText - The search text, typically updated from the input's `onChange` event.
 * @param {Object} params.refInput - Ref to the input element for managing text selection.
 *
 * @returns {AutocompleteFunctions} - An object containing `searchChange` and `keyDown` functions for managing autocomplete behavior.
 */
function useAutocomplete({
  enabled, // Enable or disable this hook
  inputText, // State of the input text
  setInputText, // Set the state of the input text
  searchText, // User's search on input text, get from input text's onChange event.
  refInput, // Reference to the input text
}) {
  const refApplied = useRef(false);

  /**
   * Handles the text selection for autocomplete.
   * This effect is triggered when the input text changes, and attempts to select the suggested autocomplete text.
   */
  useEffect(() => {
    if (
      enabled &&
      refApplied.current
      // && inputText.indexOf(searchText) === 0 (Optional check for prefix match)
    ) {
      refInput.current.setSelectionRange(searchText.length, inputText.length);
    }
  }, [enabled, searchText, inputText, refInput]);

  /**
   * Handles changes in the search input and sets the input text for autocomplete based on the first suggestion.
   *
   * @param {string} newSearchString - The new search string entered by the user.
   * @param {string} firstItemInList - The first item in the list of suggestions.
   */
  function searchChange(newSearchString, firstItemInList) {
    if (enabled) {
      // Only apply autocomplete if the first item in the list matches the new search string
      if (
        refApplied.current &&
        firstItemInList &&
        firstItemInList.indexOf(newSearchString) === 0
      ) {
        setInputText(firstItemInList); // Update the input text to the first suggestion
      } else {
        refApplied.current = false;
      }
    }
  }

  /**
   * Handles keydown events to determine if autocomplete should be applied.
   *
   * @param {Object} e - The keydown event object.
   * @param {string} firstItemInList - The first item in the list of suggestions.
   */
  function keyDown(e, firstItemInList) {
    if (enabled) {
      refApplied.current = false;

      // Only proceed if the cursor is at the end of the search text
      if (e.target.selectionStart !== searchText.length) {
        return;
      }

      const textSelection = e.target.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd
      );

      // Apply autocomplete only if no text is selected or if the selection matches the suggestion
      if (
        !textSelection.length ||
        searchText + textSelection === firstItemInList
      ) {
        // Prevent autocomplete for certain keys (e.g., non-character keys)
        refApplied.current = e.keyCode > 47;
      }
    }
  }

  return { searchChange, keyDown };
}

export default useAutocomplete;
