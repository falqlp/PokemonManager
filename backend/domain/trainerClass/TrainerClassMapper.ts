import { IMapper } from "../../api/IMapper";
import { ITrainerClass } from "./TrainerClass";
import { PopulateOptions } from "mongoose";

class TrainerClassMapper implements IMapper<ITrainerClass> {
  private static instance: TrainerClassMapper;

  public static getInstance(): TrainerClassMapper {
    if (!TrainerClassMapper.instance) {
      TrainerClassMapper.instance = new TrainerClassMapper();
    }
    return TrainerClassMapper.instance;
  }

  map(entity: ITrainerClass): Promise<ITrainerClass> | ITrainerClass {
    return entity;
  }

  populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }

  update(entity: ITrainerClass): Promise<ITrainerClass> | ITrainerClass {
    return entity;
  }
}

export default TrainerClassMapper;
