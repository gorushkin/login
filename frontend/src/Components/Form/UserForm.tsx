import { ReactNode, useState, useEffect, useCallback } from 'react';
import { Form, FormValues } from '../../packages/Form/Form';
import { Request } from '../../utils/services';
import { useFetch } from '../../Hooks/useFetch';
import style from './UserForm.module.scss';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';

export const UserForm = <T, K>({
  children = '',
  buttonTitle,
  values = {},
  request,
  obSubmit,
}: {
  values?: { [x: string]: string };
  className?: string;
  buttonTitle: string;
  children: ReactNode;
  request: Request<T, K>;
  obSubmit: (data: K) => void;
}) => {
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

  const [{ data, error, isLoading }, handler] = useFetch(request);

  useEffect(() => {
    if (data) obSubmit(data);
  }, [data, obSubmit]);

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (isLoading) return;
      const payload = Object.entries(values).reduce((acc, [name, { value }]) => {
        return { ...acc, [name]: value };
      }, {} as { [x: string]: string });
      handler(payload as T);
    },
    [handler, isLoading]
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
      <Button isLoading={isLoading} disabled={!isFormValid}>
        {buttonTitle}
      </Button>
    </Form>
  );
};
