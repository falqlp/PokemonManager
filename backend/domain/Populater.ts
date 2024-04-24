import { PopulateOptions } from "mongoose";

export default abstract class Populater {
  public abstract populate(): PopulateOptions | PopulateOptions[];
}
