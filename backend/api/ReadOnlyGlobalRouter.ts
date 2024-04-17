import { Router } from "express";
import ReadOnlyService from "./ReadOnlyService";
import { Document } from "mongoose";
class ReadOnlyGlobalRouter<T extends Document> {
  public router = Router();
  constructor(protected service: ReadOnlyService<T>) {
    this.initReadOnlyRouter();
  }

  initReadOnlyRouter() {
    this.router.get("/:id", (req, res, next) => {
      this.service
        .get(req.params.id)
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/", (req, res, next) => {
      this.service
        .list(req.body)
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/query-table", (req, res, next) => {
      const lang = req.headers["lang"] as string;
      this.service
        .queryTable(req.body, { lang })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });
  }
}

export default ReadOnlyGlobalRouter;
