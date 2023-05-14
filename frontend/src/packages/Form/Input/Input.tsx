import style from './Input.module.scss';
import { cn, id } from '../../../utils/utils';
import { ChangeEvent, FC, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Rules, useFormContext } from '../Form';
import { ValidateData, ValueArgs, bus } from '../FormListener';
import { DEFAULT_RULES } from '../../../utils/validators';

export interface InputProps {
  type: string;
  name: string;
  className?: string;
  disabled?: boolean;
  rule?: Rules;
  label?: string;
}

export const Input: FC<InputProps> = ({
  name,
  type,
  className = '',
  disabled = false,
  rule = DEFAULT_RULES,
  label = '',
}) => {
  const isMounted = useRef(false);
  const inputWrapper = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isInputValid, setIsInputValid] = useState(true);
  const [isInFocus, setIsInFocus] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updater = useCallback(
    ({ name: updatedPropertyName, value }: ValueArgs) => {
      if (name !== updatedPropertyName || !input.current) return;
      input.current.value = value;
      setIsActive(!!value);
    },
    [name]
  );

  const { onChange, form } = useFormContext();

  const validate = useCallback(
    ({ name: field }: ValidateData) => {
      if (!input.current) return;
      const inputValue = input.current.value;
      if (field !== name && !inputValue) return;
      const value = form.getValues()[name];
      setErrorMessage(value.errorMessage);
      setIsInputValid(value.isValid);
    },
    [form, name]
  );

  const listener = useMemo(() => {
    return {
      update: bus.add('update', id(), updater),
      validate: bus.add('validate', id(), validate),
    };
  }, [updater, validate]);

  useLayoutEffect(() => {
    listener.update.start();
    listener.validate.start();

    return () => {
      listener.update.stop();
      listener.validate.stop();
    };
  }, [listener.update, listener.validate]);

  useLayoutEffect(() => {
    if (input.current) input.current.value = '';
    if (isMounted.current || !name || !rule) return;
    bus.broadcast({ type: 'init', name, rules: rule });
    isMounted.current = true;
  }, [name, rule]);

  const handleInputChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    onChange(name, value);
    const isInputActive = input.current === document.activeElement;
    setIsActive(isInputActive);
  };

  const handleInputBlur = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setIsActive(!!value);
    setIsInFocus(false);
    form.validateFields(name);
  };

  const handleInputFocus = () => {
    setIsActive(true);
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
      {label && (
        <span
          className={cn(
            style.inputLabel,
            isActive && style.inputLabelActive,
            !isInputValid && style.inputLabelInvalid,
            isInFocus && style.inputLabelIsInFocus,
            disabled && style.inputLabelDisabled
          )}
        >
          {label}
        </span>
      )}
      {!!errorMessage && <span className={style.errorMessage}>{errorMessage}</span>}
    </div>
  );
};
