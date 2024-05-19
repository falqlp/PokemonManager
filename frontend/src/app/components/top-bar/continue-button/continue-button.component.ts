import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SimulateStatusModel,
  WebsocketEventService,
} from '../../../services/websocket-event.service';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PlayerService } from '../../../services/player.service';
import { CalendarEventQueriesService } from '../../../services/queries/calendar-event-queries.service';
import { TimeService } from '../../../services/time.service';
import { RouterService } from '../../../services/router.service';
import { BattleInstanceQueriesService } from '../../../services/queries/battle-instance-queries.service';
import { MatDialog } from '@angular/material/dialog';
import { SimulationService } from '../../../services/simulation.service';

@Component({
  selector: 'pm-continue-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    TranslateModule,
    AsyncPipe,
  ],
  templateUrl: './continue-button.component.html',
  styleUrl: './continue-button.component.scss',
})
export class ContinueButtonComponent implements OnInit {
  protected $simulateStatus: Observable<SimulateStatusModel>;
  protected $simulating: Observable<boolean>;

  constructor(
    private destroyRef: DestroyRef,
    private websocketEventService: WebsocketEventService,
    private playerService: PlayerService,
    private calendarEventQueriesService: CalendarEventQueriesService,
    private timeService: TimeService,
    private routerService: RouterService,
    private battleInstanceQueriesService: BattleInstanceQueriesService,
    private dialog: MatDialog,
    protected simulationService: SimulationService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          return this.calendarEventQueriesService.updateAskNextDay();
        })
      )
      .subscribe();
    this.$simulateStatus = this.websocketEventService.simulateStatusEvent$;
    this.$simulating = this.websocketEventService.simulatingEvent$;
  }

  protected simulate(): void {
    this.simulationService.simulate();
  }

  protected stopSimulation(): void {
    this.simulationService.stopSimulation();
  }
}
