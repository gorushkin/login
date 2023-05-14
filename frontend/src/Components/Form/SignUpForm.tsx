import style from './UserForm.module.scss';
import { FieldValidator, Form, FormValues } from '../../packages/Form/Form';
import { memo, useCallback } from 'react';
import { UserForm } from './UserForm';
import { RegisterRequestResult, registerRequest } from '../../utils/services';

const valueValidator = (value: string) => !!value;
const passwordConfirmValidator: FieldValidator = (value: string, values: FormValues) => {
  const password = values.password.value;
  return value === password;
};

const SignUpForm = () => {
  const handleSubmit = useCallback((data: RegisterRequestResult) => {
    console.log('data: ', data);
  }, []);

  return (
    <UserForm obSubmit={handleSubmit} request={registerRequest} buttonTitle='Sign Up'>
      <Form.Input name='login' type='text' className={style.input} rules={valueValidator} />
      <Form.Input name='name' type='text' className={style.input} rules={valueValidator} />
      <Form.Input name='password' type='password' className={style.input} rules={valueValidator} />
      <Form.Input
        name='passwordConfirm'
        type='password'
        className={style.input}
        rules={passwordConfirmValidator}
      />
    </UserForm>
  );
};

const withMemoSignUpForm = memo(SignUpForm);

export { withMemoSignUpForm as SignUpForm };
