import { useCallback, useState } from 'react';
import { LoginPage } from '../Components/Pages/LoginPage/Login';
import { SignUpPage } from '../Components/Pages/SignUpPage/SignUpPage';

export interface Page {
  onclick: (mode: Mode) => void;
}

type Mode = 'login' | 'signUp';

export const Layout = () => {
  const [currentWindow, setCurrentWindow] = useState<Mode>('login');

  const handleClick = useCallback((mode: Mode) => {
    console.log('mode: ', mode);
    setCurrentWindow(mode);
  }, []);

  if (currentWindow === 'login') return <LoginPage onclick={handleClick} />;
  if (currentWindow === 'signUp') return <SignUpPage onclick={handleClick} />;

  return null;
};
