import styled from 'styled-components';
import Row from '../ui/Row';
import ProtectedRoute from './ProtectedRoute';
import Logout from '../features/authentication/Logout';

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  /* grid-column: 1/-1; */
`;
function Header() {
  return (
    <StyledHeader>
      <Row type="horizontal">
        {/* {user && <div>{user.email}</div>} */}
        <div></div>
        <Row type="horizontal">
          <ProtectedRoute.User />
          <Logout />
          {/* &nbsp;<Button onClick={handleLogout}>Logout</Button> */}
        </Row>
      </Row>
    </StyledHeader>
  );
}

export default Header;
