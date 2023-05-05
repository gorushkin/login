import style from './Input.module.scss';
import { cn } from '../../utils/utils';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from '../../Context/Form';
import { Args, bus } from '../../Context/FormListener';

export const Input = ({
  name,
  type,
  className = '',
  disabled = false,
  rules = () => true,
}: {
  type: string;
  name: string;
  className?: string;
  disabled?: boolean;
  rules?: (value: string) => boolean;
}) => {
  const inputWrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);

  useEffect(() => {
    // bus.broadcast({ type: 'validate', name, isValid: isInputValid });
  }, [isInputValid, name]);

  const updater = useCallback(
    ({ name: newName, value }: Args) => {
      if (name !== newName || !input.current) return;
      input.current.value = value;
      setIsActive(!!value);
    },
    [name]
  );

  const listener = useMemo(() => bus.add('update', updater), [updater]);

  useLayoutEffect(() => {
    listener.start();
  }, [listener]);

  const { onChange } = useFormContext();

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    onChange(name, value);
    const isInputActive = input.current === document.activeElement;
    setIsActive(isInputActive);
  };

  const handleInputBlur = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const isValid = rules(value);
    setIsInputValid(isValid);
    setIsActive(!!input.current?.value || false);
    bus.broadcast({ type: 'validate', name, isValid });
  };

  const handleInputFocus = () => {
    setIsActive(true);
    setIsInputValid(true);
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
        onFocus={handleInputFocus}
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
