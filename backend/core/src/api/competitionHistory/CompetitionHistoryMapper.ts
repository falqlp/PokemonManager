import { IMapper } from 'shared/common/domain/IMapper';
import { ICompetitionHistory } from '../../domain/competiton/competitionHistory/CompetitionHistory';

const CompetitionHistoryMapper: IMapper<ICompetitionHistory> = {
  map: function (competition: ICompetitionHistory): ICompetitionHistory {
    return competition;
  },
};

export default CompetitionHistoryMapper;
