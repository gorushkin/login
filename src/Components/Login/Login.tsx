import { LoginForm } from '../LoginForm/LoginForm';
import { SocialIcons } from '../SocialIcons/SocialIcons';
import style from './Login.module.scss';

export const Login = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.title}>Login to Your Account</div>
      <SocialIcons />
      <LoginForm />
    </div>
  );
};
