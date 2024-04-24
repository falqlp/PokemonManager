import { Component, EventEmitter, input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene',
  templateUrl: './battle-scene.component.html',
  styleUrls: ['./battle-scene.component.scss'],
})
export class BattleSceneComponent {
  public opponentActivePokemon = input<PokemonModel>();
  public opponentDamage = input<DamageModel>();
  public playerDamage = input<DamageModel>();
  public playerActivePokemon = input<PokemonModel>();
  @Output() public battleStart = new EventEmitter<void>();
  protected started = false;

  protected onStart(): void {
    this.battleStart.emit();
    this.started = true;
  }
}
