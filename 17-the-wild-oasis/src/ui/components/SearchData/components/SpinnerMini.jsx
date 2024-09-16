import styled, { keyframes } from 'styled-components';
import { getCustomStyle, StyleName } from '../helpers/styles';
import { useSearchData } from '../SearchData';

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const StyledSpinnerMini = styled.div`
  /* width: 2.4rem;
  height: 2.4rem; */
  margin: auto 9px;
  /* position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px; */
  display: flex;
  /* width: 20px;
  height: 20px; */
  align-items: center;
  /* background-color: yellow; // transparent; */
  color: #6c7a8e;
  animation: ${rotate} 1.5s infinite linear;
`;

function SpinnerMini() {
  const { stylesProp } = useSearchData();
  const customStyle = getCustomStyle(StyleName.inputTextSpinner, stylesProp);
  return (
    <StyledSpinnerMini style={customStyle}>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        widths="18px"
        height="18px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"></path>
      </svg>
    </StyledSpinnerMini>
  );
}

export default SpinnerMini;
