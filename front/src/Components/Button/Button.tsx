import { FC } from 'react';
import { cn } from '../../utils/utils';
import style from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  className?: string;
  loader?: boolean;
  isLoading?: boolean;
  children: string;
  color?: 'blue' | 'white';
  onClick?: () => void | null;
}

export const Button: FC<ButtonProps> = ({
  className = '',
  disabled = false,
  isLoading = false,
  children,
  color = 'blue',
  onClick = null,
}) => {
  const buttonClassName = cn(
    style.button,
    isLoading && style.buttonIsLoading,
    !!className && className,
    `${style[`button${color}`]}`
  );

  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };

  return (
    <button onClick={handleClick} className={buttonClassName} disabled={disabled} type='submit'>
      {children}
      {isLoading && <div className={style.loader} />}
    </button>
  );
};
