import { FormValues, Rule, Rules } from '../packages/Form/Form';

export const simpleRule: Rules = [
  {
    rule: (value: string) => !!value,
    message: 'This field is required',
  },
];

export const confirmPasswordRule: Rules = [
  {
    rule: (value: string) => !!value,
    message: 'This field is required',
  },
  {
    rule: (value: string, values: FormValues) => {
      const password = values?.password?.value;
      return value === password;
    },
    message: 'Confirm password should be the same as the password',
  },
];

export const DEFAULT_RULES: Rule[] = [{ message: '', rule: () => true }];
