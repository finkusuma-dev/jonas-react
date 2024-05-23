import PropTypes from 'prop-types';
import { useAuth } from '../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

ProtectedRoute.propTypes = {
  children: PropTypes.any,
};

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigate('/');
    },
    [isAuthenticated, navigate]
  );

  /// if use effect hasn't been run it won't try to show the children
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
