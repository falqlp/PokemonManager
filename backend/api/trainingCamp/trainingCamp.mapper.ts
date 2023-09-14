import { IMapper } from "../IMapper";
import { ITrainingCamp } from "./trainingCamp";

class TrainingCampMapper implements IMapper<ITrainingCamp> {
  private static instance: TrainingCampMapper;
  constructor() {}
  public async map(dto: ITrainingCamp): Promise<ITrainingCamp> {
    return dto;
  }

  public update(dto: ITrainingCamp): ITrainingCamp {
    return dto;
  }

  public static getInstance(): TrainingCampMapper {
    if (!TrainingCampMapper.instance) {
      TrainingCampMapper.instance = new TrainingCampMapper();
    }
    return TrainingCampMapper.instance;
  }
}

export default TrainingCampMapper;
