import { Controller } from '@nestjs/common';
import CompetitionHistoryMapper from './CompetitionHistoryMapper';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { ICompetitionHistory } from '../../domain/competiton/competitionHistory/CompetitionHistory';
import CompetitionHistoryRepository from '../../domain/competiton/competitionHistory/CompetitionHistoryRepository';

@Controller('competition-history')
export class CompetitionHistoryController extends ReadOnlyController<ICompetitionHistory> {
  constructor(protected readonly service: CompetitionHistoryRepository) {
    super(service, CompetitionHistoryMapper);
  }
}
