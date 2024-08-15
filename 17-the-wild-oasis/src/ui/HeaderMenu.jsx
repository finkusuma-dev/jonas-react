import styled from 'styled-components';
import ButtonIcon from './ButtonIcon';
import { HiOutlineMoon, HiOutlineSun, HiOutlineUser } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import Logout from '../features/authentication/Logout';
import { useDarkMode } from '../context/DarkModeContext';

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate('/account')}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <ButtonIcon onClick={toggleDarkMode}>
          {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
