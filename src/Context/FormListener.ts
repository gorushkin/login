export type Listeners<T> = Set<T>;
export type Args = { name: string; value: string };
export type ListenerFunction = ({ name, value }: Args) => void;

class Listener {
  name: string;
  cb: ListenerFunction;
  listeners: Listeners<ListenerFunction>;

  constructor(name: string, cb: ListenerFunction, listeners: Listeners<ListenerFunction>) {
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
  private events: Record<string, Listeners<ListenerFunction>>;
  constructor() {
    this.events = {};
  }

  public add = (name: string, cb: ListenerFunction) => {
    if (!this.events[name]) {
      this.events[name] = new Set<ListenerFunction>();
    }
    const listeners = this.events[name];

    const listener = new Listener(name, cb, listeners);
    return { start: () => listener.start(), stop: () => listener.stop() };
  };

  public broadcast = ({ name, value }: Args) => {
    const listeners = this.events[name];

    if (!listeners) return;

    listeners.forEach((listener) => {
      listener({ name, value });
    });
  };
}

export const bus = new Bus();
