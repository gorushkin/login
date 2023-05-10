import { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { Form, FormData } from '../../packages/Form/Form';

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

  const handleSubmit = useCallback((values: FormData) => {
    console.log(values);
  }, []);

  return (
    <Form onSubmit={handleSubmit} onValuesChange={handleValuesChange} form={form}>
      <>{children}</>
      <button disabled={!isFormValid} type='submit'>
        {buttonTitle}
      </button>
    </Form>
  );
};
