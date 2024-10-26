import {
  CompetitionType,
  ICompetition,
} from '../../../domain/competiton/Competition';
import TournamentTestMother from './tournament/TournamentTestMother';

export default class CompetitionTestMother {
  public static getTournamentCompetition(): ICompetition {
    return {
      name: 'Competition',
      type: CompetitionType.TOURNAMENT,
      tournament: TournamentTestMother.getTournament(),
      division: 3,
      gameId: 'gameId',
    };
  }

  public static getChampionshipCompetition(): ICompetition {
    return {
      _id: 'championshipId',
      name: 'Championship',
      type: CompetitionType.CHAMPIONSHIP,
      division: 3,
      gameId: 'gameId',
    };
  }

  public static getFriendlyCompetition(): ICompetition {
    return {
      name: 'Friendly',
      type: CompetitionType.FRIENDLY,
      gameId: 'gameId',
    };
  }

  public static withCustomOptions(
    options: Partial<ICompetition>,
  ): ICompetition {
    return {
      ...this.getFriendlyCompetition(),
      ...options,
    } as ICompetition;
  }

  public static championshipWithCustomOptions(
    options: Partial<ICompetition>,
  ): ICompetition {
    return {
      ...this.getChampionshipCompetition(),
      ...options,
    } as ICompetition;
  }
}
