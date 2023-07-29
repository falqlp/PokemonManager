import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { AttackModel } from 'src/app/models/attack.model';

@Component({
  selector: 'app-battle-player-attack',
  templateUrl: './battle-player-attack.component.html',
  styleUrls: ['./battle-player-attack.component.scss'],
})
export class BattlePlayerAttackComponent implements OnChanges {
  @Input() public activePokemon: PokemonModel;

  @Input() public set progress(value: number) {
    this._progress = value;
  }

  public get progress(): number {
    return this._progress;
  }

  @Input() public set selectedAttack(value: AttackModel) {
    this._selectedAttack = value;
  }

  public get selectedAttack(): AttackModel {
    return this._selectedAttack;
  }

  @Output() public onAttackChange = new EventEmitter<AttackModel>();
  protected _selectedAttack: AttackModel;
  protected _progress: number;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activePokemon']) {
      this.selectedAttack = undefined;
    }
  }
}
