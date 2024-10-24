import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";
import Populater from "../../Populater";

@singleton()
export default class CompetitionHistoryPopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return "" as unknown as PopulateOptions;
  }
}
