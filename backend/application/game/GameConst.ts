import { RangeModel } from "../../models/RangeModel";

export const NB_GENERATED_TRAINER_BY_DIVISION = 20;
export const NB_DIVISION = 3;
export const START_DIVISION = 3;
export const DIVISION_POKEMON_RANGE_RECORD: Record<
  number,
  { levelRange: RangeModel; quantityRange: RangeModel }
> = {
  1: {
    levelRange: { max: 20, min: 15 },
    quantityRange: { max: 6, min: 4 },
  },
  2: {
    levelRange: { max: 16, min: 11 },
    quantityRange: { max: 5, min: 3 },
  },
  3: {
    quantityRange: { max: 4, min: 2 },
    levelRange: { max: 13, min: 8 },
  },
};
