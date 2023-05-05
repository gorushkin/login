import style from './Form.module.scss';
import { Form } from '../../packages/Form/Form';
import { useForm } from './useForm';

const valueValidator = (value: string) => !!value;

export const SignUpForm = () => {
  const { FormWrapper } = useForm({className: style.form, buttonTitle: 'SignUp'});

  return (
    <FormWrapper>
      <Form.Input name='login' type='text' className={style.input} rules={valueValidator} />
      <Form.Input name='name' type='text' className={style.input} rules={valueValidator} />
      <Form.Input name='password' type='text' className={style.input} rules={valueValidator} />
    </FormWrapper>
  );
};
