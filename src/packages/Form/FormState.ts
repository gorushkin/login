import { id } from '../../utils/utils';
import { FormData, FormValidators, FormValues } from './Form';
import { Bus, ValidatorData } from './FormListener';

const DEFAULT_VALIDATOR = () => true;

export class FormState {
  values: FormData;
  private bus: Bus;
  validators: FormValidators;
  private listener: {
    start: () => void;
    stop: () => void;
  };

  constructor(bus: Bus) {
    this.values = {} as FormData;
    this.validators = {};
    this.bus = bus;
    this.listener = {
      start: () => undefined,
      stop: () => undefined,
    };
    this.initForm();
  }

  private validate({ name, validator }: ValidatorData) {
    const value = '';
    const isValid = validator(value);
    const item = { [name]: { isValid, value } };
    this.values = { ...this.values, ...item };
    this.validators = { ...this.validators, ...{ [name]: validator } };
  }

  private initForm = () => {
    this.listener = this.bus.add('validate', id(), this.validate.bind(this));
    this.listener.start();
  };

  destroy = () => {
    this.listener.stop();
  };

  isFormValid = (): boolean => !Object.values(this.values).some((item) => !item.isValid);

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
