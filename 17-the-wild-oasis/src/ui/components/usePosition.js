import { useState } from 'react';

function usePosition({ refAnchorElement }) {
  const [position, setPosition] = useState({});

  function calculatePosition() {
    // if (refListBox.current) {/
    const rectInput = refAnchorElement.current.getBoundingClientRect();
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
    const isOnBottom = 130 <= bottomSpace || bottomSpace > topSpace;
    //window.innerHeight - rect.bottom > rect.top;
    // console.log('isOnBottom', isOnBottom);
    setPosition(
      isOnBottom
        ? {
            top: rectInput.height + 4 + 'px',
            maxHeight: window.innerHeight - rectInput.bottom - 8 + 'px',
          }
        : {
            bottom: rectInput.height + 4 + 'px',
            maxHeight: rectInput.top - 8 + 'px',
          }
    );
    // }
  }

  return { position, calculatePosition };
}

export { usePosition };
