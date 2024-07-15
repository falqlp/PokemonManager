import { singleton } from "tsyringe";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import { IDamageEvent } from "../../domain/battleevents/damageevent/DamageEvent";
import { IBattleParticipationEvent } from "../../domain/battleevents/battleparticipationevent/BattleParticipationEvent";
import DamageEventRepository from "../../domain/battleevents/damageevent/DamageEventRepository";
import BattleParticipationEventRepository from "../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository";

@singleton()
export class BattleEventsService {
  constructor(
    private calendarEventRepository: CalendarEventRepository,
    private battleInstanceRepository: BattleInstanceRepository,
    private damageEventRepository: DamageEventRepository,
    private battleParticipationEventRepository: BattleParticipationEventRepository,
  ) {}

  public async insertBattleEventsData(
    battleId: string,
    damageEvents: IDamageEvent[],
    battleParticipationEvents: IBattleParticipationEvent[],
  ): Promise<void> {
    const date = await this.calendarEventRepository.getBattleDate(battleId);
    const battle = await this.battleInstanceRepository.get(battleId);
    const competitionId = battle.competition._id.toString();
    const gameId = battle.gameId.toString();
    damageEvents = damageEvents.map((event) => {
      return {
        ...event,
        battleId,
        competitionId,
        date,
        gameId,
      };
    });
    battleParticipationEvents = battleParticipationEvents.map((event) => {
      return {
        ...event,
        battleId,
        competitionId,
        date,
        gameId,
      };
    });
    await this.damageEventRepository.insertMany(damageEvents);
    await this.battleParticipationEventRepository.insertMany(
      battleParticipationEvents,
    );
  }
}
