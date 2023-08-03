import { Component, Input } from '@angular/core';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene-move-info',
  templateUrl: './battle-scene-move-info.component.html',
  styleUrls: ['./battle-scene-move-info.component.scss'],
})
export class BattleSceneMoveInfoComponent {
  @Input() public damage: DamageModel;
  @Input() public up = false;
}
