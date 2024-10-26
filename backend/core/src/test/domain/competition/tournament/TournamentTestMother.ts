import { ITournament } from '../../../../domain/competiton/tournament/Tournament';
import TournamentStepTestMother from './TournamentStepTestMother';

export default class TournamentTestMother {
  public static getTournament(): ITournament {
    return {
      tournamentSteps: [TournamentStepTestMother.getTournamentStep()],
      nbStep: 3,
      competitionId: 'competitionId',
      gameId: 'gameId',
    };
  }

  public static withCustomOptions(options: Partial<ITournament>): ITournament {
    return {
      ...this.getTournament(),
      ...options,
    } as ITournament;
  }
}
