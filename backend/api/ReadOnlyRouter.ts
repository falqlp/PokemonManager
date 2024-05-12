import { Router } from "express";
import ReadOnlyRepository from "../domain/ReadOnlyRepository";
import { MongoId } from "../domain/MongoId";
import { IMapper } from "../domain/IMapper";
class ReadOnlyRouter<T extends MongoId> {
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
        const gameId = req.headers["game-id"] as string;
        const obj = await this.service.get(req.params.id, { gameId });
        res.status(200).json(this.mapper.map(obj));
      } catch (error) {
        next(error);
      }
    });

    this.router.put("/", async (req, res, next) => {
      try {
        const gameId = req.headers["game-id"] as string;
        const obj = await this.service.list(req.body, { gameId });
        res.status(200).json(obj.map((value) => this.mapper.map(value)));
      } catch (error) {
        next(error);
      }
    });

    this.router.post("/query-table", async (req, res, next) => {
      try {
        const gameId = req.headers["game-id"] as string;
        const lang = req.headers["lang"] as string;
        const obj = await this.service.queryTable(req.body, { gameId, lang });
        obj.data = obj.data.map((value) => this.mapper.map(value));
        res.status(200).json(obj);
      } catch (error) {
        next(error);
      }
    });
  }
}

export default ReadOnlyRouter;
