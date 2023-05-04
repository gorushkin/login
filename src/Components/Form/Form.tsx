import style from './Form.module.scss';
import { Input } from '../Input/Input';
import { Form } from '../../Context/Form';

export const LoginForm = () => {
  const loginValidator = (e: string) => !!e;
  const passwordValidator = (e: string) => e.length > 5;

  return (
    <Form className={style.form}>
      <Input name='login0' type='text' className={style.input} rules={loginValidator} />
      <Input name='password' type='password' className={style.input} rules={passwordValidator} />
      <span>asdfasfd</span>
    </Form>
  );
};
