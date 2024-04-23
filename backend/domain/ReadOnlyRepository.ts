import { IMapper } from "./IMapper";
import { Aggregate, FilterQuery, Model } from "mongoose";
import { ObjectId } from "mongodb";
import { MongoId } from "./MongoId";

export interface ListBody {
  custom?: any;
  ids?: string[];
  limit?: number;
  sort?: any;
  skip?: number;
}

export interface TableResult<T> {
  data: T[];
  count: number;
}

abstract class ReadOnlyRepository<T extends MongoId> {
  constructor(
    protected schema: Model<T>,
    protected mapper: IMapper<T>,
  ) {}

  async get(
    _id: string,
    options?: {
      gameId?: string;
      map?: (entity: T) => Promise<T> | T;
    },
  ): Promise<T> {
    try {
      const query: { _id: string; gameId?: string } = { _id };
      if (options?.gameId) {
        query["gameId"] = options.gameId;
      }
      const entity = (await this.schema
        .findOne(query as FilterQuery<T>)
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
    },
  ): Promise<T[]> {
    try {
      const query = { ...body.custom };
      if (options?.gameId) {
        query["gameId"] = options.gameId;
      }
      if (body.ids) {
        query._id = { $in: body.ids };
      }
      const dtos: T[] = await this.schema
        .find(query)
        .populate(this.mapper.populate())
        .limit(body.limit || 0)
        .skip(body.skip)
        .sort(body.sort);

      if (body.ids?.length && !body.sort) {
        dtos.sort((a: T, b: T) => {
          return (
            body.ids!.indexOf(a._id.toString()) -
            body.ids!.indexOf(b._id.toString())
          );
        });
      }

      return await Promise.all(
        dtos.map(async (dto) => {
          return options?.map ? options.map(dto) : this.mapper.map(dto);
        }),
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async queryTable(
    body: ListBody,
    options?: {
      gameId?: string;
      lang?: string;
      map?: (entity: T) => Promise<T> | T;
    },
  ): Promise<TableResult<T>> {
    try {
      const query = { ...body.custom };
      const translateQuery: Record<string, unknown> = {};
      const nonTranslateQuery: Record<string, unknown> = {};
      let sortQuery: Record<string, unknown> = {};
      const aggregation = this.schema.aggregate([]);

      this.getTranslateAndNonTranslateQuery(
        query,
        translateQuery,
        nonTranslateQuery,
        aggregation,
        options,
      );
      let sortParts;
      if (Object.keys(body.sort).length > 0) {
        sortParts = Object.keys(body.sort)[0].split(".");
        sortQuery = body.sort;
      }
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
      this.getTranslatedData(
        aggregation,
        nonTranslateQuery,
        translateQuery,
        Object.keys(body.sort)[0],
        options,
      );
      if (Object.keys(sortQuery).length > 0) {
        // @ts-expect-error attends un Record
        aggregation.sort(sortQuery);
      }
      aggregation.facet({
        data: [{ $skip: body.skip ?? 0 }, { $limit: body.limit ?? 0 }],
        totalCount: [{ $count: "total" }],
      });
      aggregation.project({
        data: 1,
        count: { $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0] },
      });
      const result = (await aggregation)[0] as TableResult<T>;
      result.data?.forEach((dto) => {
        Object.keys(dto).forEach((key) => {
          if (key.startsWith("query")) {
            delete (dto as any)[key];
          }
        });
      });
      if (this.mapper.populate()) {
        result.data = await this.schema.populate(
          result.data,
          this.mapper.populate(),
        );
      }
      result.data?.map(async (dto) => {
        return options?.map ? options.map(dto) : this.mapper.map(dto);
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private getTranslatedData(
    aggregation: Aggregate<Array<any>>,
    nonTranslateQuery: Record<string, unknown>,
    translateQuery: Record<string, unknown>,
    sortKey: string,
    options: {
      gameId?: string;
      lang?: string;
      map?: (entity: T) => Promise<T> | T;
    },
  ): void {
    if (Object.keys(nonTranslateQuery).length > 0) {
      aggregation.match(nonTranslateQuery);
    }
    const modifiedTranslateQuery: Record<string, unknown> = {};
    Object.keys(translateQuery).forEach((key) => {
      const newKey = key + "." + options.lang;
      modifiedTranslateQuery[newKey] = translateQuery[key];
      const splitMatch = key.split(".");
      if (key !== sortKey) {
        aggregation.lookup({
          from: "translations",
          localField: splitMatch[1],
          foreignField: "key",
          as: "translation." + splitMatch[1],
        });
        aggregation.collation({ locale: options.lang, strength: 1 });
      }
    });
    if (Object.keys(modifiedTranslateQuery).length > 0) {
      aggregation.match(modifiedTranslateQuery);
    }
  }

  private getTranslateAndNonTranslateQuery(
    query: any,
    translateQuery: Record<string, unknown>,
    nonTranslateQuery: Record<string, unknown>,
    aggregation: Aggregate<any>,
    options: {
      gameId?: string;
      lang?: string;
      map?: (entity: T) => Promise<T> | T;
    },
  ): void {
    Object.keys(query).forEach((key) => {
      const splitMatch = key.split(".");
      if (splitMatch.length > 1) {
        if (splitMatch[0] === "translation") {
          translateQuery[key] = query[key];
        } else if (splitMatch[0] === "objectid") {
          nonTranslateQuery[splitMatch[1]] = new ObjectId(query[key] as string);
        } else {
          this.customLookup(
            splitMatch,
            aggregation,
            nonTranslateQuery,
            query,
            key,
          );
        }
      } else {
        nonTranslateQuery[key] = query[key];
      }
    });
    if (options?.gameId) {
      nonTranslateQuery["gameId"] = options.gameId;
    }
  }

  private customLookup(
    splitMatch: string[],
    aggregation: Aggregate<any>,
    nonTranslateQuery: Record<string, any>,
    query: any,
    key: string,
  ): void {
    const schema = (this.schema.schema as any).tree[splitMatch[0]];
    const isArray = Array.isArray(schema);
    const ref = isArray
      ? schema[0].ref.toLowerCase() + "s"
      : schema.ref.toLowerCase() + "s";
    aggregation.lookup({
      from: ref,
      localField: splitMatch[0],
      foreignField: "_id",
      as: "query" + splitMatch[0],
    });
    const key2 = splitMatch[1];
    nonTranslateQuery["query" + splitMatch[0]] = isArray
      ? {
          $elemMatch: {
            [key2]: query[key],
          },
        }
      : { [key2]: query[key] };
  }
}

export default ReadOnlyRepository;
