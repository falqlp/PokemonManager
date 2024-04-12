import ReadOnlyService from "./ReadOnlyService";
import { Document, Model, PopulateOptions, UpdateQuery } from "mongoose";
import { IMapper } from "./IMapper";
import { IEntity } from "./Entity";

abstract class CompleteService<T extends Document> extends ReadOnlyService<T> {
  constructor(protected schema: Model<T>, protected mapper: IMapper<T>) {
    super(schema, mapper);
  }

  async update(_id: string, dto: T) {
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
          { new: true }
        )
        .populate(this.mapper.populate())) as T;
      return this.mapper.map(updatedDoc);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(dto: T, gameId: string) {
    try {
      const updatedDto = await this.mapper.update({ ...dto, gameId });
      const newDto = new this.schema(updatedDto);
      if ("createdAt" in newDto) {
        newDto.createdAt = Date.now();
      }
      return this.mapper.map(
        (await this.schema.populate(
          await newDto.save(),
          this.mapper.populate()
        )) as T
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(_id: string) {
    try {
      return await this.schema.findByIdAndDelete({ _id });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default CompleteService;
