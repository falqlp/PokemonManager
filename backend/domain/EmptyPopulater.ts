import Populater from "./Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
export class EmptyPopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return undefined;
  }
}
