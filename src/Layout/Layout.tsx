import { useCallback, useState } from 'react';
import { LoginPage } from '../Components/Pages/LoginPage/Login';
import { SignUpPage } from '../Components/Pages/SignUpPage/SignUpPage';

export interface Page {
  onclick: (mode: Mode) => void;
}

type Mode = 'login' | 'signUp';

export const Layout = () => {
  return <LoginPage />;
};
