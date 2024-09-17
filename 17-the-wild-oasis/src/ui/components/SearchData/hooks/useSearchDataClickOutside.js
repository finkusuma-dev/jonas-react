import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { ActionType } from './useSearchDataReducer';

useSearchDataClickOutside.propTypes = {
  refInput: PropTypes.object,
  refListBox: PropTypes.object,
};

function useSearchDataClickOutside({
  refInput,
  refListBox,
  isShowList,
  dispatch,
}) {
  useEffect(
    /// Custom click outside, used to close the list
    function () {
      function handleClick(e) {
        // e.stopPropagation();
        // console.log('clickOutside', ref.current, e.target);
        if (
          isShowList &&
          refInput.current &&
          refListBox.current &&
          !refInput.current.contains(e.target) &&
          !refListBox.current.contains(e.target)
        ) {
          // console.log('Click outside');
          dispatch({
            type: ActionType.hideList,
          });
        }
      }

      document.addEventListener('click', handleClick, false);

      return () => document.removeEventListener('click', handleClick);
    },
    [isShowList, dispatch, refInput, refListBox]
  );
}

export default useSearchDataClickOutside;
