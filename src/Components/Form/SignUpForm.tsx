import style from './Form.module.scss';
import { Form, FormData } from '../../packages/Form/Form';
import { memo, useCallback, useEffect, useState } from 'react';

const valueValidator = (value: string) => !!value;

const SignUpForm = () => {
  const [isFormValid, setIsFormValid] = useState(true);
  const form = Form.useForm();

  useEffect(() => {
    form.setValues({ login: 'Artyom' });
  }, [form]);

  useEffect(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  const handleValuesChange = useCallback(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  const handleSubmit = (values: FormData) => {
    console.log(values);
  };

  return (
    <Form onSubmit={handleSubmit} onValuesChange={handleValuesChange} form={form}>
      <Form.Input name='login' type='text' className={style.input} rules={valueValidator} />
      <Form.Input name='name' type='text' className={style.input} rules={valueValidator} />
      <Form.Input name='password' type='text' className={style.input} rules={valueValidator} />
      <button disabled={!isFormValid} type='submit'>
        Login
      </button>
    </Form>
  );
};

const withMemoSignUpForm = memo(SignUpForm);

export { withMemoSignUpForm as SignUpForm };
