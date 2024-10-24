import Populater from "../../Populater";
import { singleton } from "tsyringe";
import { PopulateOptions } from "mongoose";
import User from "../User";

@singleton()
export class PasswordRequestPopulater extends Populater {
  populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: "user",
      model: User,
    };
  }
}
