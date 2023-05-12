import { FC, useEffect, useState } from 'react';
import style from './Alert.module.scss';

interface AlertProps {
  error: string[];
}

export const Alert: FC<AlertProps> = ({ error }) => {
  const [isVisible, setIsVisible] = useState(!!error.length);

  useEffect(() => {
    setIsVisible(!!error.length);
  }, [error]);

  const clickHandler = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={style.wrapper}>
      <button type='button' onClick={clickHandler} className={style.closeButton}></button>
      <ul className={style.errorList}>
        {error.map((error) => {
          return (
            <li key={error} className={style.errorItem}>
              {error}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
