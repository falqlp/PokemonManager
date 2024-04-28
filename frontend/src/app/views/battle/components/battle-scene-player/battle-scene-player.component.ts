import { Component, input } from '@angular/core';
import { DamageModel } from '../../../../models/damage.model';
import { TranslateModule } from '@ngx-translate/core';
import { DisplayPokemonImageComponent } from '../../../../components/display-pokemon-image/display-pokemon-image.component';
import { BattleSceneMoveInfoComponent } from '../battle-scene-move-info/battle-scene-move-info.component';
import { ProgressBarComponent } from '../../../../components/progress-bar/progress-bar.component';
import { BattleDailyFormComponent } from '../battle-daily-form/battle-daily-form.component';
import { BattlePokemonModel } from '../../battle.model';

@Component({
  selector: 'app-battle-scene-player',
  templateUrl: './battle-scene-player.component.html',
  styleUrls: ['./battle-scene-player.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    DisplayPokemonImageComponent,
    BattleSceneMoveInfoComponent,
    ProgressBarComponent,
    BattleDailyFormComponent,
  ],
})
export class BattleScenePlayerComponent {
  public playerActivePokemon = input<BattlePokemonModel>();
  public playerDamage = input<DamageModel>();
}
