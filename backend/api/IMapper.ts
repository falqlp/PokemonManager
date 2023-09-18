export interface IMapper<T> {
  map: (entity: T, partyId?: string) => Promise<T> | T;
  update: (entity: T) => Promise<T> | T;
  mapPartial?: (entity: T) => Promise<T> | T;
  mapComplete?: (entity: T) => Promise<T> | T;
}
