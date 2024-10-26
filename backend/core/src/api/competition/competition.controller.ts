import { Controller } from '@nestjs/common';
import CompetitionMapper from './CompetitionMapper';
import { ReadOnlyController } from '../read-only.controller';
import CompetitionRepository from '../../domain/competiton/CompetitionRepository';
import { ICompetition } from '../../domain/competiton/Competition';

@Controller('competition')
export class CompetitionController extends ReadOnlyController<ICompetition> {
  constructor(
    protected readonly repository: CompetitionRepository,
    protected readonly mapper: CompetitionMapper,
  ) {
    super(repository, mapper);
  }
}
