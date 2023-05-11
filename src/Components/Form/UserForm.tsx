import { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { Form, FormData } from '../../packages/Form/Form';
import { loginRequest } from '../../utils/services';
import { useFetch } from '../../Hooks/useFetch';

type UseForm = {
  values?: { [x: string]: string };
  className?: string;
  buttonTitle: string;
  children: ReactNode;
};

export const UserForm: FC<UseForm> = ({ children = '', buttonTitle, values = {} }) => {
  const [isFormValid, setIsFormValid] = useState(true);
  const form = Form.useForm();

  useEffect(() => {
    form.setValues(values);
  }, [form, values]);

  useEffect(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  const handleValuesChange = useCallback(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  const [{ data, error, isLoading }, handle] = useFetch(loginRequest);
  console.log('isLoading: ', isLoading);
  // console.log('error: ', error);
  console.log('data: ', data);

  const handleSubmit = useCallback(
    async (values: FormData) => {
      const { password, login } = values;
      await handle({ login: login.value, password: password.value });

      // const response = await loginRequest({ login: login.value, password: password.value });
      // console.log('response: ', response);
    },
    [handle]
  );

  return (
    <Form onSubmit={handleSubmit} onValuesChange={handleValuesChange} form={form}>
      <>{children}</>
      <button disabled={!isFormValid} type='submit'>
        {buttonTitle}
      </button>
    </Form>
  );
};
