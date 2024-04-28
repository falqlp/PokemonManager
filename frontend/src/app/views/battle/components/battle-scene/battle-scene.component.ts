import { Component, EventEmitter, input, Output } from '@angular/core';
import { DamageModel } from '../../../../models/damage.model';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BattleSceneOpponentComponent } from '../battle-scene-opponent/battle-scene-opponent.component';
import { BattleScenePlayerComponent } from '../battle-scene-player/battle-scene-player.component';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { BattlePokemonModel } from '../../battle.model';

@Component({
  selector: 'app-battle-scene',
  templateUrl: './battle-scene.component.html',
  styleUrls: ['./battle-scene.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    TranslateModule,
    BattleSceneOpponentComponent,
    BattleScenePlayerComponent,
    MatButtonModule,
    NgIf,
  ],
})
export class BattleSceneComponent {
  public opponentActivePokemon = input<BattlePokemonModel>();
  public opponentDamage = input<DamageModel>();
  public playerDamage = input<DamageModel>();
  public playerActivePokemon = input<BattlePokemonModel>();
  @Output() public battleStart = new EventEmitter<void>();
  protected started = false;

  protected onStart(): void {
    this.battleStart.emit();
    this.started = true;
  }
}
