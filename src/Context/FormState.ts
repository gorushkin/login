import { FormValues } from './Form';
import { Bus } from './FormListener';

export class FormState {
  private values: FormValues;
  private bus: Bus;

  constructor(bus: Bus) {
    const listener = bus.add(
      'validate',
      ({ name, isValid }: { name: string; isValid: boolean }) => {
        console.log('name: ', name);
        console.log('isValid: ', isValid);
      }
    );
    listener.start();
    this.values = {};
    this.bus = bus;
  }

  setValues = (obj: FormValues) => {
    const values = Object.entries(obj).map(([name, value]) => ({ name, value }));
    this.values = { ...this.values, ...obj };
    values.forEach(({ value, name }) => this.bus.broadcast({ type: 'update', value, name }));
  };

  getValues = () => this.values;
}
