import { useRef } from 'react';
import style from './Layout.module.scss';
import { useScroll } from './useScroll';
import { Form } from '../Components/Form/Form';

export const Layout = () => {
  const panel = useRef<HTMLDivElement>(null);
  const login = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const { panelClickHandler, panelStyles, direction } = useScroll({ page, panel, login });

  return (
    <div ref={page} className={style.wrapper}>
      <div ref={login} className={style.main}>
        {direction === 'left' && <Form/>}
        {direction === 'right' && 'signUp'}
      </div>
      <div style={panelStyles} ref={panel} onClick={panelClickHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
