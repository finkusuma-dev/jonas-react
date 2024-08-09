import styled from 'styled-components';
import useLogout from '../features/authentication/useLogout';
import Button from './Button';
import Row from '../ui/Row';
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  /* grid-column: 1/-1; */
`;
function Header() {
  const { logout, isLoggingOut, error: logoutError } = useLogout();

  useEffect(() => {
    if (!isLoggingOut) {
      if (logoutError) console.log('Logging out error', logoutError);
    }
  });

  function handleLogout() {
    logout();
  }

  return (
    <StyledHeader>
      <Row type="horizontal">
        {/* {user && <div>{user.email}</div>} */}
        <div></div>
        <Row type="horizontal">
          <ProtectedRoute.User />
          &nbsp;<Button onClick={handleLogout}>Logout</Button>
        </Row>
      </Row>
    </StyledHeader>
  );
}

export default Header;
