import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { Observable } from 'rxjs';
import { DamageModel } from '../../models/damage.model';
import {
  BattleTrainerModel,
  BattleTurnModel,
  DecisionModel,
} from './battle.model';

@Injectable({
  providedIn: 'root',
})
export class BattleQueriesService {
  public readonly calcDamageUrl = 'api/battle/calcDamage';
  public readonly decisionMakingUrl = 'api/battle/decisionMaking';
  public readonly simulateTurnUrl = 'api/battle/simulateBattleTurn';
  public constructor(protected http: HttpClient) {}

  public calcDamage(
    attPokemon: PokemonModel,
    defPokemon: PokemonModel,
    move: MoveModel
  ): Observable<{ damage: DamageModel; pokemon: PokemonModel }> {
    return this.http.post<{ damage: DamageModel; pokemon: PokemonModel }>(
      this.calcDamageUrl,
      {
        attPokemon,
        defPokemon,
        move,
      }
    );
  }

  public decisionMaking(
    opponentPokemon: PokemonModel,
    selectedMove: MoveModel,
    pokemons: PokemonModel[]
  ): Observable<DecisionModel> {
    return this.http.post<DecisionModel>(this.decisionMakingUrl, {
      opponentPokemon,
      selectedMove,
      pokemons,
    });
  }

  public simulateTurn(
    battleTrainer1: BattleTrainerModel,
    battleTrainer2: BattleTrainerModel
  ): Observable<BattleTurnModel> {
    return this.http.post<BattleTurnModel>(this.simulateTurnUrl, {
      trainer1: battleTrainer1,
      trainer2: battleTrainer2,
    });
  }
}
