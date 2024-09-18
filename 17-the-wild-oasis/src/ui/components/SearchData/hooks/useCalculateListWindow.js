import { useEffect } from 'react';
import { useState } from 'react';

const PADDING_BROWSER_WINDOW = 8;
const SPACE_INPUT_TEXT = 4;
const MIN_BROWSER_WINDOW_BOTTOM_SPACE = 130;
const MAX_LIST_HEIGHT = '500px';

function useCalculateListWindow({
  refInput,
  // refListBox,
  refListItemsContainer,
}) {
  const [listWindow, setListWindow] = useState({});

  /// Calculate & set the maxHeight of list items container window.

  /// NOTE: Position & set the maxHeight of ListBox is set by
  /// passing the listWindow to the ListBox styled component props.
  /// Because it failed to set the maxHeight of ListBox as a styled component in this JS code.
  useEffect(() => {
    if (refListItemsContainer.current) {
      // console.log(
      //   'refListItemsContainer',
      //   refListItemsContainer.current.top,
      //   refListItemsContainer.current.offsetTop
      //   //   refListItemsContainer.current.position
      // );
      // console.log('listWindow', listWindow);

      refListItemsContainer.current.style.maxHeight =
        Number.parseInt(listWindow.maxHeight) -
        refListItemsContainer.current.offsetTop +
        'px';
    }
  }, [listWindow, refListItemsContainer]);

  function calculateListWindow() {
    const rectInput = refInput.current.getBoundingClientRect();

    const topSpace = rectInput.top;
    const bottomSpace = window.innerHeight - rectInput.bottom;

    // console.log(
    //   'Top space',
    //   rectInput.top,
    //   'Bottom space',
    //   window.innerHeight - rectInput.bottom
    // );
    const isOnBottom =
      MIN_BROWSER_WINDOW_BOTTOM_SPACE <= bottomSpace || bottomSpace > topSpace;
    const maxHeight = (() => {
      const mh = isOnBottom
        ? window.innerHeight - rectInput.bottom - PADDING_BROWSER_WINDOW + 'px'
        : rectInput.top - PADDING_BROWSER_WINDOW + 'px';

      // console.log('max height', mh, MAX_LIST_HEIGHT, MAX_LIST_HEIGHT < mh);
      if (Number.parseInt(MAX_LIST_HEIGHT) < Number.parseInt(mh))
        return MAX_LIST_HEIGHT;
      return mh;
    })();

    setListWindow(
      isOnBottom
        ? {
            top: rectInput.height + SPACE_INPUT_TEXT + 'px',
            maxHeight: maxHeight,
          }
        : {
            bottom: rectInput.height + SPACE_INPUT_TEXT + 'px',
            maxHeight: maxHeight,
          }
    );
  }

  return { listWindow, calculateListWindow };
}

export { useCalculateListWindow };
