import { Component, Input } from '@angular/core';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene-attack-info',
  templateUrl: './battle-scene-attack-info.component.html',
  styleUrls: ['./battle-scene-attack-info.component.scss'],
})
export class BattleSceneAttackInfoComponent {
  @Input() public damage: DamageModel;
  @Input() public up = false;
}
