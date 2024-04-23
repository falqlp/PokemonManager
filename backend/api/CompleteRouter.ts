import ReadOnlyRouter from "./ReadOnlyRouter";
import CompleteRepository from "../domain/CompleteRepository";
import { MongoId } from "../domain/MongoId";

class CompleteRouter<T extends MongoId> extends ReadOnlyRouter<T> {
  constructor(protected service: CompleteRepository<T>) {
    super(service);
    this.initCompleteRouter();
  }

  public initCompleteRouter(): void {
    this.router.post("/", (req, res) => {
      const gameId = req.headers["game-id"] as string;
      this.service
        .create(req.body, gameId)
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });

    this.router.put("/:id", (req, res) => {
      this.service
        .update(req.params.id, req.body)
        .then((obj) => res.status(200).json(obj))
        .catch((error) => console.log(error));
    });

    this.router.delete("/:id", (req, res) => {
      this.service
        .delete(req.params.id)
        .then(() => res.status(200).json())
        .catch((error) => console.log(error));
    });
  }
}

export default CompleteRouter;
