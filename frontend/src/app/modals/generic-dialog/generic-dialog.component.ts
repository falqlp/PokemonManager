import { Component, inject } from '@angular/core';
import { DialogButtonsModel } from './generic-dialog.models';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pm-generic-dialog',
  standalone: true,
  imports: [MatDialogModule, TranslateModule, MatButtonModule],
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss'],
})
export class GenericDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  protected dialogRef =
    inject<MatDialogRef<GenericDialogComponent>>(MatDialogRef);

  protected click(button: DialogButtonsModel): void {
    if (button.click) {
      button.click();
    }
    if (button.close) {
      this.dialogRef.close(button.label);
    }
  }
}
