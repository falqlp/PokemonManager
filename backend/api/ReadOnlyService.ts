import { IMapper } from "./IMapper";
import { Document, Model } from "mongoose";

export interface ListBody {
  custom?: any;
  ids?: string[];
  limit?: number;
  sort?: any;
  skip?: number;
}

abstract class ReadOnlyService<T extends Document> {
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
      lang?: string;
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
      lang?: string;
      map?: (entity: T) => Promise<T> | T;
    }
  ): Promise<T[]> {
    try {
      const query = { ...body.custom };
      const translateQuery: Record<string, unknown> = {};
      const nonTranslateQuery: Record<string, unknown> = {};
      let sortQuery: Record<string, unknown> = {};

      Object.keys(query).forEach((key) => {
        const splitMatch = key.split(".");
        if (splitMatch[0] === "translation") {
          translateQuery[key] = query[key];
        } else {
          nonTranslateQuery[key] = query[key];
        }
      });
      if (options?.gameId) {
        nonTranslateQuery["gameId"] = options.gameId;
      }
      let sortParts;
      if (Object.keys(body.sort).length > 0) {
        sortParts = Object.keys(body.sort)[0].split(".");
        sortQuery = body.sort;
      }
      const aggregation = this.schema.aggregate([]);
      if (sortParts && sortParts[0] === "translation") {
        sortQuery = {};
        sortQuery[Object.keys(body.sort)[0] + "." + options.lang] =
          body.sort[Object.keys(body.sort)[0]];
        aggregation.lookup({
          from: "translations",
          localField: sortParts[1],
          foreignField: "key",
          as: "translation." + sortParts[1],
        });
        aggregation.collation({ locale: options.lang, strength: 1 });
      }
      aggregation.match(nonTranslateQuery);
      let modifiedTranslateQuery: Record<string, unknown> = {};
      Object.keys(translateQuery).forEach((key) => {
        const newKey = key + "." + options.lang;
        modifiedTranslateQuery[newKey] = translateQuery[key];
        const splitMatch = key.split(".");
        aggregation.lookup({
          from: "translations",
          localField: splitMatch[1],
          foreignField: "key",
          as: "translation." + splitMatch[1],
        });
        aggregation.collation({ locale: options.lang, strength: 1 });
      });
      aggregation.match(modifiedTranslateQuery);
      if (Object.keys(sortQuery).length > 0) {
        // @ts-ignore
        aggregation.sort(sortQuery);
      }
      if (body.skip) {
        aggregation.skip(body.skip);
      }
      aggregation.limit(body.limit || 0);
      const dtos = (await aggregation) as T[];
      if (this.mapper.populate()) {
        await this.schema.populate(dtos, this.mapper.populate());
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
      lang?: string;
      map?: (entity: T) => Promise<T> | T;
    }
  ): Promise<number> {
    try {
      const query = { ...body.custom };
      const translateQuery: Record<string, unknown> = {};
      const nonTranslateQuery: Record<string, unknown> = {};

      Object.keys(query).forEach((key) => {
        const splitMatch = key.split(".");
        if (splitMatch[0] === "translation") {
          translateQuery[key] = query[key];
        } else {
          nonTranslateQuery[key] = query[key];
        }
      });
      if (options?.gameId) {
        nonTranslateQuery["gameId"] = options.gameId;
      }
      const aggregation = this.schema.aggregate([]);
      aggregation.match(nonTranslateQuery);
      Object.keys(translateQuery).forEach((key) => {
        const splitMatch = key.split(".");
        aggregation.lookup({
          from: "translations",
          localField: splitMatch[1],
          foreignField: "key",
          as: "translation." + splitMatch[1],
        });
        aggregation.collation({ locale: options.lang, strength: 1 });
      });
      aggregation.match(translateQuery);
      return (await aggregation).length;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ReadOnlyService;
