import ReadOnlyService from "./ReadOnlyService";
import { Document, Model } from "mongoose";
import { IMapper } from "./IMapper";
import { UpdateQuery } from "mongoose";

class CompleteService<T extends Document> extends ReadOnlyService<T> {
  constructor(protected schema: Model<T>, protected mapper: IMapper<T>) {
    super(schema, mapper);
    this.update = this.update.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async update(_id: string, dto: T) {
    try {
      return await this.schema.updateOne(
        { _id },
        this.mapper.update(dto) as unknown as UpdateQuery<T>
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(dto: T) {
    try {
      const newDto = new this.schema({ ...dto });
      return await newDto.save();
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
