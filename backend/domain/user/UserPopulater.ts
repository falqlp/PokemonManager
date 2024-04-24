import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Game from "../game/Game";
import GamePopulater from "../game/GamePopulater";

class UserPopulater extends Populater {
  private static instance: UserPopulater;

  public static getInstance(): UserPopulater {
    if (!UserPopulater.instance) {
      UserPopulater.instance = new UserPopulater(GamePopulater.getInstance());
    }
    return UserPopulater.instance;
  }

  constructor(protected gamePopulater: GamePopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "games",
      model: Game,
      populate: this.gamePopulater.populate(),
    };
  }
}

export default UserPopulater;
