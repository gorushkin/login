import style from './UserForm.module.scss';
import { Form } from '../../packages/Form/Form';
import { memo, useCallback } from 'react';
import { UserForm } from './UserForm';
import { RegisterRequestResult, registerRequest } from '../../utils/services';
import { simpleRule, confirmPasswordRule } from '../../utils/validators';

const SignUpForm = () => {
  const handleSubmit = useCallback((data: RegisterRequestResult) => {
    console.log('data: ', data);
  }, []);

  return (
    <UserForm obSubmit={handleSubmit} request={registerRequest} buttonTitle='Sign Up'>
      <Form.Input
        label='Login'
        name='login'
        type='text'
        className={style.input}
        rule={simpleRule}
      />
      <Form.Input label='Name' name='name' type='text' className={style.input} rule={simpleRule} />
      <Form.Input
        label='Password'
        name='password'
        type='password'
        className={style.input}
        rule={simpleRule}
      />
      <Form.Input
        label='Password Confirm'
        name='passwordConfirm'
        type='password'
        className={style.input}
        rule={confirmPasswordRule}
      />
    </UserForm>
  );
};

const withMemoSignUpForm = memo(SignUpForm);

export { withMemoSignUpForm as SignUpForm };
