import style from './LoginForm.module.scss';
import { Input } from '../Input/Input';
import { Form, FormData } from '../../Context/Form';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export const LoginForm = () => {
  const loginValidator = (value: string) => !!value;
  const ageValidator = (value: string) => {
    console.log('value: ', value);
    const regex = /^(0|[1-9][0-9]*)$/;
    return regex.test(value);
  };
  const [isFormValid, setIsFormValid] = useState(true);

  const form = Form.form();

  const handleFormSubmit = useCallback(
    (values: FormData) => {
      console.log('values: ', values);
      console.log(form.isFormValid());
    },
    [form]
  );

  const handleValuesChange = useCallback(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  useLayoutEffect(() => {
    form.setValues({ login: 'gorushkin', name: 'Arm' });
  }, [form]);

  useEffect(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  return (
    <Form
      onValuesChange={handleValuesChange}
      onSubmit={handleFormSubmit}
      form={form}
      className={style.form}
    >
      <Input name='login' type='text' className={style.input} rules={loginValidator} />
      <Input name='name' type='text' className={style.input} />
      <Input name='age' type='text' className={style.input} rules={ageValidator} />
      <button disabled={!isFormValid} type='submit'>
        Button
      </button>
    </Form>
  );
};
