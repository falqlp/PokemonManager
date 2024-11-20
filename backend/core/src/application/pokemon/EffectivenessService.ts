import { Injectable } from '@nestjs/common';
import { PokemonType } from 'shared/models/pokemon/pokemon-models';
import { TYPE_EFFECTIVENESS } from 'shared/models/pokemon/effectiveness.const';

@Injectable()
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
