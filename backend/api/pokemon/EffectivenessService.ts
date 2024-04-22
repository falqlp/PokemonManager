import { TYPE_EFFECTIVENESS } from "../../application/battle/BattleCalcService";
import { PokemonType } from "../../models/Types/Types";

class EffectivenessService {
  private static instance: EffectivenessService;

  public static getInstance(): EffectivenessService {
    if (!EffectivenessService.instance) {
      EffectivenessService.instance = new EffectivenessService();
    }
    return EffectivenessService.instance;
  }

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
