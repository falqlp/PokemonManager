import { Component } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';
import { CalendarEventModel } from '../../../../models/calendar-event.model';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { PlayerService } from '../../../../services/player.service';
import { Observable } from 'rxjs';
import { TrainerModel } from '../../../../models/TrainersModels/trainer.model';
import { BattleStatusComponent } from '../../../battle-status/battle-status.component';

@Component({
  selector: 'pm-table-display-battle',
  standalone: true,
  imports: [NgForOf, NgIf, AsyncPipe, BattleStatusComponent],
  templateUrl: './table-display-battle.component.html',
  styleUrl: './table-display-battle.component.scss',
})
export class TableDisplayBattleComponent extends DynamicCellBaseDirective<CalendarEventModel> {
  constructor(protected playerService: PlayerService) {
    super();
  }

  public getPlayer(): Observable<TrainerModel> {
    return this.playerService.player$;
  }
}
