import { Component, Input } from '@angular/core';
import { MoveModel } from '../../../../models/move.model';
import { BattleTrainerModel } from '../../battle.model';

@Component({
  selector: 'app-battle-oppenent-pokemons',
  templateUrl: './battle-opponent-pokemons.component.html',
  styleUrls: ['./battle-opponent-pokemons.component.scss'],
})
export class BattleOpponentPokemonsComponent {
  @Input() public set pokemonCooldown(value: number) {
    this._pokemonCooldown = value;
  }

  public get pokemonCooldown(): number {
    return this._pokemonCooldown;
  }

  @Input() public set moveCooldwon(value: number) {
    this._moveCooldwon = value;
  }

  public get moveCooldwon(): number {
    return this._moveCooldwon;
  }

  @Input() public trainer: BattleTrainerModel;
  @Input() public selectedMove: MoveModel;
  protected _pokemonCooldown: number;
  protected _moveCooldwon: number;
}
