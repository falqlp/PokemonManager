import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogButtonsModel } from './generic-dialog.models';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pm-generic-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, MatButtonModule],
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
    }
  ) {}
}
