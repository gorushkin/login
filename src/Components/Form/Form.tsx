import { useState } from 'react';
import style from './Form.module.scss';
import { Input } from '../Input/Input';

export const Form = () => {
  return (
    <form className={style.form}>
      <Input name='login' type='text' className={style.input} />
      <Input name='password' type='password' className={style.input} />
    </form>
  );
};
