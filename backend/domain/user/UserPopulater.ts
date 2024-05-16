import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Game from "../game/Game";
import GamePopulater from "../game/GamePopulater";
import { singleton } from "tsyringe";
import User from "./User";

@singleton()
class UserPopulater extends Populater {
  constructor(protected gamePopulater: GamePopulater) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: "games",
        model: Game,
        populate: this.gamePopulater.populate(),
      },
      {
        path: "friends",
        model: User,
      },
      {
        path: "friendRequest",
        model: User,
      },
    ];
  }
}

export default UserPopulater;
