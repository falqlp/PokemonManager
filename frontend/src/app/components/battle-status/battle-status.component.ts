import { Component, computed, Input } from '@angular/core';
import { BattleModel } from '../../models/Battle.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'pm-battle-status',
  standalone: true,
  imports: [TranslateModule, NgClass],
  templateUrl: './battle-status.component.html',
  styleUrl: './battle-status.component.scss',
})
export class BattleStatusComponent {
  @Input() public battle: BattleModel;
  @Input() public playerId: string;
  protected battleStatus = computed(() => {
    if (!this.battle.winner) {
      return '';
    }
    if (
      (this.battle.winner === 'player' &&
        this.battle.player._id === this.playerId) ||
      (this.battle.winner === 'opponent' &&
        this.battle.opponent._id === this.playerId)
    ) {
      return 'W_WIN';
    }
    return 'L_LOOSE';
  });
}
