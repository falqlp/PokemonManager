import Populater from "../Populater";
import { PopulateOptions } from "mongoose";

class TrainingCampPopulater extends Populater {
  private static instance: TrainingCampPopulater;

  public static getInstance(): TrainingCampPopulater {
    if (!TrainingCampPopulater.instance) {
      TrainingCampPopulater.instance = new TrainingCampPopulater();
    }
    return TrainingCampPopulater.instance;
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return "" as unknown as PopulateOptions;
  }
}

export default TrainingCampPopulater;
