import { TYPE_EFFECTIVENESS } from "../battle/BattleCalcService";
import { PokemonType } from "../../models/Types/Types";
import { singleton } from "tsyringe";

@singleton()
class EffectivenessService {
  public calculateEffectiveness(types: string[]): Record<string, number> {
    const effectiveness: Record<string, number> = {};
    types.forEach((type) => {
      for (const pokemonTypeKey in PokemonType) {
        if (!effectiveness[pokemonTypeKey]) {
          effectiveness[pokemonTypeKey] = 1;
        }
        effectiveness[pokemonTypeKey] *=
          TYPE_EFFECTIVENESS[pokemonTypeKey][type] ?? 1;
      }
    });
    return effectiveness;
  }
}

export default EffectivenessService;
