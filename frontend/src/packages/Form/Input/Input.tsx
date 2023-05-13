import style from './Input.module.scss';
import { cn, id } from '../../../utils/utils';
import { ChangeEvent, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from '../Form';
import { ValueArgs, bus } from '../FormListener';
import { FormValues } from '../Form';

export interface InputProps {
  type: string;
  name: string;
  className?: string;
  disabled?: boolean;
  rules?: (value: string, values: FormValues) => boolean;
}

export const Input = ({
  name,
  type,
  className = '',
  disabled = false,
  rules = () => true,
}: InputProps) => {
  const isMounted = useRef(false);
  const inputWrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  const [isInFocus, setIsInFocus] = useState(false);

  const updater = useCallback(
    ({ name: updatedPropertyName, value }: ValueArgs) => {
      if (name !== updatedPropertyName || !input.current) return;
      input.current.value = value;
      setIsActive(!!value);
    },
    [name]
  );

  const listener = useMemo(() => {
    return bus.add('update', id(), updater);
  }, [updater]);

  useLayoutEffect(() => {
    listener.start();

    return () => listener.stop();
  }, [listener]);

  useLayoutEffect(() => {
    if (input.current) input.current.value = '';
    if (isMounted.current || !name || !rules) return;
    bus.broadcast({ type: 'validate', name, validator: rules });
    isMounted.current = true;
  }, [name, rules]);

  const { onChange, form } = useFormContext();

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    onChange(name, value);
    const isInputActive = input.current === document.activeElement;
    setIsActive(isInputActive);
  };

  const handleInputBlur = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    const values = form.getValues();
    const isValid = rules(value, values);
    setIsInputValid(isValid);
    setIsActive(!!input.current?.value || false);
    setIsInFocus(false);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    setIsInputValid(true);
    setIsInFocus(true);
  };

  return (
    <div ref={inputWrapper} className={cn(style.inputWrapper, className)}>
      <input
        onChange={handleInputChange}
        disabled={disabled}
        className={cn(
          style.input,
          disabled && style.inputDisabled,
          isInFocus && style.inputIsInFocus,
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
          isInFocus && style.inputLabelIsInFocus,
          disabled && style.inputLabelDisabled
        )}
      >
        {name}
      </span>
    </div>
  );
};
