import style from './LoginForm.module.scss';
import { Input } from '../Input/Input';
import { Form, FormData } from '../../Context/Form';
import { useLayoutEffect } from 'react';

export const LoginForm = () => {
  const loginValidator = (value: string) => !!value;
  const passwordValidator = (value: string) => value.length > 5;

  const form = Form.form();

  const handleFormSubmit = (values: FormData) => {
    console.log('values: ', values);
    console.log(form.isFormValid());
  };

  useLayoutEffect(() => {
    form.setValues({ login: 'gorushkin', name: 'Artyom' });
  }, [form]);

  return (
    <Form onSubmit={handleFormSubmit} form={form} className={style.form}>
      <Input name='login' type='text' className={style.input} rules={loginValidator} />
      <Input name='name' type='text' className={style.input} rules={passwordValidator} />
      <button type='submit'>Button</button>
    </Form>
  );
};
