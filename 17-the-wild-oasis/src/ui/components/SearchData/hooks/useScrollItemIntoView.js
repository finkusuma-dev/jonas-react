import { useEffect } from 'react';

/**
 * Hook to scroll a specific item into view within a scrollable container.
 *
 * @param {Object} params - The parameters for the hook.
 * @param {boolean} params.enabled - Enable or disable the scroll behavior.
 * @param {number | null} params.itemIdx - The index of the item to scroll into view. If `null`, scrolls to the top of the container.
 * @param {Object} params.refListContainer - React ref pointing to the scrollable list container.
 *
 * @example
 * const refListContainer = useRef();
 * useScrollItemIntoView({
 *   enabled: true,
 *   itemIdx: selectedItemIndex,
 *   refListContainer: refListContainer
 * });
 */
function useScrollItemIntoView({
  enabled, // Whether scrolling is enabled
  itemIdx, // Index of the item to scroll into view. Null to scroll to the top.
  refListContainer, // Ref to the scrollable list container
}) {
  useEffect(() => {
    if (enabled && refListContainer.current) {
      // Scroll to top of container if no specific item is selected
      if (itemIdx === null) {
        refListContainer.current.scrollTop = 0;
      } else {
        // Get the top offset of the first item in the container
        const firstItemTop = refListContainer.current.children[0]?.offsetTop;

        // Get the visible height of the container
        const listHeight = refListContainer.current.clientHeight;

        // Get the top offset of the item to scroll into view
        const itemTop = refListContainer.current.children[itemIdx]?.offsetTop;

        // Get the bottom offset of the item
        const itemBottom =
          itemTop + refListContainer.current.children[itemIdx]?.clientHeight;

        // Calculate the bottom margin (padding) of the container
        const listBoxMarginBlock = Number.parseInt(
          window.getComputedStyle(refListContainer.current)?.paddingBottom
        );

        // Scroll down if the item is below the current visible area
        if (
          itemBottom - firstItemTop + listBoxMarginBlock >
          listHeight + refListContainer.current.scrollTop
        ) {
          refListContainer.current.scrollTop =
            itemBottom - firstItemTop - listHeight + listBoxMarginBlock * 2;
        }
        // Scroll up if the item is above the current visible area
        else if (itemTop - firstItemTop < refListContainer.current.scrollTop) {
          refListContainer.current.scrollTop = itemTop - firstItemTop;
        }
      }
    }
  }, [enabled, itemIdx, refListContainer]);
}

export default useScrollItemIntoView;
