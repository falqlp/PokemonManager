import ReadOnlyRepository from "./ReadOnlyRepository";
import { Model, UpdateQuery } from "mongoose";
import { MongoId } from "./MongoId";
import Populater from "./Populater";

abstract class CompleteRepository<
  T extends MongoId,
> extends ReadOnlyRepository<T> {
  constructor(
    protected schema: Model<T>,
    protected populater: Populater,
  ) {
    super(schema, populater);
  }

  public async update(_id: string, dto: T): Promise<T> {
    try {
      if ("updateAt" in dto) {
        dto.updateAt = Date.now();
      }
      return (await this.schema
        .findByIdAndUpdate(
          _id,
          {
            $set: { ...dto },
          } as unknown as UpdateQuery<T>,
          { new: true },
        )
        .populate(this.populater.populate())) as T;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(dto: T): Promise<T> {
    try {
      if ("createdAt" in dto) {
        dto.createdAt = Date.now();
      }
      return await this.schema.populate(
        await this.schema.create(dto),
        this.populater.populate(),
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async insertMany(dtos: T[]): Promise<T[]> {
    dtos.map((dto: T) => {
      if ("createdAt" in dto) {
        dto.createdAt = Date.now();
      }
      return dto;
    });
    return await this.schema.populate(
      await this.schema.insertMany(dtos),
      this.populater.populate(),
    );
  }

  async delete(_id: string): Promise<T> {
    try {
      return await this.schema.findByIdAndDelete({ _id });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default CompleteRepository;
