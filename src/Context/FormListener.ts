import { FieldValidator } from './Form';

export type Listeners<T> = Set<T>;
type ActionName = 'update' | 'validate' | 'init';
export type ValueArgs = { name: string; value: string };
export type ValidatorArgs = { name: string; validator: FieldValidator };
export type ValueSender = (data: ValueArgs | ValidatorArgs) => void;

export type ValidatorData = {
  name: string;
  validator: FieldValidator;
  type: ActionName;
};

export type ValueData = { name: string; value: string; type: ActionName };

type BroadCast = ValueData | ValidatorData;

class Listener<T> {
  name: string;
  cb: T;
  listeners: Listeners<T>;

  constructor(name: string, cb: T, listeners: Listeners<T>) {
    this.name = name;
    this.cb = cb;
    this.listeners = listeners;
  }

  start() {
    this.listeners.add(this.cb);
  }

  stop() {
    this.listeners.delete(this.cb);
  }
}

export class Bus {
  private events: Record<string, Listeners<any>>;
  constructor() {
    this.events = {};
  }

  public add = <ValueSender>(name: ActionName, cb: ValueSender) => {
    if (!this.events[name]) {
      this.events[name] = new Set<ValueSender>();
    }
    const listeners = this.events[name];

    const listener = new Listener(name, cb, listeners);
    return { start: () => listener.start(), stop: () => listener.stop() };
  };

  public broadcast = (data: BroadCast) => {
    const listeners = this.events[data.type];

    if (!listeners) return;

    listeners.forEach((listener) => {
      listener(data);
    });
  };
}

export const bus = new Bus();
