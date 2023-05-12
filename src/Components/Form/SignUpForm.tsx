import style from './UserForm.module.scss';
import { Form } from '../../packages/Form/Form';
import { memo } from 'react';
import { UserForm } from './UserForm';

const valueValidator = (value: string) => !!value;

const SignUpForm = () => (
  <UserForm  buttonTitle='Sign Up'>
    <Form.Input name='login' type='text' className={style.input} rules={valueValidator} />
    <Form.Input name='name' type='text' className={style.input} rules={valueValidator} />
    <Form.Input name='password' type='text' className={style.input} rules={valueValidator} />
  </UserForm>
);

const withMemoSignUpForm = memo(SignUpForm);

export { withMemoSignUpForm as SignUpForm };
