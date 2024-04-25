import { Injectable } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import {
  BattleMoveModel,
  BattlePokemonModel,
  BattleTrainerModel,
} from './battle.model';

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
          (pokemon as BattlePokemonModel).currentHp = pokemon.stats['hp'];
          (pokemon as BattlePokemonModel).moves.map((move) => {
            (move as BattleMoveModel).used = false;
            return move as BattleMoveModel;
          });
          if (pokemon.moves.length === 0) {
            (pokemon as BattlePokemonModel).moves = [
              {
                type: 'NORMAL',
                category: 'physical',
                name: 'STRUGGLE',
                accuracy: 100,
                power: 10,
                used: false,
                animation: {
                  opponent: 'NORMAL',
                },
              },
            ];
          }
          return pokemon as BattlePokemonModel;
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
