import { IBattleParticipationEvent } from 'shared/models/battle-events/battle-events.model';

export class BattleParticipationEventTestMother {
  static basicParticipation(): IBattleParticipationEvent {
    return {
      battleId: 'battleId',
      trainerId: 'trainerId',
      pokemonIds: ['1', '2', '3'],
      date: new Date(0),
      competitionId: 'competitionId',
    };
  }

  static withCustomOptions(
    options: Partial<IBattleParticipationEvent>,
  ): IBattleParticipationEvent {
    return {
      ...this.basicParticipation(),
      ...options,
    } as IBattleParticipationEvent;
  }
}
