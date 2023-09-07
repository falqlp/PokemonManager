import { IMapper } from "./IMapper";
import { Document, Model } from "mongoose";

interface ListBody {
  custom?: any;
  ids?: string[];
  limit?: number;
  sort?: any;
}

class ReadOnlyService<T extends Document> {
  constructor(protected schema: Model<T>, protected mapper: IMapper<T>) {
    this.get = this.get.bind(this);
    this.list = this.list.bind(this);
  }

  async get(_id: string): Promise<T> {
    try {
      const entity = (await this.schema.findOne({ _id })) as T;
      return this.mapper.map(entity);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async list(body: ListBody): Promise<T[]> {
    try {
      const query = { ...body.custom };
      if (body.ids) {
        query._id = { $in: body.ids };
      }
      const dtos = await this.schema
        .find(query)
        .limit(body.limit || 0)
        .sort(body.sort);

      if (body.ids?.length) {
        dtos.sort((a: any, b: any) => {
          return (
            body.ids!.indexOf(a._id.toString()) -
            body.ids!.indexOf(b._id.toString())
          );
        });
      }

      return await Promise.all(
        dtos.map(async (dto) => {
          return this.mapper.map(dto);
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ReadOnlyService;
