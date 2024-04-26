import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  constructor(protected snackBar: MatSnackBar) {}
  public notify(msg: string): void {
    this.snackBar.open(msg, 'Ok', {
      verticalPosition: 'bottom',
      horizontalPosition: 'left',
      duration: 3000,
    });
  }
}
