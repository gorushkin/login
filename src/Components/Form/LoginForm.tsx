import style from './UserForm.module.scss';
import { Form } from '../../packages/Form/Form';
import { memo } from 'react';
import { UserForm } from './UserForm';
import { loginRequest } from '../../utils/services';

const valueValidator = (value: string) => !!value;

const LoginForm = () => (
  <UserForm request={loginRequest} buttonTitle='login'>
    <Form.Input name='login' type='text' className={style.input} rules={valueValidator} />
    <Form.Input name='password' type='text' className={style.input} rules={valueValidator} />
  </UserForm>
);

const withMemoLoginForm = memo(LoginForm);

export { withMemoLoginForm as LoginForm };
