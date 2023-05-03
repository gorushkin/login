import { useRef, useState, CSSProperties } from 'react';
import style from './App.module.scss';
import { Login } from './Components/Login/Login';
import { SignUp } from './Components/SignUp/SignUp';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useLayoutEffect } from 'react';

const STEP = 50;

export const App = () => {
  const panel = useRef<HTMLDivElement>(null);
  const login = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const pageWidth = useRef<number>(0);
  const panelWidth = useRef<number>(0);

  useLayoutEffect(() => {
    const loginOffsetWidth = login.current?.offsetWidth;
    const panelOffsetWidth = panel.current?.offsetWidth;
    const pageOffsetWidth = page.current?.offsetWidth;

    if (!panelOffsetWidth || !loginOffsetWidth || !pageOffsetWidth) return;

    panelWidth.current = panelOffsetWidth;
    pageWidth.current = pageOffsetWidth;
  }, []);

  const [panelStyles, setPanelStyles] = useState<CSSProperties>({});

  const movePanelLeft = useCallback((currentRight: number, currentWidth: number) => {
    const right =
      pageWidth.current - currentRight <= panelWidth.current + STEP
        ? pageWidth.current - panelWidth.current
        : currentRight + STEP;

    const width =
      currentWidth + currentRight >= pageWidth.current ? '100%' : `${currentWidth + STEP * 3}px`;

    const { offsetWidth } = panel.current as HTMLDivElement;

    const styles: CSSProperties = { right: `${right}px`, width };
    setPanelStyles(styles);
    if (pageWidth.current - currentRight <= panelWidth.current + STEP) return;
    setTimeout(() => {
      movePanelLeft(right, offsetWidth);
    }, 10);
  }, []);

  const clickPanelHandler = () => {
    if (!panel.current) return;
    const { offsetLeft, offsetWidth } = panel.current;
    const currentRight = pageWidth.current - panelWidth.current - offsetLeft;
    movePanelLeft(currentRight, offsetWidth);
  };

  return (
    <div ref={page} className={style.wrapper}>
      <div ref={login} className={style.login}>
        Login
      </div>
      <div className={style.panel}>Panel</div>
      <div style={panelStyles} ref={panel} onClick={clickPanelHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
