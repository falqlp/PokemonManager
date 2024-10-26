import { IBattleInstance } from "../../../domain/battleInstance/Battle";
import { TrainerTestMother } from "../Trainer/TrainerTestMother";

export default class BattleTestMother {
  public static getBattleInstance(): IBattleInstance {
    return {
      _id: "battleId",
      player: TrainerTestMother.strongTrainer(),
      opponent: TrainerTestMother.weakTrainer(),
      gameId: "gameId",
      competition: undefined,
    };
  }
}
