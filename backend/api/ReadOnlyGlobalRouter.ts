import { Router } from "express";
import ReadOnlyRepository from "../domain/ReadOnlyRepository";
import { MongoId } from "../domain/MongoId";
import { IMapper } from "../domain/IMapper";
class ReadOnlyGlobalRouter<T extends MongoId> {
  public router = Router();
  constructor(
    protected service: ReadOnlyRepository<T>,
    protected mapper: IMapper<T>,
  ) {
    this.initReadOnlyRouter();
  }

  initReadOnlyRouter(): void {
    this.router.get("/:id", async (req, res, next) => {
      try {
        const obj = await this.service.get(req.params.id);
        res.status(200).json(this.mapper.map(obj));
      } catch (error) {
        next(error);
      }
    });

    this.router.put("/", async (req, res, next) => {
      try {
        const obj = await this.service.list(req.body);
        res.status(200).json(obj.map((value) => this.mapper.map(value)));
      } catch (error) {
        next(error);
      }
    });

    this.router.put("/query-table", async (req, res, next) => {
      try {
        const lang = req.headers["lang"] as string;
        const obj = await this.service.queryTable(req.body, { lang });
        obj.data = obj.data.map((value) => this.mapper.map(value));
        res.status(200).json(obj);
      } catch (error) {
        next(error);
      }
    });
  }
}

export default ReadOnlyGlobalRouter;
