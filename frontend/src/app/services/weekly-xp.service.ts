import { Injectable } from '@angular/core';
import { WebsocketEventService } from './websocket-event.service';
import { ExpGainComponent } from '../modals/exp-gain/exp-gain.component';
import { MatDialog } from '@angular/material/dialog';
import { SimulationService } from './simulation.service';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeeklyXpService {
  constructor(
    private websocketEventService: WebsocketEventService,
    private dialog: MatDialog,
    private simulationService: SimulationService
  ) {}

  public init(): void {
    this.websocketEventService.weeklyXpEvent$
      .pipe(filter((value) => !!value))
      .subscribe((payload) => {
        this.dialog.open(ExpGainComponent, {
          data: payload,
          disableClose: true,
        });
        this.simulationService.stopSimulation();
      });
  }
}
