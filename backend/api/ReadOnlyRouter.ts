import { Router } from "express";
import ReadOnlyService from "./ReadOnlyService";
import { Document } from "mongoose";
class ReadOnlyRouter<T extends Document> {
  public router = Router();
  constructor(protected service: ReadOnlyService<T>) {
    this.initReadOnlyRouter();
  }

  initReadOnlyRouter() {
    this.router.get("/:id", (req, res, next) => {
      const partyId = req.headers["party-id"] as string;
      this.service
        .get(req.params.id, { partyId })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });

    this.router.put("/", (req, res, next) => {
      const partyId = req.headers["party-id"] as string;
      this.service
        .list(req.body, { partyId })
        .then((obj: any) => res.status(200).json(obj))
        .catch((error: any) => console.log(error));
    });
  }
}

export default ReadOnlyRouter;
