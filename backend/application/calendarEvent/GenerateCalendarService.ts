import { ITrainer } from "../../domain/trainer/Trainer";
import {
  CalendarEventEvent,
  ICalendarEvent,
} from "../../domain/calendarEvent/CalendarEvent";
import { getRandomFromArray, shuffleArray } from "../../utils/RandomUtils";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import { singleton } from "tsyringe";
import { ICompetition } from "../../domain/competiton/Competition";
import { addDays, isSevenDaysApart } from "../../utils/DateUtils";
import { mongoId } from "../../utils/MongoUtils";

@singleton()
class GenerateCalendarService {
  constructor(
    protected battleInstanceRepository: BattleInstanceRepository,
    protected calendarEventRepository: CalendarEventRepository,
  ) {}

  public async generateChampionship(
    trainers: ITrainer[],
    nbFaceEachOther: number,
    gameId: string,
    championship: ICompetition,
  ): Promise<void> {
    let matches = this.generateChampionshipMatches(
      trainers,
      nbFaceEachOther,
      gameId,
      championship,
    );
    matches =
      await this.battleInstanceRepository.insertManyWithoutMapAndPopulate(
        matches,
      );
    const availableMatchDate = this.getAvilableDayForTrainer(
      championship,
      trainers,
    );
    const calendarEvents = this.planMatches(
      matches,
      availableMatchDate,
      gameId,
    );
    await this.calendarEventRepository.insertManyWithoutMapAndPopulate(
      calendarEvents,
    );
  }

  public async generateGroupMatches(
    groups: ITrainer[][],
    nbFaceEachOther: number,
    gameId: string,
    championship: ICompetition,
  ): Promise<void> {
    let battles: IBattleInstance[] = [];
    let events: ICalendarEvent[] = [];
    for (const trainers of groups) {
      const matches = this.generateChampionshipMatches(
        trainers,
        nbFaceEachOther,
        gameId,
        championship,
      );
      battles = [...battles, ...matches];
      const availableMatchDate = this.getAvilableDayForTrainer(
        championship,
        trainers,
      );
      const calendarEvents = this.planMatches(
        matches,
        availableMatchDate,
        gameId,
      );
      events = [...events, ...calendarEvents];
    }
    await this.battleInstanceRepository.insertManyWithoutMapAndPopulate(
      battles,
    );
    await this.calendarEventRepository.insertManyWithoutMapAndPopulate(events);
  }

  private generateChampionshipMatches(
    trainers: ITrainer[],
    nbFaceEachOther: number,
    gameId: string,
    championship: ICompetition,
  ): IBattleInstance[] {
    const matches: IBattleInstance[] = [];
    for (let i = 0; i < trainers.length; i++) {
      for (let j = i + 1; j < trainers.length; j++) {
        for (let k = 0; k < nbFaceEachOther; k++) {
          matches.push({
            _id: mongoId(),
            player: trainers[i],
            opponent: trainers[j],
            gameId,
            competition: championship,
          });
        }
      }
    }
    shuffleArray(matches);
    return matches;
  }

  private planMatches(
    matches: IBattleInstance[],
    availableMatchDate: Map<string, Date[]>,
    gameId: string,
  ): ICalendarEvent[] {
    return matches.map((match) => {
      const date = this.getRandomDate(match, availableMatchDate);
      availableMatchDate = this.deleteAvailableDateForTrainer(
        availableMatchDate,
        date,
        match.player,
      );
      availableMatchDate = this.deleteAvailableDateForTrainer(
        availableMatchDate,
        date,
        match.opponent,
      );
      return {
        date,
        trainers: [match.player, match.opponent],
        event: match,
        type: CalendarEventEvent.BATTLE,
        gameId,
      } as ICalendarEvent;
    });
  }

  private deleteAvailableDateForTrainer(
    availableMatchDate: Map<string, Date[]>,
    date: Date,
    trainer: ITrainer,
  ): Map<string, Date[]> {
    const index = availableMatchDate
      .get(trainer._id.toString())
      .findIndex((value) => value.getTime() === date.getTime());
    if (index !== -1) {
      availableMatchDate.get(trainer._id.toString()).splice(index, 1);
    }
    return availableMatchDate;
  }

  private getRandomDate(
    match: IBattleInstance,
    availableMatchDate: Map<string, Date[]>,
  ): Date {
    return getRandomFromArray(
      this.commonAvailableDate(
        availableMatchDate.get(match.player._id.toString()),
        availableMatchDate.get(match.opponent._id.toString()),
      ),
    );
  }

  private getAvilableDayForTrainer(
    competition: ICompetition,
    trainers: ITrainer[],
  ): Map<string, Date[]> {
    const availableDays: Date[] = [];
    const date = new Date(competition.startDate);
    while (competition.endDate.getTime() >= date.getTime()) {
      availableDays.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    const availableMatchDate: Map<string, Date[]> = new Map();
    trainers.forEach((value) => {
      availableMatchDate.set(value._id.toString(), [...availableDays]);
    });
    return availableMatchDate;
  }

  private commonAvailableDate(dates1: Date[], dates2: Date[]): Date[] {
    const dates = [...dates1];
    return dates.filter((date1) =>
      dates2.some((date2) => date1.getTime() === date2.getTime()),
    );
  }

  public generateBO3matches(
    player: ITrainer,
    opponent: ITrainer,
    startDate: Date,
    endDate: Date,
    gameId: string,
    tournamentId: string,
  ): { battles: IBattleInstance[]; events: ICalendarEvent[] } {
    if (!isSevenDaysApart(startDate, endDate)) {
      throw new Error(
        "Il doit il y avoir une periode de 7 jours pour planifier un BO3",
      );
    }
    const battleDate = [
      addDays(startDate, 2),
      addDays(startDate, 4),
      addDays(startDate, 6),
    ];
    const battles: IBattleInstance[] = [];
    const events: ICalendarEvent[] = [];
    battleDate.forEach((date) => {
      const battle: IBattleInstance = {
        _id: mongoId(),
        gameId,
        opponent,
        player,
        competition: tournamentId as unknown as ICompetition,
      };
      battles.push(battle);
      events.push({
        _id: mongoId(),
        gameId,
        date,
        trainers: [opponent, player],
        event: battle,
        type: CalendarEventEvent.BATTLE,
      });
    });
    return { battles, events };
  }
}

export default GenerateCalendarService;
