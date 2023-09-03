import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { BattleTrainerModel } from '../../battle.model';

@Component({
  selector: 'app-battle-trainer-pokemons',
  templateUrl: './battle-trainer-pokemons.component.html',
  styleUrls: ['./battle-trainer-pokemons.component.scss'],
})
export class BattleTrainerPokemonsComponent {
  @Input() public set progress(value: number) {
    this._progress = value;
  }

  public get progress(): number {
    return this._progress;
  }

  @Input() public trainer: BattleTrainerModel;
  @Output() public clickOnPokemon = new EventEmitter<PokemonModel>();
  protected _progress: number;

  protected click(pokemon: PokemonModel): void {
    this.clickOnPokemon.emit(pokemon);
  }
}
