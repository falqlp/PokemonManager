import { Router } from "express";
import ReadOnlyRepository, { TableResult } from "../domain/ReadOnlyRepository";
import { MongoId } from "../domain/MongoId";
class ReadOnlyGlobalRouter<T extends MongoId> {
  public router = Router();
  constructor(protected service: ReadOnlyRepository<T>) {
    this.initReadOnlyRouter();
  }

  initReadOnlyRouter(): void {
    this.router.get("/:id", (req, res) => {
      this.service
        .get(req.params.id)
        .then((obj: T) => res.status(200).json(obj))
        .catch((error: Error) => console.log(error));
    });

    this.router.put("/", (req, res) => {
      this.service
        .list(req.body)
        .then((obj: T[]) => res.status(200).json(obj))
        .catch((error: Error) => console.log(error));
    });

    this.router.put("/query-table", (req, res) => {
      const lang = req.headers["lang"] as string;
      this.service
        .queryTable(req.body, { lang })
        .then((obj: TableResult<T>) => res.status(200).json(obj))
        .catch((error: Error) => console.log(error));
    });
  }
}

export default ReadOnlyGlobalRouter;
