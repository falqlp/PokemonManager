import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

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
    protected snackBar: MatSnackBar,
    protected translateService: TranslateService
  ) {}

  public notify(msg: string, type?: NotificationType): void {
    this.snackBar.open(this.translateService.instant(msg), 'Ok', {
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      duration: 3000,
      panelClass: type ?? NotificationType.Neutral,
    });
  }
}
