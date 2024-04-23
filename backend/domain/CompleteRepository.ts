import ReadOnlyRepository from "./ReadOnlyRepository";
import { Model, UpdateQuery } from "mongoose";
import { IMapper } from "./IMapper";
import { MongoId } from "./MongoId";

abstract class CompleteRepository<
  T extends MongoId,
> extends ReadOnlyRepository<T> {
  constructor(
    protected schema: Model<T>,
    protected mapper: IMapper<T>,
  ) {
    super(schema, mapper);
  }

  async update(_id: string, dto: T): Promise<T> {
    try {
      if ("updateAt" in dto) {
        dto.updateAt = Date.now();
      }
      const updatedDoc = (await this.schema
        .findByIdAndUpdate(
          _id,
          {
            $set: { ...(await this.mapper.update(dto)) },
          } as unknown as UpdateQuery<T>,
          { new: true },
        )
        .populate(this.mapper.populate())) as T;
      return this.mapper.map(updatedDoc);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(dto: T, gameId: string): Promise<T> {
    try {
      const updatedDto = await this.mapper.update({ ...dto, gameId });
      if ("createdAt" in updatedDto) {
        updatedDto.createdAt = Date.now();
      }
      return this.mapper.map(
        (await this.schema.populate(
          await this.schema.create(updatedDto),
          this.mapper.populate(),
        )) as T,
      );
    } catch (error) {
      return Promise.reject(error);
    }
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
