import { container } from "tsyringe";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import DamageEventRepository from "../../domain/battleevents/damageevent/DamageEventRepository";
import BattleParticipationEventRepository from "../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository";
import { BattleEventsService } from "./BattleEventsService";
import { IDamageEvent } from "../../domain/battleevents/damageevent/DamageEvent";
import { IBattleParticipationEvent } from "../../domain/battleevents/battleparticipationevent/BattleParticipationEvent";
import { DamageEventTestMother } from "../../test/domain/BattleEvents/DamageEventTestMother";
import { BattleParticipationEventTestMother } from "../../test/domain/BattleEvents/BattleParticipationEventTestMother";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import CompetitionTestMother from "../../test/domain/competition/CompetitionTestMother";

describe("BattleEventsService", () => {
  let service: BattleEventsService;
  let calendarEventRepository: CalendarEventRepository;
  let battleInstanceRepository: BattleInstanceRepository;
  let damageEventRepository: DamageEventRepository;
  let battleParticipationEventRepository: BattleParticipationEventRepository;

  beforeEach(() => {
    service = container.resolve(BattleEventsService);
    calendarEventRepository = container.resolve(CalendarEventRepository);
    battleInstanceRepository = container.resolve(BattleInstanceRepository);
    damageEventRepository = container.resolve(DamageEventRepository);
    battleParticipationEventRepository = container.resolve(
      BattleParticipationEventRepository,
    );
  });

  describe("insertBattleEventsData", () => {
    it("should insert damage and participation events with correct data", async () => {
      const battleId = "battleId";
      const date = new Date();
      const competitionId = "competitionId";
      const damageEvents: IDamageEvent[] = [
        DamageEventTestMother.basicDamage(),
        DamageEventTestMother.withCustomOptions({ value: 75 }),
      ];
      const battleParticipationEvents: IBattleParticipationEvent[] = [
        BattleParticipationEventTestMother.basicParticipation(),
        BattleParticipationEventTestMother.basicParticipation(),
      ];
      const getBattleDateSpy = jest.spyOn(
        calendarEventRepository,
        "getBattleDate",
      );
      const battleInstanceRepositoryGetSpy = jest.spyOn(
        battleInstanceRepository,
        "get",
      );
      getBattleDateSpy.mockResolvedValue(date);
      battleInstanceRepositoryGetSpy.mockResolvedValue({
        competition: CompetitionTestMother.withCustomOptions({
          _id: competitionId,
        }),
      } as IBattleInstance);
      jest.spyOn(damageEventRepository, "insertMany").mockResolvedValue([]);
      jest
        .spyOn(battleParticipationEventRepository, "insertMany")
        .mockResolvedValue([]);

      await service.insertBattleEventsData(
        battleId,
        damageEvents,
        battleParticipationEvents,
      );

      expect(getBattleDateSpy).toHaveBeenCalledWith(battleId);
      expect(battleInstanceRepositoryGetSpy).toHaveBeenCalledWith(battleId);
      expect(damageEventRepository.insertMany).toHaveBeenCalledWith([
        { ...damageEvents[0], battleId, competitionId, date },
        { ...damageEvents[1], battleId, competitionId, date },
      ]);
      expect(
        battleParticipationEventRepository.insertMany,
      ).toHaveBeenCalledWith([
        { ...battleParticipationEvents[0], battleId, competitionId, date },
        { ...battleParticipationEvents[1], battleId, competitionId, date },
      ]);
    });
  });
});
