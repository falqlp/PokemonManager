import { PopulateOptions } from "mongoose";

export interface IMapper<T> {
  populate: () => PopulateOptions | PopulateOptions[];
  map: (entity: T, gameId?: string) => Promise<T> | T;
  update: (entity: T) => Promise<T> | T;
  mapPartial?: (entity: T) => Promise<T> | T;
  mapComplete?: (entity: T) => Promise<T> | T;
}
