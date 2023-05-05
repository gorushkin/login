import { FormData, FormValidators, FormValues } from './Form';
import { Bus, ValidatorData } from './FormListener';

const DEFAULT_VALIDATOR = () => true;

export class FormState {
  private values: FormData;
  private bus: Bus;
  private validators: FormValidators;

  constructor(bus: Bus) {
    this.validators = {};
    const validate = ({ name, validator }: ValidatorData) => {
      this.validators = { ...this.validators, ...{ [name]: validator } };
    };

    const listener = bus.add('validate', validate);
    listener.start();
    this.values = {} as FormData;
    this.bus = bus;
  }

  isFormValid = (): boolean => {
    console.log(this.getValues());
    const isFormInValid = Object.values(this.values).some((item) => !item.isValid);
    return !isFormInValid;
  };

  setValues = (obj: FormValues) => {
    const values = Object.entries(obj).map(([name, value]) => ({ name, value }));
    const validatedValues = values.map(({ name, value }) => {
      const validator = this.validators[name] || DEFAULT_VALIDATOR;
      const isValid = validator(value);
      return { value, isValid, name };
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
