import Populater from "../Populater";
import { PopulateOptions } from "mongoose";

class MovePopulater extends Populater {
  private static instance: MovePopulater;

  public static getInstance(): MovePopulater {
    if (!MovePopulater.instance) {
      MovePopulater.instance = new MovePopulater();
    }
    return MovePopulater.instance;
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }
}

export default MovePopulater;
