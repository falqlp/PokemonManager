import { IMapper } from "./IMapper";
import { Document, Model } from "mongoose";

export interface ListBody {
  custom?: any;
  ids?: string[];
  limit?: number;
  sort?: any;
}

class ReadOnlyService<T extends Document> {
  constructor(protected schema: Model<T>, protected mapper: IMapper<T>) {}

  async get(
    _id: string,
    options?: {
      gameId?: string;
      map?: (entity: T) => Promise<T> | T;
    }
  ): Promise<T> {
    try {
      const query: { _id: string; gameId?: string } = { _id };
      if (options?.gameId) {
        query["gameId"] = options.gameId;
      }
      const entity = (await this.schema.findOne(query)) as T;
      return options?.map ? options.map(entity) : this.mapper.map(entity);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async list(
    body: ListBody,
    options?: {
      gameId?: string;
      map?: (entity: T) => Promise<T> | T;
    }
  ): Promise<T[]> {
    try {
      const query = { ...body.custom };
      if (options?.gameId) {
        query["gameId"] = options.gameId;
      }
      if (body.ids) {
        query._id = { $in: body.ids };
      }
      const dtos = await this.schema
        .find(query)
        .limit(body.limit || 0)
        .sort(body.sort);

      if (body.ids?.length && !body.sort) {
        dtos.sort((a: any, b: any) => {
          return (
            body.ids!.indexOf(a._id.toString()) -
            body.ids!.indexOf(b._id.toString())
          );
        });
      }

      return await Promise.all(
        dtos.map(async (dto) => {
          return options?.map ? options.map(dto) : this.mapper.map(dto);
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ReadOnlyService;
