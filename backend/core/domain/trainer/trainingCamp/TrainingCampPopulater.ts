import Populater from "../../Populater";
import { PopulateOptions } from "mongoose";
import { singleton } from "tsyringe";

@singleton()
class TrainingCampPopulater extends Populater {
  public populate(): PopulateOptions | PopulateOptions[] {
    return "" as unknown as PopulateOptions;
  }
}

export default TrainingCampPopulater;
