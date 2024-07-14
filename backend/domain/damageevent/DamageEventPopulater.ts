import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
export default class DamageEventPopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }
}
