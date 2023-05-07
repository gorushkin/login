import { useRef } from 'react';
import style from './Layout.module.scss';
import { useScroll } from '../Hooks/useScroll';
import { LoginForm } from '../Components/Form/LoginForm';
import { SignUpForm } from '../Components/Form/SignUpForm';
import { cn } from '../utils/utils';

export const Layout = () => {
  const panel = useRef<HTMLDivElement>(null);
  const login = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const { panelClickHandler, panelStyles, direction } = useScroll({ page, panel, login });

  const className = cn(style.wrapper, `${style[`wrapper${direction}`]}`);

  return (
    <div ref={page} className={className}>
      <div ref={login} className={style.main}>
        {direction === 'left' && <LoginForm />}
        {direction === 'right' && <SignUpForm />}
      </div>
      <div className={style.panel}></div>
      <div style={panelStyles} ref={panel} onClick={panelClickHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
