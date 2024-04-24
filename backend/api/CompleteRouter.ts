import ReadOnlyRouter from "./ReadOnlyRouter";
import CompleteRepository from "../domain/CompleteRepository";
import { MongoId } from "../domain/MongoId";
import { IMapper } from "../domain/IMapper";

class CompleteRouter<T extends MongoId> extends ReadOnlyRouter<T> {
  constructor(
    protected service: CompleteRepository<T>,
    mapper: IMapper<T>,
  ) {
    super(service, mapper);
    this.initCompleteRouter();
  }

  public initCompleteRouter(): void {
    this.router.post("/", (req, res) => {
      req.body.gameId = req.headers["game-id"] as string;
      this.service
        .create(req.body)
        .then((obj) => res.status(200).json(this.mapper.map(obj)))
        .catch((error) => console.log(error));
    });

    this.router.put("/:id", (req, res) => {
      this.service
        .update(req.params.id, req.body)
        .then((obj) => res.status(200).json(this.mapper.map(obj)))
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
