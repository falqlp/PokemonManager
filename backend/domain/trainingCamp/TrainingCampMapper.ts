import { IMapper } from "../IMapper";
import { ITrainingCamp } from "./TrainingCamp";
import { PopulateOptions } from "mongoose";

class TrainingCampMapper implements IMapper<ITrainingCamp> {
  private static instance: TrainingCampMapper;
  constructor() {}

  public populate(): PopulateOptions {
    return "" as unknown as PopulateOptions;
  }

  public map(dto: ITrainingCamp): ITrainingCamp {
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
