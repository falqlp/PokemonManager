import { Injectable } from '@angular/core';
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
      pokemons: trainer.pokemons
        .filter((value) => value.level > 0)
        .map((pokemon) => {
          if (pokemon.moves.length === 0) {
            pokemon.moves = [
              {
                type: 'NORMAL',
                category: 'physical',
                name: 'STRUGGLE',
                accuracy: 100,
                power: 10,
                animation: {
                  opponent: 'NORMAL',
                },
              },
            ];
          }
          return pokemon;
        }),
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
