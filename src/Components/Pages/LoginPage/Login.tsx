import { useRef, useState, CSSProperties, FC } from 'react';
import style from './Login.module.scss';
import { useLayoutEffect } from 'react';

const STEP = 50;
const DELAY = 10;
type Mode = 'login' | 'signUp';

export const LoginPage: FC = () => {
  const [panelStyles, setPanelStyles] = useState<CSSProperties>({});
  const [currentWindow, setCurrentWindow] = useState<Mode>('login');
  const panel = useRef<HTMLDivElement>(null);
  const login = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const pageWidth = useRef<number>(0);
  const panelWidth = useRef<number>(0);

  const isPanelClickBlocked = useRef(false);
  const isPageUpdateBlocked = useRef(false);

  useLayoutEffect(() => {
    const loginOffsetWidth = login.current?.offsetWidth;
    const panelOffsetWidth = panel.current?.offsetWidth;
    const pageOffsetWidth = page.current?.offsetWidth;

    if (!panelOffsetWidth || !loginOffsetWidth || !pageOffsetWidth) return;

    panelWidth.current = panelOffsetWidth;
    pageWidth.current = pageOffsetWidth;
  }, []);

  const movePanel = (currentRight: number, currentWidth: number) => {
    const limitRight = pageWidth.current - panelWidth.current;
    const newRight = currentRight + STEP;
    const isLimitRightReached = currentRight >= limitRight;
    const right = isLimitRightReached ? limitRight : newRight;

    const newLeftOffset = pageWidth.current - right - currentWidth;
    const maxWidth =
      newLeftOffset <= 0
        ? Math.max(currentWidth + newLeftOffset, panelWidth.current)
        : currentWidth;

    const isPanelInTheMiddle = newLeftOffset <= right;

    if (isPanelInTheMiddle && !isPageUpdateBlocked.current) {
      setCurrentWindow('signUp');
      // isPageUpdateBlocked.current = true;
    }

    const styles: CSSProperties = { right: `${right}px`, maxWidth: `${maxWidth}px` };
    setPanelStyles(styles);
    if (isLimitRightReached) return;
    setTimeout(() => {
      movePanel(right, maxWidth);
    }, DELAY);
  };

  const increaseWidth = (currentWidth: number) => {
    const limitWidth = panelWidth.current * 2;
    const newWidth = currentWidth + 50;
    const isLimitReached = newWidth >= limitWidth;
    const width = isLimitReached ? limitWidth : newWidth;
    const styles: CSSProperties = { maxWidth: `${width}px` };
    setPanelStyles(styles);
    if (isLimitReached) {
      const { offsetLeft } = panel.current as HTMLDivElement;
      const currentRight = pageWidth.current - newWidth - offsetLeft;
      movePanel(currentRight, newWidth);
      return;
    }
    setTimeout(() => {
      increaseWidth(width);
    }, DELAY);
  };

  const clickPanelHandler = () => {
    if (!panel.current || isPanelClickBlocked.current) return;
    const { offsetWidth } = panel.current;
    isPanelClickBlocked.current = true;
    increaseWidth(offsetWidth);
  };

  return (
    <div ref={page} className={style.wrapper}>
      {currentWindow === 'login' && (
        <div ref={login} className={style.login}>
          Login
        </div>
      )}
      {currentWindow === 'signUp' && (
        <div ref={login} className={style.login}>
          signUp
        </div>
      )}
      <div className={style.panel}>Panel</div>
      <div style={panelStyles} ref={panel} onClick={clickPanelHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
