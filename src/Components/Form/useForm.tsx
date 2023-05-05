import { useState, useCallback, useLayoutEffect, useEffect, useMemo, FC, ReactNode } from 'react';
import { Form, FormData, FormState } from '../../packages/Form/Form';

type UseForm = (props: {
  values?: { [x: string]: string };
  className?: string;
  buttonTitle: string;
}) => {
  form: FormState;
  handleValuesChange: () => void;
  handleFormSubmit: (values: FormData) => void;
  isFormValid: boolean;
  FormWrapper: FC<{
    children: ReactNode;
  }>;
};
export const useForm: UseForm = ({buttonTitle, className = '', values = {}}) => {
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
    if (values) form.setValues(values);
  }, [form, values]);

  useEffect(() => {
    setIsFormValid(form.isFormValid());
  }, [form]);

  const FormWrapper = useMemo(() => {
    const Component: FC<{ children: ReactNode }> = ({ children }) => (
      <Form
        onValuesChange={handleValuesChange}
        onSubmit={handleFormSubmit}
        form={form}
        className={className}
      >
        <>{children}</>
        <button disabled={!isFormValid} type='submit'>
          {buttonTitle}
        </button>
      </Form>
    );

    return Component;
  }, [buttonTitle, className, form, handleFormSubmit, handleValuesChange, isFormValid]);

  return { form, handleValuesChange, handleFormSubmit, isFormValid, FormWrapper };
};
