import { useRef } from 'react';
import style from './Layout.module.scss';
import { useScroll } from '../Hooks/useScroll';
import { LoginForm } from '../Components/Form/LoginForm';
import { SignUpForm } from '../Components/Form/SignUpForm';
import { cn } from '../utils/utils';
import { FloatPanel } from '../Components/FloatPanel/FloatPanel';

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
      <FloatPanel
        direction={direction}
        htmlRef={panel}
        panelClickHandler={panelClickHandler}
        panelStyles={panelStyles}
      />
    </div>
  );
};
