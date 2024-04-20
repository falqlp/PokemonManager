import { TrainerTestMother } from "../Trainer/TrainerTestMother";
import { IGame } from "../../../domain/game/Game";
import { ITrainer } from "../../../domain/trainer/Trainer";

export class GameTestMother {
  static basicGame(): IGame {
    const trainer: ITrainer = TrainerTestMother.weakTrainer();
    return {
      _id: "gameId",
      player: trainer,
      actualDate: new Date(),
      name: "Pokémon World",
    } as IGame;
  }

  static withCustomOptions(options: Partial<IGame>): IGame {
    return {
      ...this.basicGame(),
      ...options,
    } as IGame;
  }

  static gameWithSpecificDate(date: Date): IGame {
    const basicGame = this.basicGame();
    basicGame.actualDate = date;
    return basicGame;
  }
}
