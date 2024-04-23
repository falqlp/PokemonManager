import { IMove } from "../../domain/move/Move";
import { PokemonType } from "../../models/Types/Types";

export const DefaultMove: IMove = {
  _id: "64b0026d3ca816e9336d9274",
  name: "STRUGGLE",
  accuracy: null,
  category: "physical",
  id: 165,
  power: 50,
  type: PokemonType.NORMAL,
  animation: {
    opponent: "NORMAL",
  },
};
