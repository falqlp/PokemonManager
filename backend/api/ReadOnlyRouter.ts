import { Router } from "express";
import ReadOnlyService from "./ReadOnlyService";
import { Document } from "mongoose";
abstract class ReadOnlyRouter<T extends Document> {
  public router = Router();
  constructor(protected service: ReadOnlyService<T>) {
    this.initReadOnlyRouter();
  }

  initReadOnlyRouter() {
    this.router.get("/:id", (req, res, next) => {
      const gameId = req.headers["game-id"] as string;
      this.service
        .get(req.params.id, { gameId })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/", (req, res, next) => {
      const gameId = req.headers["game-id"] as string;
      this.service
        .list(req.body, { gameId })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/guery-table", (req, res, next) => {
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
