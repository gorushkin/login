import style from './UserForm.module.scss';
import { Form } from '../../packages/Form/Form';
import { memo, useCallback, useState } from 'react';
import { UserForm } from './UserForm';
import { LoginRequestResult, loginRequest } from '../../utils/services';
import { startTimer } from '../../utils/utils';
import { simpleRule } from '../../utils/validators';

const LoginForm = () => {
  const [user, setUser] = useState<{ user: string; age: number } | null>(null);
  const [timer, setTimer] = useState(5);

  const handleSubmit = useCallback((data: LoginRequestResult) => {
    setUser(data);
    if (!data) return setTimer(5);
    startTimer(5, setTimer);
  }, []);

  return (
    <div className={style.wrapper}>
      <UserForm obSubmit={handleSubmit} request={loginRequest} buttonTitle='login'>
        <Form.Input name='login' type='text' className={style.input} rule={simpleRule} />
        <Form.Input name='password' type='password' className={style.input} rule={simpleRule} />
      </UserForm>
      {!!user && (
        <div className={style.userInfo}>
          <p>Welcome, {user.user}</p>
          <p>you'll be redirected to the main page in {timer} seconds</p>
        </div>
      )}
    </div>
  );
};

const withMemoLoginForm = memo(LoginForm);

export { withMemoLoginForm as LoginForm };
