import { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { Form, FormData } from '../../packages/Form/Form';
import { loginRequest } from '../../utils/services';
import { useFetch } from '../../Hooks/useFetch';
import style from './UserForm.module.scss';
import { Alert } from '../Alert/Alert';
import { cn } from '../../utils/utils';

type UseForm = {
  values?: { [x: string]: string };
  className?: string;
  buttonTitle: string;
  children: ReactNode;
};

export const UserForm: FC<UseForm> = ({ children = '', buttonTitle, values = {} }) => {
  const [isFormValid, setIsFormValid] = useState(false);
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

  const handleSubmit = useCallback(
    (values: FormData) => {
      if (isLoading) return;
      const { password, login } = values;
      handle({ login: login.value, password: password.value });
    },
    [handle, isLoading]
  );

  return (
    <Form
      className={style.form}
      onSubmit={handleSubmit}
      onValuesChange={handleValuesChange}
      form={form}
    >
      <Alert error={error} />
      <>{children}</>
      <button
        className={cn(style.button, isLoading && style.buttonIsLoading)}
        disabled={!isFormValid}
        type='submit'
      >
        {buttonTitle}
        {isLoading && <div className={style.loader} />}
      </button>
    </Form>
  );
};
