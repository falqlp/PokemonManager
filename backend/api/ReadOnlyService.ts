import { IMapper } from "./IMapper";
import { Document, Model } from "mongoose";

export interface ListBody {
  custom?: any;
  ids?: string[];
  limit?: number;
  sort?: any;
  skip?: number;
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
      const entity = (await this.schema
        .findOne(query)
        .populate(this.mapper.populate())) as T;
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
        .populate(this.mapper.populate())
        .limit(body.limit || 0)
        .skip(body.skip)
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

  async translateAggregation(
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
      let sortParts;
      if (Object.keys(body.sort).length > 0) {
        sortParts = Object.keys(body.sort)[0].split(".");
      }
      const aggregation = this.schema.aggregate([]);
      if (sortParts && sortParts[0] === "translation") {
        aggregation.lookup({
          from: "translations",
          localField: sortParts[1],
          foreignField: "key",
          as: "translation." + sortParts[1],
        });
        aggregation.collation({ locale: sortParts[2], strength: 1 });
      }
      aggregation.match(query);
      if (Object.keys(body.sort).length > 0) {
        aggregation.sort(body.sort);
      }
      if (body.skip) {
        aggregation.skip(body.skip);
      }
      aggregation.limit(body.limit || 0);
      const dtos = (await aggregation) as T[];
      if (this.mapper.populate()) {
        await this.schema.populate(dtos, this.mapper.populate());
      }

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

  async count(
    body: ListBody,
    options?: {
      gameId?: string;
      map?: (entity: T) => Promise<T> | T;
    }
  ): Promise<number> {
    try {
      const query = { ...body.custom };
      if (options?.gameId) {
        query["gameId"] = options.gameId;
      }
      if (body.ids) {
        query._id = { $in: body.ids };
      }
      return await this.schema.find(query).count();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ReadOnlyService;
