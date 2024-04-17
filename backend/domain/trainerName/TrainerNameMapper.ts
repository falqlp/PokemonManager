import { IMapper } from "../../api/IMapper";
import { PopulateOptions } from "mongoose";
import { ITrainerName } from "./TrainerName";

class TrainerNameMapper implements IMapper<ITrainerName> {
  private static instance: TrainerNameMapper;

  public static getInstance(): TrainerNameMapper {
    if (!TrainerNameMapper.instance) {
      TrainerNameMapper.instance = new TrainerNameMapper();
    }
    return TrainerNameMapper.instance;
  }

  map(
    entity: ITrainerName,
    gameId: string | undefined
  ): Promise<ITrainerName> | ITrainerName {
    return entity;
  }

  populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }

  update(entity: ITrainerName): Promise<ITrainerName> | ITrainerName {
    return entity;
  }
}

export default TrainerNameMapper;
