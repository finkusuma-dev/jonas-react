import { useState } from 'react';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import FormRowVertical from '../../ui/FormRowVertical';
import useLogin from './useLogin';
import SpinnerMini from '../../ui/SpinnerMini';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoggingIn } = useLogin();
  // const navigate = useNavigate();

  // if (isLoggingIn) return <Spinner />;

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) return;
    if (login === undefined) return;

    const { error } = login({ email, password });

    console.log('login error', error);

    // if (data) navigate('/');/
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormRowVertical label="Email address">
          <Input
            type="email"
            id="email"
            // This makes this form better for password managers
            autoComplete="username"
            value={email}
            disabled={isLoggingIn}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormRowVertical>
        <FormRowVertical label="Password">
          <Input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            disabled={isLoggingIn}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormRowVertical>
        <FormRowVertical>
          <Button size="large" disabled={isLoggingIn}>
            {!isLoggingIn ? 'Login' : <SpinnerMini />}
          </Button>
        </FormRowVertical>
      </Form>
    </>
  );
}

export default LoginForm;
