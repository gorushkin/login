import {
  ReactNode,
  createContext,
  FC,
  useContext,
  useCallback,
  useMemo,
  FormEvent,
  useEffect,
} from 'react';
import { bus } from './FormListener';
import { FormState } from './FormState';
import { Input, InputProps } from './Input/Input';

type ContextType = { onChange: (name: string, value: string) => void; form: FormState };

export const FormContext = createContext<ContextType | null>(null);
export type FieldValidator = (value: string, values: FormValues) => boolean;

export type FormRawValues = { [x: string]: string };
export type FormValidators = { [x: string]: FieldValidator };

export type FormValues = {
  [x: string]: {
    value: string;
    isValid: boolean;
  };
};

type FormType = {
  children: ReactNode;
  className?: string;
  form: FormState;
  onValuesChange: (values: FormValues) => void;
  onSubmit: (values: FormValues) => void;
};

interface Form<T> extends FC<T> {
  Input: ({ name, type, className, disabled, rules }: InputProps) => JSX.Element;
  useForm: () => FormState;
}

const Form: Form<FormType> = ({ children, form, onValuesChange, onSubmit, className = '' }) => {
  const onChange = useCallback(
    (name: string, value: string) => {
      form.setValues({ [name]: value });
      const values = form.getValues();
      onValuesChange(values);
    },
    [form, onValuesChange]
  );

  const context = useMemo(() => ({ form, onChange }), [onChange, form]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = form.getValues();
    onSubmit(values);
  };

  return (
    <FormContext.Provider value={context}>
      <form className={className} onSubmit={handleFormSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

const useFormState = () => {
  const form = useMemo(() => {
    return new FormState(bus);
  }, []);

  useEffect(() => {
    return () => form.destroy();
  }, [form]);

  return form;
};

export const useFormContext = (): ContextType => {
  const context = useContext(FormContext);

  if (!context) throw new Error('There is an error');

  return context;
};

export const useForm = () => {
  const form = useFormState();

  if (!form) throw new Error('There is an error');

  return form;
};

Form.Input = Input;
Form.useForm = useForm;

export { Form, FormState };
