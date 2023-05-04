import style from './Input.module.scss';
import { cn } from '../../utils/utils';
import { useEffect, useRef, useState } from 'react';

export const Input = ({
  name,
  type,
  className = '',
}: {
  type: string;
  name: string;
  className?: string;
}) => {
  const [isActive, setIsActive] = useState(false);
  const input = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!input) return;

    const handleClick =  (event: MouseEvent) => {
      if (!event.target) return;
      const isClickInsideElement = input.current?.contains(event.target as Node);
      setIsActive(!!isClickInsideElement);
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={input} className={cn(style.inputWrapper, className)}>
      <input className={cn(style.input)} type={type} name={name} />
      <span className={cn(style.inputLabel, isActive && style.inputLabelActive)}>{name}</span>
    </div>
  );
};
