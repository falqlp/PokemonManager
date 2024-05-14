import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  NotificationModel,
  WebsocketEventService,
} from './websocket-event.service';

export enum NotificationType {
  Neutral = 'Neutral',
  Success = 'Success',
  Error = 'Error',
}

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService,
    private websocketEventService: WebsocketEventService
  ) {
    this.websocketEventService.notifyEvent$.subscribe(this.notify);
  }

  public notify(notification: NotificationModel): void {
    this.snackBar.open(this.translateService.instant(notification.key), 'Ok', {
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      duration: 3000,
      panelClass: notification.type ?? NotificationType.Neutral,
    });
  }
}
