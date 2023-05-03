import { LoginForm } from '../LoginForm/LoginForm';
import { SocialIcons } from '../SocialIcons/SocialIcons';
import style from './SignUp.module.scss';

export const SignUp = () => {
  return (
    <>
      <div className={style.title}>Login to Your Account</div>
      <SocialIcons />
      <LoginForm />
    </>
  );
};
