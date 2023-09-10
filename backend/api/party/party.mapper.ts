import { IMapper } from "../IMapper";
import { IParty } from "./party";
import TrainerService from "../trainer/trainer.service";

class PartyMapper implements IMapper<IParty> {
  private static instance: PartyMapper;
  constructor(protected trainerService: TrainerService) {}
  public async map(dto: IParty): Promise<IParty> {
    dto.player = await this.trainerService.get(dto.player as unknown as string);
    return dto;
  }

  public update(dto: IParty): IParty {
    dto.player = dto.player._id;
    return dto;
  }

  public static getInstance(): PartyMapper {
    if (!PartyMapper.instance) {
      PartyMapper.instance = new PartyMapper(TrainerService.getInstance());
    }
    return PartyMapper.instance;
  }
}

export default PartyMapper;
