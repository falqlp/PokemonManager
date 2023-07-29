import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene',
  templateUrl: './battle-scene.component.html',
  styleUrls: ['./battle-scene.component.scss'],
})
export class BattleSceneComponent {
  @Input() public opponentActivePokemon: PokemonModel;
  @Input() public playerActivePokemon: PokemonModel;
  @Input() public opponentDamage: DamageModel;
  @Input() public canStart: boolean;
  @Output() public battleStart = new EventEmitter<void>();
  protected started = false;

  protected onStart(): void {
    if (this.canStart) {
      this.battleStart.emit();
      this.started = true;
    }
  }
}
