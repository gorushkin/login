import { FieldValidator } from './Form';
// TODO: replace object with map
export type Listeners<T> = { [x: number]: T };
export type ActionName = 'update' | 'validate' | 'init';
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
  id: number;
  cb: T;
  listeners: Listeners<T>;

  constructor(name: string, id: number, cb: T, listeners: Listeners<T>) {
    this.name = name;
    this.cb = cb;
    this.id = id;
    this.listeners = listeners;
  }

  start = () => {
    this.listeners[this.id] = this.cb;
  };

  stop = () => {
    delete this.listeners[this.id];
  };
}

export class Bus {
  private events: Record<string, Listeners<any>>;
  constructor() {
    this.events = {};
  }

  public add = <ValueSender>(actionName: ActionName, id: number, cb: ValueSender) => {
    if (!this.events[actionName]) {
      this.events[actionName] = {};
    }
    const listeners = this.events[actionName];

    const listener = new Listener(actionName, id, cb, listeners);
    return listener;
  };

  public broadcast = (data: BroadCast) => {
    const listeners = this.events[data.type];
    if (!listeners) return;

    Object.values(listeners).forEach((listener) => {
      listener(data);
    });
  };
}

export const bus = new Bus();
