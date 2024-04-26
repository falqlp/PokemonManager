import { Component, Input } from '@angular/core';
import { DamageModel } from '../../../../models/damage.model';
import { NgClass, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-battle-scene-move-info',
  templateUrl: './battle-scene-move-info.component.html',
  styleUrls: ['./battle-scene-move-info.component.scss'],
  standalone: true,
  imports: [NgClass, TranslateModule, NgIf],
})
export class BattleSceneMoveInfoComponent {
  @Input() public damage: DamageModel;
  @Input() public up = false;
}
