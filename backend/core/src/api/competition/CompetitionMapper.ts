import { IMapper } from '../../domain/IMapper';
import { Injectable } from '@nestjs/common';
import { ICompetition } from '../../domain/competiton/Competition';

@Injectable()
class CompetitionMapper implements IMapper<ICompetition> {
  public map(dto: ICompetition): ICompetition {
    return dto;
  }
}

export default CompetitionMapper;
