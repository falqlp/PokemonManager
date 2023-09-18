import ReadOnlyService from "./ReadOnlyService";
import { Document, Model, UpdateQuery } from "mongoose";
import { IMapper } from "./IMapper";

class CompleteService<T extends Document> extends ReadOnlyService<T> {
  constructor(protected schema: Model<T>, protected mapper: IMapper<T>) {
    super(schema, mapper);
  }

  async update(_id: string, dto: T) {
    try {
      const updatedDoc = await this.schema.findByIdAndUpdate(
        _id,
        {
          $set: { ...(await this.mapper.update(dto)) },
        } as unknown as UpdateQuery<T>,
        { new: true }
      );
      return this.mapper.map(updatedDoc);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(dto: T, partyId: string) {
    try {
      const newDto = new this.schema({
        ...(await this.mapper.update(dto)),
        partyId,
      });
      return this.mapper.map(await newDto.save());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(_id: string) {
    try {
      return await this.schema.deleteOne({ _id });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default CompleteService;
