import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { AttackModel } from 'src/app/models/attack.model';
import { BattleService } from '../../battle.service';

@Component({
  selector: 'app-battle-attack',
  templateUrl: './battle-attack.component.html',
  styleUrls: ['./battle-attack.component.scss'],
})
export class BattleAttackComponent implements OnChanges {
  @Input() public activePokemon: PokemonModel;
  @Input() public set disabled(value: boolean) {
    this._disabled = value;
  }

  public get disabled(): boolean {
    return this._disabled;
  }

  @Input() public set progress(value: number) {
    this._progress = value;
  }

  public get progress(): number {
    return this._progress;
  }

  @Output() public onAttackChange = new EventEmitter<AttackModel>();
  protected selectedAttack: AttackModel;
  protected _disabled: boolean;
  protected _progress: number;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activePokemon']) {
      this.selectedAttack = undefined;
      this.onAttackChange.emit(this.selectedAttack);
    }
  }

  protected onClick(attack: AttackModel): void {
    this.selectedAttack = attack;
    this.onAttackChange.emit(this.selectedAttack);
  }
}
