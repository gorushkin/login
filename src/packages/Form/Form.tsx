import { ReactNode, createContext, FC, useContext, useCallback, useMemo, FormEvent } from 'react';
import { bus } from './FormListener';
import { FormState } from './FormState';
import { Input, InputProps } from './Input/Input';

type ContextType = { onChange: (name: string, value: string) => void };

const FormContext = createContext<ContextType>({ onChange: () => undefined });
export type FieldValidator = (value: string) => boolean;

export type FormValues = { [x: string]: string };
export type FormValidators = { [x: string]: FieldValidator };

export type FormData = {
  [x: string]: {
    value: string;
    isValid: boolean;
  };
};

export type FormRefs = { [x: string]: React.RefObject<HTMLInputElement> };

type FormType = {
  className: string;
  children: ReactNode;
  form: FormState;
  onSubmit: (values: FormData) => void;
  onValuesChange?: (values: FormData) => void;
};

interface Form<T> extends FC<T> {
  form: () => FormState;
  Input: ({ name, type, className, disabled, rules }: InputProps) => JSX.Element;
}

const Form: Form<FormType> = ({
  className,
  children,
  form,
  onSubmit = () => undefined,
  onValuesChange = () => undefined,
}) => {
  const onChange = useCallback(
    (name: string, value: string) => {
      form.setValues({ [name]: value });
      const values = form.getValues();
      onValuesChange(values);
    },
    [form, onValuesChange]
  );

  const context = useMemo(
    () => ({
      onChange,
    }),
    [onChange]
  );

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = form.getValues();
    onSubmit(values);
  };

  return (
    <FormContext.Provider value={context}>
      <form onSubmit={handleFormSubmit} className={className}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);

  return context;
};

const form = new FormState(bus);

Form.form = () => form;

Form.Input = Input;

export { Form, FormState };
