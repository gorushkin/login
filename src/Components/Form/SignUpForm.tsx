import style from './Form.module.scss';
import { Form, useUserForm } from '../../packages/Form/Form';
import { Input } from '../../packages/Form/Input/Input';
import { memo, useCallback, useEffect, useState } from 'react';

const valueValidator = (value: string) => !!value;

const SignUpForm = () => {
  const [isFormValid, setIsFormValid] = useState(true);
  const form = useUserForm();

  useEffect(() => {
    form.setValues({ login: 'Artyom' });
  }, [form]);

  useEffect(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  const handleValuesChange = useCallback(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  return (
    <Form onValuesChange={handleValuesChange} form={form}>
      <Input name='login' type='text' className={style.input} rules={valueValidator} />
      <Input name='name' type='text' className={style.input} rules={valueValidator} />
      <Input name='password' type='text' className={style.input} rules={valueValidator} />
      <button disabled={!isFormValid} type='submit'>
        Login
      </button>
    </Form>
  );
};

const withMemoSignUpForm = memo(SignUpForm);

export { withMemoSignUpForm as SignUpForm };
