import { useEffect } from 'react';

function useDebugListenScrollEvent({
  enabled = false,
  isShowList,
  refListItemsContainer,
}) {
  useEffect(() => {
    function onScroll() {
      console.log(
        'refListItemsContainer.scrollTop',
        refListItemsContainer.current.scrollTop
      );
    }

    if (!enabled) return;
    // console.log('isShowList', isShowList, refListBox.current);
    if (isShowList && refListItemsContainer.current) {
      console.log('inside');
      const ref = refListItemsContainer.current;
      const res = ref.addEventListener('scroll', onScroll);
      console.log('addevent result', res);

      return () => ref.removeEventListener('scroll', onScroll);
    }
  }, [enabled, isShowList, refListItemsContainer]);
}

export default useDebugListenScrollEvent;
