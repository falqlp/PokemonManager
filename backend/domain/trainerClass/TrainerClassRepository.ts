import ReadOnlyService from "../../api/ReadOnlyService";
import TrainerClass, { ITrainerClass } from "./TrainerClass";
import TrainerClassMapper from "./TrainerClassMapper";
import { Aggregate } from "mongoose";

class TrainerClassRepository extends ReadOnlyService<ITrainerClass> {
  private static instance: TrainerClassRepository;

  public static getInstance(): TrainerClassRepository {
    if (!TrainerClassRepository.instance) {
      TrainerClassRepository.instance = new TrainerClassRepository(
        TrainerClass,
        TrainerClassMapper.getInstance(),
      );
    }
    return TrainerClassRepository.instance;
  }

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
