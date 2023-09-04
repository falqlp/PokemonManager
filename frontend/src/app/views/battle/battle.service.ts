import { Injectable } from '@angular/core';
import type { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { BattleTrainerModel } from './battle.model';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  public mapBattleTrainer(trainer: TrainerModel): BattleTrainerModel {
    return {
      _id: trainer._id,
      name: trainer.name,
      pokemons: trainer.pokemons,
      selectedMove: undefined,
      damage: undefined,
      decision: undefined,
      updateDecision: true,
      autorizations: {
        pokemonCooldown: 0,
        moveCooldown: 0,
        updateCooldown: 0,
      },
      defeat: false,
      onKo: false,
    };
  }
}
