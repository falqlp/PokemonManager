import { Injectable } from '@angular/core';
import { AttackQueriesService } from '../../services/attack-queries.service';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { AttackModel } from '../../models/attack.model';
import { DecisionModel } from './battle.model';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';

@Injectable({
  providedIn: 'root',
})
export class BattleOpponentAiService {
  protected pokemons: PokemonModel[];
  protected attacks: AttackModel[];
  public decision: DecisionModel = { attack: undefined, pokemon: undefined };
  public constructor(protected attackQueriesService: AttackQueriesService) {}

  public init(trainer: TrainerModel): void {
    this.pokemons = trainer.pokemons;
    this.attacks = this.pokemons[0].attacks;
    this.update();
  }

  protected getAttack(): void {
    this.decision.attack = this.attacks[0];
  }

  public update(): void {
    this.getAttack();
  }
}
