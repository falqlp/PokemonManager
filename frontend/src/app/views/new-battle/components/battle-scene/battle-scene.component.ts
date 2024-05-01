import { Component, input } from '@angular/core';
import { BattleDailyFormComponent } from '../battle-daily-form/battle-daily-form.component';
import { DisplayPokemonImageComponent } from '../../../../components/display-pokemon-image/display-pokemon-image.component';
import { ProgressBarComponent } from '../../../../components/progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { BattleTrainerModel } from '../../battle.model';

@Component({
  selector: 'pm-battle-scene',
  standalone: true,
  imports: [
    BattleDailyFormComponent,
    DisplayPokemonImageComponent,
    ProgressBarComponent,
    TranslateModule,
    NgClass,
  ],
  templateUrl: './battle-scene.component.html',
  styleUrl: './battle-scene.component.scss',
})
export class BattleSceneComponent {
  public opponent = input<BattleTrainerModel>();
  public player = input<BattleTrainerModel>();
}
