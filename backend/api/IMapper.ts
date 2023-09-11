export interface IMapper<T> {
  map: (entity: T) => Promise<T> | T;
  update: (entity: T) => Promise<T> | T;
  mapPartial?: (entity: T) => Promise<T> | T;
}
