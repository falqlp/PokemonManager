import { Injectable, inject } from '@angular/core';
import { WebsocketEventService } from './websocket-event.service';
import { EggHatchedComponent } from '../modals/egg-hatched/egg-hatched.component';
import { MatDialog } from '@angular/material/dialog';
import { SimulationService } from './simulation.service';

@Injectable({
  providedIn: 'root',
})
export class EggHatchedService {
  private websocketEventService = inject(WebsocketEventService);
  private dialog = inject(MatDialog);
  private simulationService = inject(SimulationService);

  public init(): void {
    this.websocketEventService.eggHatchedEvent$.subscribe((payload) => {
      setTimeout(() => {
        this.dialog.open(EggHatchedComponent, {
          data: payload,
          disableClose: true,
        });
        this.simulationService.stopSimulation();
      });
    });
  }
}
