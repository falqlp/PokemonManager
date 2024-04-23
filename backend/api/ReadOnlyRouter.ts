import { Router } from "express";
import ReadOnlyRepository from "../domain/ReadOnlyRepository";
import { MongoId } from "../domain/MongoId";
class ReadOnlyRouter<T extends MongoId> {
  public router = Router();
  constructor(protected service: ReadOnlyRepository<T>) {
    this.initReadOnlyRouter();
  }

  initReadOnlyRouter(): void {
    this.router.get("/:id", (req, res) => {
      const gameId = req.headers["game-id"] as string;
      this.service
        .get(req.params.id, { gameId })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/", (req, res) => {
      const gameId = req.headers["game-id"] as string;
      this.service
        .list(req.body, { gameId })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/query-table", (req, res) => {
      const gameId = req.headers["game-id"] as string;
      const lang = req.headers["lang"] as string;
      this.service
        .queryTable(req.body, { gameId, lang })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });
  }
}

export default ReadOnlyRouter;
