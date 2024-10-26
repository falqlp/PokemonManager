import { ITournamentStep } from "../../../../domain/competiton/tournament/Tournament";

export default class TournamentStepTestMother {
  public static getTournamentStep(): ITournamentStep {
    return {
      startDate: new Date(),
      endDate: new Date(),
      battleSeries: [],
    };
  }

  public static withCustomOptions(
    options: Partial<ITournamentStep>,
  ): ITournamentStep {
    return {
      ...this.getTournamentStep(),
      ...options,
    } as ITournamentStep;
  }
}
