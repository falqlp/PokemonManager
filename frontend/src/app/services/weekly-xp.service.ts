import { Injectable, inject } from '@angular/core';
import { WebsocketEventService } from './websocket-event.service';
import { ExpGainComponent } from '../modals/exp-gain/exp-gain.component';
import { MatDialog } from '@angular/material/dialog';
import { SimulationService } from './simulation.service';

@Injectable({
  providedIn: 'root',
})
export class WeeklyXpService {
  private websocketEventService = inject(WebsocketEventService);
  private dialog = inject(MatDialog);
  private simulationService = inject(SimulationService);

  public init(): void {
    this.websocketEventService.weeklyXpEvent$.subscribe((payload) => {
      this.dialog.open(ExpGainComponent, {
        data: payload,
        disableClose: true,
      });
      this.simulationService.stopSimulation();
    });
  }
}
