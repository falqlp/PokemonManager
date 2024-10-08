import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  SimulateStatusModel,
  WebsocketEventService,
} from '../../../services/websocket-event.service';
import { filter, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PlayerService } from '../../../services/player.service';
import { CalendarEventQueriesService } from '../../../services/queries/calendar-event-queries.service';
import { SimulationService } from '../../../services/simulation.service';
import { RouterService } from '../../../services/router.service';

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
  private destroyRef = inject(DestroyRef);
  private websocketEventService = inject(WebsocketEventService);
  private playerService = inject(PlayerService);
  private calendarEventQueriesService = inject(CalendarEventQueriesService);
  protected simulationService = inject(SimulationService);
  protected routerService = inject(RouterService);

  protected $simulateStatus: Observable<SimulateStatusModel>;
  protected $simulating: Observable<boolean>;

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value),
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
