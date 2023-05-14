import { id } from '../../utils/utils';
import { FormValues, FormRawValues, Rules } from './Form';
import { Bus, InitData } from './FormListener';

const DEFAULT_VALIDATOR = () => true;

export class FormState {
  values: FormValues;
  private bus: Bus;
  validators: { [x: string]: Rules };
  private listener: {
    start: () => void;
    stop: () => void;
  };

  constructor(bus: Bus) {
    this.values = {} as FormValues;
    this.validators = {};
    this.bus = bus;
    this.listener = {
      start: () => undefined,
      stop: () => undefined,
    };
    this.initForm();
  }

  private validateValue = (
    value: string,
    rules: Rules
  ): { isValid: boolean; errorMessage: string } => {
    const fieldErrors = rules
      .map(({ message, rule }) => {
        const isValid = rule(value, this.values);
        return isValid ? '' : message;
      })
      .filter((error) => !!error);

    const errorMessage = fieldErrors?.[0] || '';
    return { isValid: !errorMessage, errorMessage };
  };

  private addFieldRule({ name, rules }: InitData) {
    const value = '';
    const { errorMessage, isValid } = this.validateValue(value, rules);
    const item: FormValues = { [name]: { isValid, value, errorMessage } };
    this.values = { ...this.values, ...item };
    this.validators = { ...this.validators, ...{ [name]: rules } };
  }

  private initForm = () => {
    this.listener = this.bus.add('init', id(), this.addFieldRule.bind(this));
    this.listener.start();
  };

  destroy = () => {
    this.listener.stop();
  };

  private validateForm = () => {
    const values = Object.entries(this.values).map(([name, field]) => ({ name, field }));

    const validatedValues = values.map(({ name, field }) => {
      const rule = this.validators[name] || DEFAULT_VALIDATOR;
      const value = field.value;
      const { errorMessage, isValid } = this.validateValue(value, rule);
      return { value, isValid, name, errorMessage };
    });

    const validatedValuesObj = validatedValues.reduce(
      (acc, { name, value, isValid, errorMessage }) => {
        return { ...acc, [name]: { value, isValid, errorMessage } } as FormValues;
      },
      {} as FormValues
    );

    this.values = { ...this.values, ...validatedValuesObj };
  };

  isFormValid = (): boolean => {
    return !Object.values(this.values).some((item) => !item.isValid);
  };

  validateFields = (name: string) => {
    this.validateForm();
    this.bus.broadcast({ type: 'validate', name });
  };

  setValues = (obj: FormRawValues) => {
    const values = Object.entries(obj).map(([name, value]) => ({ name, value }));

    const validatedValues = values.map(({ name, value }) => {
      const rule = this.validators[name] || DEFAULT_VALIDATOR;
      const { errorMessage, isValid } = this.validateValue(value, rule);
      return { value, isValid, name, errorMessage };
    });

    validatedValues.forEach(({ name, value }) => {
      this.bus.broadcast({ type: 'update', name, value });
    });

    const validatedValuesObj = validatedValues.reduce(
      (acc, { name, value, isValid, errorMessage }) => {
        return { ...acc, [name]: { value, isValid, errorMessage } } as FormValues;
      },
      {} as FormValues
    );
    this.values = { ...this.values, ...validatedValuesObj };
  };

  getValues = () => this.values;
}
