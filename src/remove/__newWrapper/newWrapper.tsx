import { Form, FormContext } from '../../packages/Form/Form';
import style from './Form.module.scss';
import { useForm } from '../useForm';
import { useCallback, useContext } from 'react';

const valueValidator = (value: string) => !!value;

export const WithContextWrapper = ({ className, children }) => {
  const { FormWrapper, form } = useForm({ buttonTitle: 'Login' });

  return <FormWrapper>{children}</FormWrapper>;
};

export const FormWrapper = ({ children }) => {
  return (
    <Form className='sdfdfad'>
      <WithContextWrapper>{children}</WithContextWrapper>
    </Form>
  );
};
