import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import styled from 'styled-components';
import LoginForm from '../features/authentication/LoginForm';
import Logo from '../ui/Logo';
import Heading from '../ui/Heading';
import useLoggedUser from '../features/authentication/useLoggedUser';

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Login() {
  const { user, isAuthenticated, isLoading, error } = useLoggedUser();
  const navigate = useNavigate();

  // const user = data?.user;

  useEffect(() => {
    if (!isLoading) {
      if (error) console.log('useGetUser error', error);
      // console.log('Login user', user);
      if (isAuthenticated) navigate('/', { replace: true });
    }
  }, [user, isAuthenticated, error, isLoading, navigate]);

  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">Login with your account</Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
