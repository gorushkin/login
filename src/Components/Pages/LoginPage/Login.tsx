import { useRef } from 'react';
import style from './Login.module.scss';
import { useScroll } from '../../../Hooks/useScroll';

export const LoginPage = () => {
  const panel = useRef<HTMLDivElement>(null);
  const login = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const { panelClickHandler: clickPanelHandler, panelStyles, direction } = useScroll({ page, panel, login });

  return (
    <div ref={page} className={style.wrapper}>
      {direction === 'left' && (
        <div ref={login} className={style.login}>
          Login
        </div>
      )}
      {direction === 'right' && (
        <div ref={login} className={style.login}>
          signUp
        </div>
      )}
      {/* <div className={style.panel}>Panel</div> */}
      <div style={panelStyles} ref={panel} onClick={clickPanelHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
