import { Component, Inject } from '@angular/core';
import { DialogButtonsModel } from './generic-dialog.models';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'pm-generic-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslateModule, MatButtonModule, NgIf, NgForOf],
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss'],
})
export class GenericDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      buttons: DialogButtonsModel[];
    },
    protected dialogRef: MatDialogRef<GenericDialogComponent>
  ) {}

  protected click(callback: () => void, close: boolean): void {
    if (callback) {
      callback();
    }
    if (close) {
      this.dialogRef.close();
    }
  }
}
