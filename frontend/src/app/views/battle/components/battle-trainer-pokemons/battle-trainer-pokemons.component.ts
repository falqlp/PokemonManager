import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { BattleTrainerModel } from '../../battle.model';

@Component({
  selector: 'app-battle-trainer-pokemons',
  templateUrl: './battle-trainer-pokemons.component.html',
  styleUrls: ['./battle-trainer-pokemons.component.scss'],
})
export class BattleTrainerPokemonsComponent {
  @Input() public set cooldown(value: number) {
    this._cooldown = value;
  }

  public get cooldown(): number {
    return this._cooldown;
  }

  @Input() public trainer: BattleTrainerModel;
  @Output() public clickOnPokemon = new EventEmitter<PokemonModel>();
  protected _cooldown: number;

  protected click(pokemon: PokemonModel): void {
    this.clickOnPokemon.emit(pokemon);
  }
}
