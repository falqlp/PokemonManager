import { Component, input } from '@angular/core';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../../models/damage.model';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from '../../../../components/progress-bar/progress-bar.component';
import { BattleSceneMoveInfoComponent } from '../battle-scene-move-info/battle-scene-move-info.component';
import { DisplayPokemonImageComponent } from '../../../../components/display-pokemon-image/display-pokemon-image.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-battle-scene-opponent',
  templateUrl: './battle-scene-opponent.component.html',
  styleUrls: ['./battle-scene-opponent.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ProgressBarComponent,
    BattleSceneMoveInfoComponent,
    DisplayPokemonImageComponent,
    NgIf,
  ],
})
export class BattleSceneOpponentComponent {
  public opponentActivePokemon = input<PokemonModel>();
  public opponentDamage = input<DamageModel>();
}
