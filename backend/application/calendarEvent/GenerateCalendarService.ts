import { ITrainer } from "../../domain/trainer/Trainer";
import { ICalendarEvent } from "../../domain/calendarEvent/CalendarEvent";
import { getRandomFromArray, shuffleArray } from "../../utils/RandomUtils";
import { PeriodModel } from "../PeriodModel";

class GenerateCalendarService {
  private static instance: GenerateCalendarService;

  public static getInstance(): GenerateCalendarService {
    if (!GenerateCalendarService.instance) {
      GenerateCalendarService.instance = new GenerateCalendarService();
    }
    return GenerateCalendarService.instance;
  }

  public generateChampionship(
    trainers: ITrainer[],
    nbFaceEachOther: number,
    gameId: string,
    period: PeriodModel
  ): ICalendarEvent[] {
    const matches = this.generateChampionshipMatches(
      trainers,
      nbFaceEachOther,
      gameId
    );
    const availableMatchDate = this.getAvilableDayForTrainer(period, trainers);
    this.planMatches(matches, availableMatchDate);
    return matches;
  }

  private generateChampionshipMatches(
    trainers: ITrainer[],
    nbFaceEachOther: number,
    gameId: string
  ): ICalendarEvent[] {
    const matches: ICalendarEvent[] = [];
    for (let i = 0; i < trainers.length; i++) {
      for (let j = i + 1; j < trainers.length; j++) {
        for (let k = 0; k < nbFaceEachOther; k++) {
          matches.push({
            trainers: [trainers[i], trainers[j]],
            date: new Date(),
            gameId,
          } as ICalendarEvent);
        }
      }
    }
    shuffleArray(matches);
    return matches;
  }

  private planMatches(
    matches: ICalendarEvent[],
    availableMatchDate: Map<string, Date[]>
  ) {
    matches.map((match, index) => {
      match.date = this.getRandomDate(match, availableMatchDate);
      availableMatchDate.get(match.trainers[0]._id);
      match.trainers.forEach((trainer) => {
        const index = availableMatchDate.get(trainer._id).indexOf(match.date);
        if (index !== -1) {
          availableMatchDate.get(trainer._id).splice(index, 1);
        }
      });
      return match;
    });
  }

  private getRandomDate(
    match: ICalendarEvent,
    availableMatchDate: Map<string, Date[]>
  ): Date {
    return getRandomFromArray(
      this.commonAvailableDate(
        availableMatchDate.get(match.trainers[0]._id),
        availableMatchDate.get(match.trainers[1]._id)
      )
    );
  }
  private getAvilableDayForTrainer(
    period: PeriodModel,
    trainers: ITrainer[]
  ): Map<string, Date[]> {
    const availableDays: Date[] = [];
    const date = new Date(period.startDate);
    while (period.endDate.getTime() >= date.getTime()) {
      availableDays.push(new Date(date));
      date.setUTCDate(date.getUTCDate() + 1);
    }
    const availableMatchDate: Map<string, Date[]> = new Map();
    trainers.forEach((value) => {
      availableMatchDate.set(value._id, [...availableDays]);
    });
    return availableMatchDate;
  }

  private commonAvailableDate(dates1: Date[], dates2: Date[]): Date[] {
    const dates = [...dates1];
    return dates.filter((date1) =>
      dates2.some((date2) => date1.getTime() === date2.getTime())
    );
  }
}

export default GenerateCalendarService;
