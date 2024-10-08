import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import useSignUp from './useSignUp';

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const { handleSubmit, register, getValues, formState, reset } = useForm();
  const { signUp } = useSignUp();

  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    // console.log('onSubmit User', {fullName, email, password});
    signUp(
      { fullName, email, password },
      {
        onSuccess: () => reset(),
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" errorMsg={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          {...register('fullName', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Email address" errorMsg={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please enter a valid email address',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        errorMsg={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register('password', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Repeat password"
        errorMsg={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: (value) => {
              return (
                getValues().password === value || 'Password needs to match'
              );
            },
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button className="formButton" variation="secondary" type="reset">
          Cancel
        </Button>
        <Button className="formButton">Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
