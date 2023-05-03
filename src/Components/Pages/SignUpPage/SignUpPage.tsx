import { useRef, useState, CSSProperties, FC } from 'react';
import style from './SignUpPage.module.scss';
import { useCallback } from 'react';
import { useLayoutEffect } from 'react';
import { Page } from '../../../Layout/Layout';

const STEP = 50;

export const SignUpPage: FC<Page> = ({ onclick }) => {
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

  const movePanelRight = useCallback(
    (currentLeft: number, currentWidth: number) => {
      const left =
        pageWidth.current <= panelWidth.current + STEP + currentLeft
          ? pageWidth.current - panelWidth.current
          : currentLeft + STEP;

      const width =
        currentWidth + currentLeft + STEP * 3 >= pageWidth.current ? '100%' : `${currentWidth + STEP * 3}px`;

      // const width = `${currentWidth + STEP * 3}px`;

      const { offsetWidth } = panel.current as HTMLDivElement;
      console.log('offsetWidth: ', offsetWidth);

      const styles: CSSProperties = { left: `${left}px` };
      setPanelStyles(styles);
      if (pageWidth.current <= panelWidth.current + STEP + currentLeft) {
        // onclick('login')
        setPanelStyles({ width: '30rem', left: `${left}px`  });
        return;
      }
      // setTimeout(() => {
      //   movePanelLeft(right, offsetWidth);
      // }, 10);
    },
    [onclick]
  );

  const clickPanelHandler = () => {
    if (!panel.current) return;
    const { offsetLeft, offsetWidth } = panel.current;
    const currentLeft = offsetLeft;
    console.log('currentLeft: ', currentLeft);
    movePanelRight(currentLeft, offsetWidth);
  };

  return (
    <div ref={page} className={style.wrapper}>
      <div className={style.panel}>Panel</div>
      <div ref={login} className={style.login}>
        SignUp
      </div>
      <div style={panelStyles} ref={panel} onClick={clickPanelHandler} className={style.floatPanel}>
        Panel
      </div>
    </div>
  );
};
