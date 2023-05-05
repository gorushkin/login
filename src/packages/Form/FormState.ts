import { FormData, FormValidators, FormValues } from './Form';
import { Bus, ValidatorData } from './FormListener';

const DEFAULT_VALIDATOR = () => true;

export class FormState {
  private values: FormData;
  private bus: Bus;
  private validators: FormValidators;

  constructor(bus: Bus) {
    this.validators = {};
    this.bus = bus;
    this.initForm();
    this.values = {} as FormData;
  }

  private initForm = () => {
    const validate = ({ name, validator }: ValidatorData) => {
      const value = '';
      const isValid = validator(value);
      const item = { [name]: { isValid, value } };
      this.values = { ...this.values, ...item };
      this.validators = { ...this.validators, ...{ [name]: validator } };
    };

    const listener = this.bus.add('validate', validate);
    listener.start();
  };

  isFormValid = (): boolean => {
    const isFormInValid = Object.values(this.values).some((item) => !item.isValid);
    return !isFormInValid;
  };

  setValues = (obj: FormValues) => {
    const values = Object.entries(obj).map(([name, value]) => ({ name, value }));
    const validatedValues = values.map(({ name, value }) => {
      const validator = this.validators[name] || DEFAULT_VALIDATOR;
      const isValid = validator(value);
      return { value, isValid: true, name };
    });

    validatedValues.forEach(({ name, value }) => {
      this.bus.broadcast({ type: 'update', name, value });
    });

    const validatedValuesObj = validatedValues.reduce((acc, { name, value, isValid }) => {
      return { ...acc, [name]: { value, isValid } };
    }, {} as FormData);
    this.values = { ...this.values, ...validatedValuesObj };
  };

  getValues = () => this.values;
}
