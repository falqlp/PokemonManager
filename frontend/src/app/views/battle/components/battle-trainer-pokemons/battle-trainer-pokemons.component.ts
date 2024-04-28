import { Component, input } from '@angular/core';
import { BattleTrainerModel } from '../../battle.model';
import { TrainerNameComponent } from '../../../../components/trainer-name/trainer-name.component';
import { NgClass, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../../../components/display-pokemon-image/display-pokemon-image.component';
import { ProgressBarComponent } from '../../../../components/progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { NumberCooldownComponent } from '../../../../components/number-cooldown/number-cooldown.component';
import { BattleDailyFormComponent } from '../battle-daily-form/battle-daily-form.component';

@Component({
  selector: 'app-battle-trainer-pokemons',
  templateUrl: './battle-trainer-pokemons.component.html',
  styleUrls: ['./battle-trainer-pokemons.component.scss'],
  standalone: true,
  imports: [
    TrainerNameComponent,
    NgClass,
    DisplayPokemonImageComponent,
    ProgressBarComponent,
    TranslateModule,
    NumberCooldownComponent,
    NgIf,
    BattleDailyFormComponent,
  ],
})
export class BattleTrainerPokemonsComponent {
  public cooldown = input<number>();
  public trainer = input<BattleTrainerModel>();
}
