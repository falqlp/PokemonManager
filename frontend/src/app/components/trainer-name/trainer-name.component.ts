import { Component, input } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TranslateModule } from '@ngx-translate/core';
import { BattleTrainerModel } from '../../views/battle/battle.model';

@Component({
  selector: 'pm-trainer-name',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './trainer-name.component.html',
  styleUrl: './trainer-name.component.scss',
})
export class TrainerNameComponent {
  public trainer = input<TrainerModel | BattleTrainerModel>();
}
