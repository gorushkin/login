import { useRef, useState, CSSProperties, useLayoutEffect, RefObject, useEffect } from 'react';

const STEP = 50;
const DELAY = 10;

type Direction = 'left' | 'right';

export const useScroll = ({
  login,
  page,
  panel,
}: {
  login: RefObject<HTMLDivElement>;
  panel: RefObject<HTMLDivElement>;
  page: RefObject<HTMLDivElement>;
}) => {
  const isLoaded = useRef(false);
  const isPanelClickBlocked = useRef(false);
  const isPageUpdateBlocked = useRef(false);

  const [panelStyles, setPanelStyles] = useState<CSSProperties>({});
  const [direction, setDirection] = useState<Direction>('left');

  const panelWidth = useRef<number>(0);

  useLayoutEffect(() => {
    if (isLoaded.current) return;
    const loginOffsetWidth = login.current?.offsetWidth;
    const panelOffsetWidth = panel.current?.offsetWidth;
    const pageOffsetWidth = page.current?.offsetWidth;
    const styles: CSSProperties = { right: `0px`, left: 'unset' };
    setPanelStyles(styles);

    if (!panelOffsetWidth || !loginOffsetWidth || !pageOffsetWidth) return;

    panelWidth.current = panelOffsetWidth;
    isLoaded.current = true;
  }, [login, page, panel]);

  const movePanel = (currentPosition: number, currentWidth: number) => {
    if (!page.current) return;
    const pageWidth = page.current.offsetWidth;
    const limitPosition = pageWidth - panelWidth.current;
    const newPosition = currentPosition + STEP;
    const isLimitRightReached = newPosition >= limitPosition;
    const position = isLimitRightReached ? limitPosition : newPosition;

    const newLeftOffset = pageWidth - position - currentWidth;
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
    if (isLimitRightReached) {
      const left = direction === 'left' ? '0px' : 'unset';
      const right = direction === 'right' ? '0px' : 'unset';
      const styles: CSSProperties = { left, right };
      setPanelStyles(styles);
      return;
    }
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

  const panelClickHandler = () => {
    if (!panel.current || isPanelClickBlocked.current) return;
    const { offsetWidth } = panel.current;
    isPanelClickBlocked.current = true;
    isPageUpdateBlocked.current = false;
    const left = direction === 'right' ? '0px' : 'unset';
    const right = direction === 'left' ? '0px' : 'unset';
    const styles: CSSProperties = { left, right };
    setPanelStyles(styles);
    increaseSize(offsetWidth);
  };

  return { panelStyles, panel, panelClickHandler, login, page, direction };
};
