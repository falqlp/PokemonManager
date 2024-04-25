import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
export default class CompetitionPopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return "" as unknown as PopulateOptions;
  }
}
