import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
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
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../generic-dialog/generic-dialog.models';
import { EvolutionComponent } from '../evolution/evolution.component';
import { PlayerService } from '../../services/player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, first } from 'rxjs';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';

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
  protected xpData: {
    trainer: TrainerModel;
    xpAndLevelGain?: { xp: number; level: number }[];
    evolutions?: {
      pokemonId: string;
      evolution: PokemonBaseModel;
      name: string;
    }[];
  };

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      trainer: TrainerModel;
      xpAndLevelGain?: { xp: number; level: number }[];
      evolutions?: {
        pokemonId: string;
        evolution: PokemonBaseModel;
        name: string;
      }[];
    },
    protected dialog: MatDialog,
    protected dialogRef: MatDialogRef<ExpGainComponent>,
    protected translateService: TranslateService,
    protected playerService: PlayerService,
    protected destroyRef: DestroyRef,
    protected trainerQueriesService: TrainerQueriesService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        filter((trainer) => !!trainer),
        first(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((player) => {
        this.xpData = { trainer: player };
        setTimeout(() => {
          this.xpData = this.data;
          this.trainerQueriesService
            .update(this.data.trainer, this.data.trainer._id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }, 1000);
      });
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
