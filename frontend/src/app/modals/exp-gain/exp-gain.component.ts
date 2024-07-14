import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgClass, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../generic-dialog/generic-dialog.models';
import { EvolutionComponent } from '../evolution/evolution.component';
import { WeeklyXpModel } from '../../services/websocket-event.service';

@Component({
  selector: 'pm-exp-gain',
  standalone: true,
  imports: [
    DisplayPokemonImageComponent,
    MatButtonModule,
    MatDialogModule,
    NgClass,
    NgIf,
    ProgressBarComponent,
    TranslateModule,
  ],
  templateUrl: './exp-gain.component.html',
  styleUrls: ['./exp-gain.component.scss'],
})
export class ExpGainComponent implements OnInit {
  protected xpData: WeeklyXpModel;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: WeeklyXpModel,
    protected dialog: MatDialog,
    protected dialogRef: MatDialogRef<ExpGainComponent>,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.xpData = { trainer: this.data.oldPlayer };
    setTimeout(() => {
      this.xpData = this.data;
    }, 1000);
  }

  protected close(): void {
    this.data.evolutions.forEach((evolution) => {
      const buttons: DialogButtonsModel[] = [
        {
          label: 'CANCEL',
          close: true,
          color: 'primary',
        },
        {
          label: 'EVOLVE',
          close: true,
          color: 'warn',
          click: (): void => {
            this.dialog.open(EvolutionComponent, {
              data: { evolution },
              disableClose: true,
            });
          },
        },
      ];
      this.dialog.open(GenericDialogComponent, {
        data: {
          buttons,
          message: this.translateService.instant('POKEMON_GOING_TO_EVOLVE', {
            evolving: this.translateService.instant(evolution.name),
          }),
        },
      });
    });
    this.dialogRef.close();
  }
}
