import { ReactNode, createContext, FC, useContext, useCallback, useMemo, FormEvent } from 'react';
import { bus } from './FormListener';
import { FormState } from './FormState';

type ContextType = { onChange: (name: string, value: string) => void };

// eslint-disable-next-line @typescript-eslint/no-empty-function
const FormContext = createContext<ContextType>({ onChange: () => {} });

export type FormValues = { [x: string]: string };
export type FormRefs = { [x: string]: React.RefObject<HTMLInputElement> };

type FormType = {
  className: string;
  children: ReactNode;
  form: FormState;
  onSubmit: (values: FormValues) => void;
};

interface Form<T> extends FC<T> {
  form: () => FormState;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Form: Form<FormType> = ({ className, children, form, onSubmit = () => {} }) => {
  const onChange = useCallback(
    (name: string, value: string) => {
      form.setValues({ [name]: value });
    },
    [form]
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

export { Form };
