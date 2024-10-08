import { useLayoutEffect } from 'react';
import { useCallback } from 'react';

const PADDING_BROWSER_WINDOW = 8;
const SPACE_INPUT_TEXT = 4;
const MIN_BROWSER_WINDOW_BOTTOM_SPACE = 200; /* 130 */
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

      // console.log('usePositionListWindow rectInput', rectInput);

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
      // console.log('position list on bottom', isOnBottom, rectInput.top);

      /// Top, bottom, left are calculated based on absolute pos from document.body
      /// because list component is shown with the react createPortal()
      return isOnBottom
        ? {
            top:
              rectInput.bottom +
              document.documentElement.scrollTop +
              SPACE_INPUT_TEXT +
              'px',
            left: rectInput.left + 'px',
            width: rectInput.width + 'px',

            maxHeight: maxHeight,
          }
        : {
            bottom:
              0 +
              (document.documentElement.clientHeight - rectInput.top) +
              SPACE_INPUT_TEXT -
              document.documentElement.scrollTop +
              'px',
            left: rectInput.left + 'px',
            width: rectInput.width + 'px',
            maxHeight: maxHeight,
          };
    },
    [refInput]
  );

  /// Position & set the maxHeight of ListBox
  useLayoutEffect(() => {
    if (!state.isShowList) return;
    const windowProps = calculate();
    // console.log('listWindow', lw);
    // console.log(
    //   'document.documentElement.scrollTop',
    //   document.documentElement.scrollTop
    // );
    if (refListBox.current) {
      // console.log('refListBox.current', refListBox.current);
      // console.log('refListBox.current.style', refListBox.current.style);
      //
      refListBox.current.style.maxHeight = windowProps.maxHeight;
      if (windowProps.top) {
        refListBox.current.style.top = windowProps.top;
        refListBox.current.style.left = windowProps.left;

        /// List width is set based on listWidthProp & other methods on List.js.
        /// If it's undefined then it needs to be the same with input width (windowProps.width)
        refListBox.current.style.width =
          refListBox.current.style.width || windowProps.width;
        refListBox.current.style.bottom = undefined;
      } else if (windowProps.bottom) {
        refListBox.current.style.bottom = windowProps.bottom;
        refListBox.current.style.left = windowProps.left;
        refListBox.current.style.width =
          refListBox.current.style.width || windowProps.width;
        refListBox.current.style.top = undefined;
      }
      // console.log({
      //   name: 'refListBox',
      //   top: refListBox.current.style.top,
      //   bottom: refListBox.current.style.bottom,
      //   offsetTop: refListBox.current.style.offsetTop,
      //   clientHeight: refListBox.current.clientHeight,
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
        Number.parseInt(windowProps.maxHeight) -
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

  /// This function was used to set the state containing list window position
  /// then pass the state to the ListBox styled component props.
  /// Because it failed to set the maxHeight of ListBox as a styled component in this JS code.
  /// As the ListBox component is not used styled component anymore, this func is not used.
  // function positionListWindow() {
  // console.log('refListBox.current', refListBox.current);
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
  // }

  // return;
}

export { usePositionListWindow };
