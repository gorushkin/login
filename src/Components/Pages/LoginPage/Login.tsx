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
    const styles: CSSProperties = { right: `0px`, left: 'unset'  };
    setPanelStyles(styles);

    if (!panelOffsetWidth || !loginOffsetWidth || !pageOffsetWidth) return;

    panelWidth.current = panelOffsetWidth;
    pageWidth.current = pageOffsetWidth;
  }, []);

  const movePanelToRight = (currentLeft: number, currentWidth: number) => {
    const limitLeft = pageWidth.current - panelWidth.current;
    console.log('limitLeft: ', limitLeft);
    const newLeft = currentLeft + STEP;
    const isLimitLeftReached = newLeft >= limitLeft;
    const left = isLimitLeftReached ? limitLeft : newLeft;
    console.log('left: ', left);

    const newLeftOffset = pageWidth.current - left - currentWidth;

    if (newLeftOffset < 50) {
      // debugger;
    }

    const maxWidth =
      newLeftOffset <= 0
        ? Math.max(currentWidth + newLeftOffset, panelWidth.current)
        : currentWidth;

    const isPanelInTheMiddle = newLeftOffset <= left;

    if (isPanelInTheMiddle && !isPageUpdateBlocked.current) {
      setCurrentWindow('login');
      isPanelClickBlocked.current = false;
    }

    const styles: CSSProperties = { left: `${left}px`, maxWidth: `${maxWidth}px` };
    setPanelStyles(styles);
    if (isLimitLeftReached) return;
    setTimeout(() => {
      movePanelToRight(left, maxWidth);
    }, DELAY);
  };

  const toRight = (currentWidth: number) => {
    const limitWidth = panelWidth.current * 2;
    const newWidth = currentWidth + 50;
    const isLimitReached = newWidth >= limitWidth;
    const width = isLimitReached ? limitWidth : newWidth;
    const styles: CSSProperties = { maxWidth: `${width}px`, left: '0px' };
    setPanelStyles(styles);
    if (isLimitReached) return movePanelToRight(0, newWidth);
    setTimeout(() => {
      toRight(width);
    }, DELAY);
  };

  const movePanelToLeft = (currentRight: number, currentWidth: number) => {
    const limitRight = pageWidth.current - panelWidth.current;
    const newRight = currentRight + STEP;
    const isLimitRightReached = newRight >= limitRight;
    const right = isLimitRightReached ? limitRight : newRight;

    const newLeftOffset = pageWidth.current - right - currentWidth;
    const maxWidth =
      newLeftOffset <= 0
        ? Math.max(currentWidth + newLeftOffset, panelWidth.current)
        : currentWidth;

    const isPanelInTheMiddle = newLeftOffset <= right;

    if (isPanelInTheMiddle && !isPageUpdateBlocked.current) {
      setCurrentWindow('signUp');
      isPanelClickBlocked.current = false;
      // isPageUpdateBlocked.current = true;
    }

    const styles: CSSProperties = { right: `${right}px`, maxWidth: `${maxWidth}px` };
    setPanelStyles(styles);
    if (isLimitRightReached) return;
    setTimeout(() => {
      movePanelToLeft(right, maxWidth);
    }, DELAY);
  };

  const toLeft = (currentWidth: number) => {
    const limitWidth = panelWidth.current * 2;
    const newWidth = currentWidth + 50;
    const isLimitReached = newWidth >= limitWidth;
    const width = isLimitReached ? limitWidth : newWidth;
    const styles: CSSProperties = { maxWidth: `${width}px`, right: '0px' };
    setPanelStyles(styles);
    if (isLimitReached) {
      const { offsetLeft } = panel.current as HTMLDivElement;
      const currentRight = pageWidth.current - newWidth - offsetLeft;
      movePanelToLeft(currentRight, newWidth);
      return;
    }
    setTimeout(() => {
      toLeft(width);
    }, DELAY);
  };

  const clickPanelHandler = () => {
    if (!panel.current || isPanelClickBlocked.current) return;
    const { offsetWidth } = panel.current;
    isPanelClickBlocked.current = true;
    if (currentWindow === 'login') toLeft(offsetWidth);
    if (currentWindow === 'signUp') {
      const styles: CSSProperties = { left: `0px`, right: 'unset' };
      setPanelStyles(styles);
      toRight(offsetWidth);
    }
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
      {/* <div className={style.panel}>Panel</div> */}
      <div style={panelStyles} ref={panel} onClick={clickPanelHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
