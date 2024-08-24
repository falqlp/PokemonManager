import { inject, Injectable } from '@angular/core';
import { WebsocketEventService } from './websocket-event.service';
import { AddGameComponent } from '../views/play/games/add-game/add-game.component';
import { InitGameComponent } from '../modals/init-game/init-game.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitGameService {
  private websocketEventService = inject(WebsocketEventService);
  private dialog = inject(MatDialog);
  private translateService = inject(TranslateService);

  public init(): void {
    this.websocketEventService.initGameEvent$
      .pipe(filter((value) => !!value))
      .subscribe((payload) => {
        setTimeout(() => {
          this.dialog.openDialogs
            .find(
              (value) => value.componentInstance instanceof AddGameComponent
            )
            ?.close();
          let initGameDialog = this.dialog.openDialogs.find(
            (value) => value.componentInstance instanceof InitGameComponent
          );
          if (!initGameDialog) {
            initGameDialog = this.dialog.open(InitGameComponent, {
              disableClose: true,
            });
          }
          initGameDialog.componentInstance.key = this.translateService.instant(
            payload.key,
            { value: payload.value }
          );
        });
      });
    this.websocketEventService.initGameEndEvent$.subscribe(() => {
      this.dialog.openDialogs
        .find((value) => value.componentInstance instanceof InitGameComponent)
        ?.close();
    });
  }
}
