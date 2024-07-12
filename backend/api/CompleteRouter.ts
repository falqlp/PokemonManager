import ReadOnlyRouter from "./ReadOnlyRouter";
import CompleteRepository from "../domain/CompleteRepository";
import { MongoId } from "../domain/MongoId";
import { IMapper } from "../domain/IMapper";

class CompleteRouter<T extends MongoId> extends ReadOnlyRouter<T> {
  constructor(protected service: CompleteRepository<T>, mapper: IMapper<T>) {
    super(service, mapper);
    this.initCompleteRouter();
  }

  public initCompleteRouter(): void {
    this.router.put("/:id", async (req, res, next) => {
      try {
        const obj = await this.service.update(req.params.id, req.body);
        res.status(200).json(this.mapper.map(obj));
      } catch (error) {
        next(error);
      }
    });

    this.router.delete("/:id", async (req, res, next) => {
      try {
        await this.service.delete(req.params.id);
        res.status(200).json();
      } catch (error) {
        next(error);
      }
    });
  }
}

export default CompleteRouter;
