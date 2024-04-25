import { IMapper } from "../../domain/IMapper";
import { singleton } from "tsyringe";
import { ICompetition } from "../../domain/competiton/Competition";

@singleton()
class CompetitionMapper implements IMapper<ICompetition> {
  public map(dto: ICompetition): ICompetition {
    return dto;
  }
}

export default CompetitionMapper;
