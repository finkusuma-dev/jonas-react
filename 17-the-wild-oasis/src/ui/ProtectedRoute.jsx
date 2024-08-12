import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import useLoggedUser from '../features/authentication/useLoggedUser';
import Spinner from '../ui/Spinner';
import { createContext } from 'react';
import { useContext } from 'react';

ProtectedRoute.propTypes = {
  children: PropTypes.any,
};

const ProtectedContext = createContext();

function ProtectedRoute({ children }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    error: getUserError,
  } = useLoggedUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      // console.log('Protected route useEffect run');
      if (getUserError) console.log('getUser error', getUserError);

      if (!isAuthenticated) navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, getUserError, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <ProtectedContext.Provider value={{ user }}>
      {children}
    </ProtectedContext.Provider>
  );
}

function User() {
  const { user } = useContext(ProtectedContext);

  if (!user) return null;

  return <div>{user.email}</div>;
}

ProtectedRoute.User = User;

export default ProtectedRoute;
