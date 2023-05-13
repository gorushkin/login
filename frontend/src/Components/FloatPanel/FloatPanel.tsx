import { FC, LegacyRef } from 'react';
import style from './FloatPanel.module.scss';
import { Direction } from '../../Hooks/useScroll';
import { Button } from '../Button/Button';

interface FloatPanelProps {
  panelStyles: React.CSSProperties;
  panelClickHandler: () => void;
  htmlRef: LegacyRef<HTMLDivElement> | undefined;
  direction: Direction;
}

type Content = {
  title: string;
  button: string;
};

const mapping: Record<Direction, Content> = {
  left: { title: 'Do not have an account?', button: 'SignUp' },
  right: { button: 'Login', title: 'Already have account?' },
};

export const FloatPanel: FC<FloatPanelProps> = ({
  direction,
  panelClickHandler,
  panelStyles,
  htmlRef,
}) => {
  const content = mapping[direction];

  return (
    <div style={panelStyles} ref={htmlRef} className={style.floatPanel}>
      <span className={style.title}>{content.title}</span>
      <Button onClick={panelClickHandler} color='white'>
        {content.button}
      </Button>
    </div>
  );
};
