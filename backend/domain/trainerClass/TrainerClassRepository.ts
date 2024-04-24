import TrainerClass from "./TrainerClass";
import { Aggregate } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
class TrainerClassRepository {
  public generateTrainerName(): Aggregate<
    Array<{ class: string; name: string }>
  > {
    return TrainerClass.aggregate()
      .sample(1)
      .lookup({
        from: "trainernames",
        localField: "gender",
        foreignField: "gender",
        as: "result",
      })
      .addFields({
        randomResult: {
          $arrayElemAt: [
            "$result",
            { $floor: { $multiply: [{ $size: "$result" }, Math.random()] } },
          ],
        },
      })
      .project({
        _id: 0,
        class: 1,
        name: "$randomResult.name",
      });
  }
}

export default TrainerClassRepository;
