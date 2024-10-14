import { Component, computed, inject, input } from '@angular/core';

import {
  MoveModel,
  SIDE_EFFECT_DESC,
  SideEffect,
} from '../../models/move.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'pm-move',
  standalone: true,
  imports: [TranslateModule, MatTooltip],
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss'],
})
export class MoveComponent {
  protected readonly translateService = inject(TranslateService);
  public move = input.required<MoveModel>();
  protected description = computed(() => {
    const sideEffectDescs: string[] = [];
    if (this.move().sideEffect) {
      Object.keys(this.move().sideEffect).forEach((effect) => {
        sideEffectDescs.push(
          this.translateService.instant(
            SIDE_EFFECT_DESC[effect as SideEffect](
              this.move().sideEffect[effect as SideEffect]
            )
          )
        );
      });
    }
    return sideEffectDescs.join('\n');
  });
}
