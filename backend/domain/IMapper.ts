export interface IMapper<T> {
  map: (entity: T, gameId?: string) => T;
}
