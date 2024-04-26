import { singleton } from "tsyringe";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import { ObjectId } from "mongodb";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import BattleService from "../battle/BattleService";

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
      return bWinsOverA - aWinsOverB;
    });

    rankedTrainers.forEach((trainer, index) => {
      trainer.ranking = index + 1;
    });

    return rankedTrainers;
  }

  public async simulateBattle(battleId: string): Promise<void> {
    const battle = await this.battleInstanceRepository.get(battleId);
    await this.battleInstanceRepository.update(
      battleId,
      this.battleService.simulateBattle(battle),
    );
  }
}
