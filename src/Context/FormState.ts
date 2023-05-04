import { FormValues } from './Form';
import { Bus, bus } from './FormListener';


export class FormState {
  private values: FormValues;
  private bus: Bus;

  constructor(bus: Bus) {
    this.values = {};
    this.bus = bus;
  }

  setValues(obj: FormValues) {
    const values = Object.entries(obj).map(([name, value]) => ({ name, value }));
    this.values = { ...this.values, ...obj };
    values.forEach(bus.broadcast);
  }

  getValues() {
    return this.values;
  }
}
