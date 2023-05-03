import { useRef, useState, CSSProperties } from 'react';
import style from './Login.module.scss';
import { useLayoutEffect } from 'react';

const STEP = 50;
const DELAY = 10;
type Direction = 'left' | 'right';

export const LoginPage = () => {
  const [panelStyles, setPanelStyles] = useState<CSSProperties>({});
  const [direction, setDirection] = useState<Direction>('left');
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
    const styles: CSSProperties = { right: `0px`, left: 'unset' };
    setPanelStyles(styles);

    if (!panelOffsetWidth || !loginOffsetWidth || !pageOffsetWidth) return;

    panelWidth.current = panelOffsetWidth;
    pageWidth.current = pageOffsetWidth;
  }, []);

  const movePanel = (currentPosition: number, currentWidth: number) => {
    const limitPosition = pageWidth.current - panelWidth.current;
    const newPosition = currentPosition + STEP;
    const isLimitRightReached = newPosition >= limitPosition;
    const position = isLimitRightReached ? limitPosition : newPosition;

    const newLeftOffset = pageWidth.current - position - currentWidth;
    const maxWidth =
      newLeftOffset <= 0
        ? Math.max(currentWidth + newLeftOffset, panelWidth.current)
        : currentWidth;

    const isPanelInTheMiddle = newLeftOffset <= position;

    if (isPanelInTheMiddle && !isPageUpdateBlocked.current) {
      setDirection((state) => (state === 'left' ? 'right' : 'left'));
      isPanelClickBlocked.current = false;
      isPageUpdateBlocked.current = true;
    }

    const right = direction === 'left' ? `${position}px` : 'unset';
    const left = direction === 'right' ? `${position}px` : 'unset';

    const styles: CSSProperties = { right, left, maxWidth: `${maxWidth}px` };
    setPanelStyles(styles);
    if (isLimitRightReached) return;
    setTimeout(() => {
      movePanel(position, maxWidth);
    }, DELAY);
  };

  const increaseSize = (currentWidth: number) => {
    const limitWidth = panelWidth.current * 2;
    const newWidth = currentWidth + 50;
    const isLimitReached = newWidth >= limitWidth;
    const width = isLimitReached ? limitWidth : newWidth;
    const left = direction === 'right' ? '0px' : 'unset';
    const right = direction === 'left' ? '0px' : 'unset';
    const styles: CSSProperties = { maxWidth: `${width}px`, left, right };
    setPanelStyles(styles);
    if (isLimitReached) {
      movePanel(0, newWidth);
      return;
    }
    setTimeout(() => {
      increaseSize(width);
    }, DELAY);
  };

  const clickPanelHandler = () => {
    if (!panel.current || isPanelClickBlocked.current) return;
    const { offsetWidth } = panel.current;
    isPanelClickBlocked.current = true;
    isPageUpdateBlocked.current = false;
    console.log(direction);
    const left = direction === 'right' ? '0px' : 'unset';
    const right = direction === 'left' ? '0px' : 'unset';
    const styles: CSSProperties = { left, right };
    setPanelStyles(styles);
    increaseSize(offsetWidth);
  };

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
