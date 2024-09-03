import { useEffect } from 'react';

/**
 * Scroll item into view
 * @param {boolean} isShowList
 */
function useScrollItemIntoView({
  isShowList,
  activeIdx,
  refListBox,
  refListItemsContainer,
}) {
  useEffect(() => {
    if (isShowList && refListBox.current && refListItemsContainer.current) {
      if (activeIdx === null) {
        refListBox.current.scrollTop = 0;
      } else {
        const firstItemTop =
          refListItemsContainer.current.children[0]?.offsetTop;
        const listHeight = refListBox.current.clientHeight;
        const itemTop =
          refListItemsContainer.current.children[activeIdx]?.offsetTop;
        const itemBottom =
          itemTop +
          refListItemsContainer.current.children[activeIdx]?.clientHeight;

        const listBoxMarginBottom = Number.parseInt(
          window.getComputedStyle(refListBox.current)?.paddingBottom
        );
        // console.log('listbox margin', listBoxMarginBottom);
        /// Scroll to bottom
        if (itemBottom > listHeight + refListBox.current.scrollTop) {
          // console.log('scrollTop', itemBottom - listHeight + 8);
          refListBox.current.scrollTop =
            itemBottom - listHeight + listBoxMarginBottom;
        }
        /// Scroll to top
        else if (itemTop - firstItemTop < refListBox.current.scrollTop) {
          refListBox.current.scrollTop = itemTop - firstItemTop;
        }
      }
    }
  }, [isShowList, activeIdx, refListBox, refListItemsContainer]);
}

export default useScrollItemIntoView;
