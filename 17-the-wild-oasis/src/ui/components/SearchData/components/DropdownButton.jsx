import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { getCustomStyle, StyleName } from '../helpers/styles';
// import { useSearchData } from '../SearchData';

// const rotate = keyframes`
//   to {
//     transform: rotate(0.5turn)
//   }
// `;

const StyledButton = styled.div`
  border: none;
  padding: 10px 7px 10px 0px;
  display: flex;
  align-items: center;
  background-color: transparent;
  color: ${(props) => {
    return props.isActive ? '#4f46e5;' : '#4b5563';
  }};
  cursor: pointer;
  /* border: 1px solid red; */

  &:focus {
    outline: none;
    box-shadow: none;
  }

  /* animation: {rotate} 300ms 3 linear; */
`;

DropdownButton.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

function DropdownButton({ onClick, isActive = false }) {
  // const { stylesProp } = useSearchData();
  // const customStyle = getCustomStyle(
  //   StyleName.inputTextClearButton,
  //   stylesProp
  // );
  return (
    <StyledButton
      // style={customStyle}
      onClick={onClick}
      isActive={isActive}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {/* <path d="M128 192l128 128 128-128z" /> */}
        {isActive ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m6 15l6-6l6 6"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m6 9l6 6l6-6"
          />
        )}
      </svg>
    </StyledButton>
  );
}

export default DropdownButton;
