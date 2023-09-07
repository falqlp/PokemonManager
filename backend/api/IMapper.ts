export interface IMapper<T> {
  map: (entity: T) => Promise<T> | T;
  update: (entity: T) => T;
}
