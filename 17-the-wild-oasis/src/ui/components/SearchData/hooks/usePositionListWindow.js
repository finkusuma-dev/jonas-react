import { useLayoutEffect } from 'react';
import { useCallback } from 'react';

const PADDING_BROWSER_WINDOW = 8;
const SPACE_INPUT_TEXT = 4;
const MIN_BROWSER_WINDOW_BOTTOM_SPACE = 130;
const MAX_LIST_HEIGHT = '500px';

function usePositionListWindow({
  refInput,
  refListBox,
  refListItemsContainer,
  state,
}) {
  // const { state } = useSearchData();
  // const [listWindow, setListWindow] = useState({});

  /// Calculate & set the maxHeight of list items container window.

  const calculate = useCallback(
    function calculate() {
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
        MIN_BROWSER_WINDOW_BOTTOM_SPACE <= bottomSpace ||
        bottomSpace > topSpace;
      const maxHeight = (() => {
        const mh = isOnBottom
          ? window.innerHeight -
            rectInput.bottom -
            PADDING_BROWSER_WINDOW +
            'px'
          : rectInput.top - PADDING_BROWSER_WINDOW + 'px';

        // console.log('max height', mh, MAX_LIST_HEIGHT, MAX_LIST_HEIGHT < mh);
        if (Number.parseInt(MAX_LIST_HEIGHT) < Number.parseInt(mh))
          return MAX_LIST_HEIGHT;
        return mh;
      })();

      return isOnBottom
        ? {
            top: rectInput.height + SPACE_INPUT_TEXT + 'px',
            maxHeight: maxHeight,
          }
        : {
            bottom: rectInput.height + SPACE_INPUT_TEXT + 'px',
            maxHeight: maxHeight,
          };
    },
    [refInput]
  );

  /// NOTE: Position & set the maxHeight of ListBox is set by
  /// passing the listWindow to the ListBox styled component props.
  /// Because it failed to set the maxHeight of ListBox as a styled component in this JS code.
  useLayoutEffect(() => {
    if (!state.isShowList) return;
    const lw = calculate();
    // console.log('listWindow', lw);
    // console.log('refListBox', refListBox.current);
    if (refListBox.current) {
      refListBox.current.style.maxHeight = lw.maxHeight;
      if (lw.top) {
        refListBox.current.style.top = lw.top;
        refListBox.current.style.bottom = undefined;
      } else if (lw.bottom) {
        refListBox.current.style.bottom = lw.bottom;
        refListBox.current.style.top = undefined;
      }
      // console.log({
      //   name: 'refListBox',
      //   top: refListBox.current.style.top,
      //   bottom: refListBox.current.style.bottom,
      //   offsetTop: refListBox.current.style.offsetTop,
      //   current: refListBox.current,
      // });
    }
    if (refListItemsContainer.current) {
      // console.log(
      //   'refListItemsContainer',
      //   refListItemsContainer.current.top,
      //   refListItemsContainer.current.offsetTop
      //   //   refListItemsContainer.current.position
      // );
      // console.log('listWindow', listWindow);

      refListItemsContainer.current.style.maxHeight =
        Number.parseInt(lw.maxHeight) -
        refListItemsContainer.current.offsetTop +
        'px';
    }
  }, [
    // listWindow,
    refListBox,
    refListItemsContainer,
    calculate,
    state.isShowList,
  ]);

  // function positionListWindow() {
  //   const lw = calculate();
  //   console.log('listWindow', lw);
  //   console.log('refListBox', refListBox.current);
  //   if (refListBox.current) {
  //     refListBox.current.maxHeight = lw.maxHeight;
  //     if (lw.top) {
  //       refListBox.current.top = lw.top;
  //       refListBox.current.bottom = undefined;
  //     } else if (lw.bottom) {
  //       refListBox.current.bottom = lw.bottom;
  //       refListBox.current.top = undefined;
  //     }
  //     console.log(
  //       'refListBox',
  //       refListBox.current.top,
  //       refListBox.current.offsetTop,
  //       refListBox.current
  //     );
  //   }
  // }

  function positionListWindow() {
    console.log('refListBox.current', refListBox.current);
    // const rectInput = refInput.current.getBoundingClientRect();
    // const topSpace = rectInput.top;
    // const bottomSpace = window.innerHeight - rectInput.bottom;
    // // console.log(
    // //   'Top space',
    // //   rectInput.top,
    // //   'Bottom space',
    // //   window.innerHeight - rectInput.bottom
    // // );
    // const isOnBottom =
    //   MIN_BROWSER_WINDOW_BOTTOM_SPACE <= bottomSpace || bottomSpace > topSpace;
    // const maxHeight = (() => {
    //   const mh = isOnBottom
    //     ? window.innerHeight - rectInput.bottom - PADDING_BROWSER_WINDOW + 'px'
    //     : rectInput.top - PADDING_BROWSER_WINDOW + 'px';
    //   // console.log('max height', mh, MAX_LIST_HEIGHT, MAX_LIST_HEIGHT < mh);
    //   if (Number.parseInt(MAX_LIST_HEIGHT) < Number.parseInt(mh))
    //     return MAX_LIST_HEIGHT;
    //   return mh;
    // })();
    // const window = calculate();
    // setListWindow(
    //   isOnBottom
    //     ? {
    //         top: rectInput.height + SPACE_INPUT_TEXT + 'px',
    //         maxHeight: maxHeight,
    //       }
    //     : {
    //         bottom: rectInput.height + SPACE_INPUT_TEXT + 'px',
    //         maxHeight: maxHeight,
    //       }
    // );
  }

  return;
}

export { usePositionListWindow };
