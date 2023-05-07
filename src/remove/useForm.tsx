import {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useMemo,
  FC,
  ReactNode,
  useContext,
  FormEvent,
} from 'react';
import {
  Form,
  Qwe,
  FormData,
  useFormContext,
  FormContext,
  FormState,
  useUserForm,
} from '../packages/Form/Form';

type UseForm = (props: {
  values?: { [x: string]: string };
  className?: string;
  buttonTitle: string;
}) => {
  FormWrapper: FC<{
    children: ReactNode;
  }>;
  form: FormState;
};
export const useForm: UseForm = ({ buttonTitle, className = '', values = {} }) => {
  const [isFormValid, setIsFormValid] = useState(true);

  const form = useUserForm();





  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log('submit');
      const values = form.getValues();
      console.log('values: ', values);
      // onSubmit(values);
    },
    [form]
  );

  const FormWrapper = useMemo(() => {
    const Component: FC<{ children: ReactNode }> = ({ children }) => (
      <>
        {children}
        <button disabled={!isFormValid} type='submit'>
          {buttonTitle}
        </button>
      </>
    );

    return Component;
  }, [buttonTitle, isFormValid]);

  return { FormWrapper, form };
};
