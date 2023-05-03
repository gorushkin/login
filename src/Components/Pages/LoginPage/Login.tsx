import { useRef, useState, CSSProperties, FC } from 'react';
import style from './Login.module.scss';
import { useLayoutEffect } from 'react';
import { Page } from '../../../Layout/Layout';

const STEP = 50;
const DELAY = 10;

export const LoginPage: FC<Page> = ({ onclick }) => {
  const [panelStyles, setPanelStyles] = useState<CSSProperties>({});

  const panel = useRef<HTMLDivElement>(null);
  const login = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);

  const pageWidth = useRef<number>(0);
  const panelWidth = useRef<number>(0);

  const isPanelBlocked = useRef(false);

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
    if (!panel.current || isPanelBlocked.current) return;
    const { offsetWidth } = panel.current;
    isPanelBlocked.current = true;
    increaseWidth(offsetWidth);
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
