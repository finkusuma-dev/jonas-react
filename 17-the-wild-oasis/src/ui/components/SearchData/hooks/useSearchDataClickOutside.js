import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { ActionType } from './useSearchDataReducer';

useSearchDataClickOutside.propTypes = {
  refInput: PropTypes.object,
  refListBox: PropTypes.object,
};

function useSearchDataClickOutside({
  // refInput,
  ref,
  // refListBox,
  // isShowList,
  onClick,
}) {
  useEffect(
    /// Custom click outside, used to close the list
    function () {
      function handleClick(e) {
        // e.stopPropagation();
        // console.log('clickOutside', ref.current, e.target);
        if (
          // isShowList &&
          // refInput.current &&
          // refListBox.current &&
          // !refInput.current.contains(e.target) &&
          // !refListBox.current.contains(e.target) &&
          ref.current &&
          !ref.current.contains(e.target)
          // (!refInputButtonContainer.current ||
          //   (refInputButtonContainer.current &&
          //     refInputButtonContainer.current.contains(e.target)))
        ) {
          // console.log('Click outside');
          onClick();
        }
      }

      document.addEventListener('click', handleClick, false);

      return () => document.removeEventListener('click', handleClick);
    },
    [onClick, ref]
  );
}

export default useSearchDataClickOutside;
