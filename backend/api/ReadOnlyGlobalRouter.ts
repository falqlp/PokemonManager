import { Router } from "express";
import ReadOnlyService from "./ReadOnlyService";
import { Document } from "mongoose";
import ReadOnlyRouter from "./ReadOnlyRouter";
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

    this.router.put("/count", (req, res, next) => {
      this.service
        .count(req.body)
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/translateAggregation", (req, res, next) => {
      this.service
        .translateAggregation(req.body)
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });
  }
}

export default ReadOnlyGlobalRouter;
