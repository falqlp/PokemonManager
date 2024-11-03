import { Model, PopulateOptions } from 'mongoose';
import { MongoId } from './MongoId';

export default abstract class Populater<T extends MongoId> {
  public abstract populate(): PopulateOptions | PopulateOptions[];
  public abstract schema: Model<T>;
}
