import styled from 'styled-components';
import PropTypes from 'prop-types';

// const rotate = keyframes`
//   to {
//     transform: rotate(1turn)
//   }
// `;

const StyledClearButton = styled.button`
  border: none;
  padding: 10px;
  display: flex;
  align-items: center;
  /* position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px; */
  background-color: transparent;
  color: #4b5563;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

ClearButton.propTypes = {
  style: PropTypes.object,
};

function ClearButton({ style }) {
  return (
    <StyledClearButton style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
      </svg>
    </StyledClearButton>
  );
}

export default ClearButton;
