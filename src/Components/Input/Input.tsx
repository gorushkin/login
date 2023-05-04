import style from './Input.module.scss';
import { cn } from '../../utils/utils';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useFormContext } from '../../Context/Form';

export const Input = ({
  name,
  type,
  className = '',
  disabled = false,
  invalid = false,
  value = '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  htmlRef = null,
  rules = () => true,
}: {
  type: string;
  name: string;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  value?: string;
  htmlRef?: React.RefObject<HTMLInputElement> | null;
  rules?: (value: string) => boolean;
}) => {
  const inputWrapper = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  const { onChange } = useFormContext();

  const input = htmlRef || ref;

  const [isActive, setIsActive] = useState(!!value);
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    onChange(name, value);
    // setIsInputValid(rules(value));
  };

  useEffect(() => {
    if (!inputWrapper) return;

    if (!!value && input.current) input.current.value = value;

    const handleClick = () => {
      const { activeElement } = document;
      const isInputActive = inputWrapper.current?.contains(activeElement);
      setIsActive(!!input.current?.value || !!isInputActive);
      if (isInputActive) setIsInputValid(true);
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
  }, [input, value]);

  const handleInputBlur = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setIsInputValid(rules(value));
  };

  return (
    <div ref={inputWrapper} className={cn(style.inputWrapper, className)}>
      <input
        onChange={handleInputChange}
        disabled={disabled}
        className={cn(
          style.input,
          disabled && style.inputDisabled,
          !isInputValid && style.inputInvalid
        )}
        type={type}
        name={name}
        ref={input}
        onBlur={handleInputBlur}
      />
      <span
        className={cn(
          style.inputLabel,
          isActive && style.inputLabelActive,
          !isInputValid && style.inputLabelInvalid,
          disabled && style.inputLabelDisabled
        )}
      >
        {name}
      </span>
    </div>
  );
};
