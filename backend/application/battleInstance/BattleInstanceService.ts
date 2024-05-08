import { singleton } from "tsyringe";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import { ObjectId } from "mongodb";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import BattleService from "../battle/BattleService";
import { IBattleTrainer } from "../battle/BattleInterfaces";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import { CompetitionType } from "../../domain/competiton/Competition";
import BattleSerieRepository from "../../domain/battleSerie/BattleSerieRepository";
import { IBattleSerie } from "../../domain/battleSerie/BattleSerie";
import GameRepository from "../../domain/game/GameRepository";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";

export interface TrainerRanking {
  _id: string;
  class: string;
  name: string;
  wins: number;
  losses: number;
  winPercentage: number;
  ranking: number;
  directWins: any;
}

@singleton()
export class BattleInstanceService {
  constructor(
    protected battleInstanceRepository: BattleInstanceRepository,
    protected trainerRepository: TrainerRepository,
    protected battleService: BattleService,
    protected battleSerieRepository: BattleSerieRepository,
    protected gameRepository: GameRepository,
    protected calendarEventRepository: CalendarEventRepository,
  ) {}

  public async getRanking(competitionId: string): Promise<TrainerRanking[]> {
    const ranking = new Map<string, TrainerRanking>();
    const competitionObjId = new ObjectId(competitionId);
    const trainers = await this.trainerRepository.list({
      custom: { competitions: competitionObjId },
    });

    trainers.forEach((trainer) => {
      ranking.set(trainer._id.toString(), {
        _id: trainer._id.toString(),
        class: trainer.class,
        name: trainer.name,
        wins: 0,
        losses: 0,
        winPercentage: 0,
        ranking: 0,
        directWins: {},
      });
    });

    const competitionMatches = await this.battleInstanceRepository.list({
      custom: { competition: competitionObjId, winner: { $exists: true } },
    });

    competitionMatches.forEach((competitionMatch) => {
      const winnerId =
        competitionMatch.winner === "player"
          ? competitionMatch.player._id.toString()
          : competitionMatch.opponent._id.toString();
      const looserId =
        competitionMatch.winner === "player"
          ? competitionMatch.opponent._id.toString()
          : competitionMatch.player._id.toString();

      ranking.get(winnerId).wins += 1;
      ranking.get(looserId).losses += 1;

      if (!ranking.get(winnerId).directWins[looserId]) {
        ranking.get(winnerId).directWins[looserId] = 0;
      }
      ranking.get(winnerId).directWins[looserId] += 1;
    });

    const rankedTrainers = Array.from(ranking.values()).map((trainer) => {
      trainer.winPercentage =
        parseFloat(
          ((trainer.wins / (trainer.wins + trainer.losses)) * 100).toFixed(1),
        ) || 0;
      return trainer;
    });

    rankedTrainers.sort((a, b) => {
      const percentageDiff = b.winPercentage - a.winPercentage;
      if (percentageDiff !== 0) {
        return percentageDiff;
      }
      const aWinsOverB = a.directWins[b._id] || 0;
      const bWinsOverA = b.directWins[a._id] || 0;
      const directWinsDiff = bWinsOverA - aWinsOverB;
      if (directWinsDiff !== 0) {
        return directWinsDiff;
      }

      const totalWinsDiff = b.wins - a.wins;
      if (totalWinsDiff !== 0) {
        return totalWinsDiff;
      }

      return a.losses - b.losses;
    });

    rankedTrainers.forEach((trainer, index) => {
      trainer.ranking = index + 1;
    });

    return rankedTrainers;
  }

  public async simulateBattle(battleId: string): Promise<void> {
    const battle = await this.battleInstanceRepository.get(battleId);
    await this.update(battleId, this.battleService.simulateBattle(battle));
  }

  public async initBattle(
    battleId: string,
  ): Promise<{ player: IBattleTrainer; opponent: IBattleTrainer }> {
    const battle = await this.battleInstanceRepository.get(battleId);
    return this.battleService.initBattle(battle);
  }

  public async update(
    _id: string,
    battle: IBattleInstance,
  ): Promise<IBattleInstance> {
    battle = await this.battleInstanceRepository.update(_id, battle);
    if (battle.competition.type === CompetitionType.TOURNAMENT) {
      const battleSeries = await this.battleSerieRepository.list({
        custom: { battles: battle._id },
      });
      if (battleSeries.length > 0) {
        const game = await this.gameRepository.get(battle.gameId);
        for (const battleSerie of battleSeries) {
          if (this.isSerieWin(battleSerie)) {
            await this.calendarEventRepository.deleteTournamentBattle(
              game.actualDate,
              battleSerie.battles.map((value) => value._id),
            );
          }
        }
      }
    }
    return battle;
  }

  public isSerieWin(battleSerie: IBattleSerie): string {
    const winMap: Map<string, number> = new Map<string, number>();

    battleSerie.battles.forEach((battle) => {
      if (battle.winner) {
        const winnerId =
          battle.winner === "player"
            ? battle.player._id.toString()
            : battle.opponent._id.toString();

        const currentWins = winMap.get(winnerId) ?? 0;
        winMap.set(winnerId, currentWins + 1);
      }
    });

    const halfMaxBattle = Math.ceil(battleSerie.maxBattle / 2);

    for (const trainerId of winMap.keys()) {
      if (winMap.get(trainerId) >= halfMaxBattle) {
        return trainerId;
      }
    }

    return undefined;
  }
}
