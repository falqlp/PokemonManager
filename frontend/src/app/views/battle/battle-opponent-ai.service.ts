import { Injectable } from '@angular/core';
import { AttackQueriesService } from '../../services/attack-queries.service';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { AttackModel } from '../../models/attack.model';

@Injectable({
  providedIn: 'root',
})
export class BattleOpponentAiService {
  protected pokemons: PokemonModel[];
  protected attacks: AttackModel[];
  public constructor(protected attackQueriesService: AttackQueriesService) {}

  public init(pokemons: PokemonModel[]): void {
    this.pokemons = pokemons;
    this.attackQueriesService
      .getAttacks(this.pokemons[0].attacks)
      .subscribe((attacks) => {
        this.attacks = attacks;
      });
  }

  public getAttack(): AttackModel {
    return this.attacks[0] ? this.attacks[0] : undefined;
  }
}
