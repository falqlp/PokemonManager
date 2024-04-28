import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum NotificationType {
  Neutral = 'Neutral',
  Success = 'Success',
  Error = 'Error',
}

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(protected snackBar: MatSnackBar) {}
  public notify(msg: string, type?: NotificationType): void {
    this.snackBar.open(msg, 'Ok', {
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      duration: 3000,
      panelClass: type ?? NotificationType.Neutral,
    });
  }
}
