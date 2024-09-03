import { useState } from 'react';

const SPACE_BROWSER_WINDOW = 8;
const SPACE_INPUT_TEXT = 4;
const MIN_BROWSER_WINDOW_BOTTOM_SPACE = 130;

function usePositionListWindow({ refInput }) {
  const [listWindow, setListWindow] = useState({});

  function calculateListWindow() {
    // if (refListBox.current) {/
    const rectInput = refInput.current.getBoundingClientRect();
    console.log('rectInput', rectInput);
    const topSpace = rectInput.top;
    const bottomSpace = window.innerHeight - rectInput.bottom;
    // const rectList = refListBox.current.getBoundingClientRect();
    // console.log('window.innerHeight', window.innerHeight);
    // console.log('Input rect', rect);
    // console.log('rectList', rectList.height);

    // console.log(
    //   'Top space',
    //   rectInput.top,
    //   'Bottom space',
    //   window.innerHeight - rectInput.bottom
    // );
    const isOnBottom =
      MIN_BROWSER_WINDOW_BOTTOM_SPACE <= bottomSpace || bottomSpace > topSpace;
    //window.innerHeight - rect.bottom > rect.top;
    // console.log('isOnBottom', isOnBottom);
    setListWindow(
      isOnBottom
        ? {
            top: rectInput.height + SPACE_INPUT_TEXT + 'px',
            maxHeight:
              window.innerHeight -
              rectInput.bottom -
              SPACE_BROWSER_WINDOW +
              'px',
          }
        : {
            bottom: rectInput.height + SPACE_INPUT_TEXT + 'px',
            maxHeight: rectInput.top - SPACE_BROWSER_WINDOW + 'px',
          }
    );
    // }
  }

  return { listWindow, calculateListWindow };
}

export { usePositionListWindow };
