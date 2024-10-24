import { IMapper } from "../../domain/IMapper";
import { ITrainingCamp } from "../../domain/trainer/trainingCamp/TrainingCamp";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
class TrainingCampMapper implements IMapper<ITrainingCamp> {
  public populate(): PopulateOptions {
    return "" as unknown as PopulateOptions;
  }

  public map(dto: ITrainingCamp): ITrainingCamp {
    return dto;
  }
}

export default TrainingCampMapper;
