import { useEffect } from 'react';

/**
 * Scroll item into view
 * @param {boolean} isShowList
 */
function useScrollItemIntoView({
  isShowList,
  activeIdx,
  refListItemsContainer,
}) {
  useEffect(() => {
    if (isShowList && refListItemsContainer.current) {
      // console.log('refListBox', refListBox.current.maxHeight);
      // console.log(
      //   'refListItemsContainer',
      //   refListItemsContainer.current.clientHeight,
      //   'scrollTop',
      //   refListItemsContainer.current.scrollTop
      // );
      if (activeIdx === null) {
        refListItemsContainer.current.scrollTop = 0;
      } else {
        const firstItemTop =
          refListItemsContainer.current.children[0]?.offsetTop;
        const listHeight = refListItemsContainer.current.clientHeight;
        const itemTop =
          refListItemsContainer.current.children[activeIdx]?.offsetTop;
        const itemBottom =
          itemTop +
          refListItemsContainer.current.children[activeIdx]?.clientHeight;

        const listBoxMarginBlock = Number.parseInt(
          window.getComputedStyle(refListItemsContainer.current)?.paddingBottom
        );
        // console.log('listbox margin', listBoxMarginBottom);
        /// Scroll to bottom
        // console.log(
        //   'item',
        //   itemTop,
        //   itemBottom - firstItemTop,
        //   '>',
        //   listHeight + refListItemsContainer.current.scrollTop
        // );
        if (
          itemBottom - firstItemTop + listBoxMarginBlock >
          listHeight + refListItemsContainer.current.scrollTop
        ) {
          refListItemsContainer.current.scrollTop =
            itemBottom - firstItemTop - listHeight + listBoxMarginBlock * 2;
          // console.log('scrollTop', refListItemsContainer.current.scrollTop);
        }
        /// Scroll to top
        else if (
          itemTop - firstItemTop <
          refListItemsContainer.current.scrollTop
        ) {
          refListItemsContainer.current.scrollTop = itemTop - firstItemTop;
        }
      }
    }
  }, [isShowList, activeIdx, refListItemsContainer]);
}

export default useScrollItemIntoView;
