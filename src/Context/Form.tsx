import {
  ReactNode,
  useState,
  createContext,
  FC,
  JSXElementConstructor,
  ReactElement,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { Children, isValidElement } from 'react';

type ContextType = { onChange: (name: string, value: string) => void };

// eslint-disable-next-line @typescript-eslint/no-empty-function
const FormContext = createContext<ContextType>({ onChange: () => {} });

type FromType = {
  className: string;
  children: ReactNode;
};

interface ItemProps extends ReactElement<any, string | JSXElementConstructor<any>> {
  props: { value: string; name: string };
}

export const Form: FC<FromType> = ({ className, children }) => {
  const arrayChildren = Children.toArray(children);

  const formData = arrayChildren
    .filter(
      (item): item is ItemProps =>
        !!(isValidElement(item) && typeof item.type === 'function' && item.type.name === 'Input')
    )
    .map(({ props: { name, value } }) => ({ name, value: value || '' }))
    .reduce((acc, item) => {
      return { ...acc, [item.name]: item.value };
    }, {});

  const [values, setValues] = useState(formData);
  console.log('values: ', values);

  // const filteredChildren = arrayChildren.filter(
  //   (item) =>
  //     !(isValidElement(item) && typeof item.type === 'function' && item.type.name === 'Input')
  // );

  const onChange = useCallback((name: string, value: string) => {
    console.log('name: ', name);
    setValues((state) => ({ ...state, [name]: value }));
  }, []);

  const context = useMemo(
    () => ({
      onChange,
    }),
    [onChange]
  );

  return (
    <FormContext.Provider value={context}>
      <div className={className}>{arrayChildren}</div>
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);

  return context;
};
