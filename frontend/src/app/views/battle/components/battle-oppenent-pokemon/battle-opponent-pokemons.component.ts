import { Component, Input } from '@angular/core';
import { AttackModel } from '../../../../models/attack.model';
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

  @Input() public set attackProgress(value: number) {
    this._attackProgress = value;
  }

  public get attackProgress(): number {
    return this._attackProgress;
  }

  @Input() public trainer: BattleTrainer;
  @Input() public selectedAttack: AttackModel;
  protected _pokemonProgress: number;
  protected _attackProgress: number;
}
