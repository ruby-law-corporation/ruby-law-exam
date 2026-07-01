export interface Store<T> {
  get(id: string): Promise<T | null>;
  set(id: string, value: T): Promise<T>;
}

export class InMemoryStore<T> implements Store<T> {
  private readonly items = new Map<string, T>();

  async get(id: string): Promise<T | null> {
    return this.items.get(id) ?? null;
  }

  async set(id: string, value: T): Promise<T> {
    this.items.set(id, value);
    return value;
  }
}
