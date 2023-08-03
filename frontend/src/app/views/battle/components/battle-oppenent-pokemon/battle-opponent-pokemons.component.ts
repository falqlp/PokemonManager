import { Component, Input } from '@angular/core';
import { MoveModel } from '../../../../models/move.model';
import { BattleTrainer } from '../../battle-trainer';

@Component({
  selector: 'app-battle-oppenent-pokemons',
  templateUrl: './battle-opponent-pokemons.component.html',
  styleUrls: ['./battle-opponent-pokemons.component.scss'],
})
export class BattleOpponentPokemonsComponent {
  @Input() public set pokemonProgress(value: number) {
    this._pokemonProgress = value;
  }

  public get pokemonProgress(): number {
    return this._pokemonProgress;
  }

  @Input() public set moveProgress(value: number) {
    this._moveProgress = value;
  }

  public get moveProgress(): number {
    return this._moveProgress;
  }

  @Input() public trainer: BattleTrainer;
  @Input() public selectedMove: MoveModel;
  protected _pokemonProgress: number;
  protected _moveProgress: number;
}
