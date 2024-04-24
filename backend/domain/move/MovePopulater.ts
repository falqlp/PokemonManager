import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
class MovePopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }
}

export default MovePopulater;
