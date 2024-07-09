import styled from 'styled-components';
import GlobalStyled from './styles/GlobalStyled';

const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
`;

function App() {
  return (
    <>
      <GlobalStyled />
      <div>
        <H1>Hello World!</H1>
      </div>
    </>
  );
}

export default App;
