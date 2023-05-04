export type Listeners<T> = Set<T>;
type ActionName = 'update' | 'validate';
export type Args = { name: string; value: string };
export type ListenerFunction = ({ name, value }: Args) => void;

type BroadCast =
  | { name: string; value: string; type: ActionName }
  | { name: string; isValid: boolean; type: ActionName };

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

  public add = <T>(name: ActionName, cb: T) => {
    console.log('name: ', name);
    if (!this.events[name]) {
      this.events[name] = new Set<T>();
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
