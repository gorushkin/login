import style from './LoginForm.module.scss';
import { Input } from '../Input/Input';
import { Form, FormValues } from '../../Context/Form';
import { useLayoutEffect } from 'react';

export const LoginForm = () => {
  const loginValidator = (event: string) => !!event;
  const passwordValidator = (event: string) => event.length > 5;

  const form = Form.form();

  const handleFormSubmit = (values: FormValues) => {
    console.log('values: ', values);
  };

  useLayoutEffect(() => {
    form.setValues({ login: 'gorushkin' });
  }, [form]);

  return (
    <Form onSubmit={handleFormSubmit} form={form} className={style.form}>
      <Input name='login' type='text' className={style.input} rules={loginValidator} />
      <Input name='password' type='password' className={style.input} rules={passwordValidator} />
      <button type='submit'>Button</button>
    </Form>
  );
};
