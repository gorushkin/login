import { Rules } from './Form';
// TODO: replace object with map
export type Listeners<T> = { [x: number]: T };
export type ActionName = 'update' | 'init' | 'validate';
export type ValueArgs = { name: string; value: string };
export type ValidatorArgs = { name: string; rules: Rules };
export type ValueSender = (data: ValueArgs | ValidatorArgs) => void;

export type InitData = {
  name: string;
  rules: Rules;
  type: Extract<ActionName, 'init'>;
};

export type ValidateData = {
  type: Extract<ActionName, 'validate'>;
  name: string;
};

export type ValueData = { name: string; value: string; type: Extract<ActionName, 'update'> };

type BroadCast = ValueData | InitData | ValidateData;

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
