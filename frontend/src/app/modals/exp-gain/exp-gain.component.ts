import { Component, Inject, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { ExperienceQueriesService } from '../../services/queries/experience-queries.service';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../generic-dialog/generic-dialog.models';
import { EvolutionComponent } from '../evolution/evolution.component';

@Component({
  selector: 'pm-exp-gain',
  standalone: true,
  imports: [
    DisplayPokemonImageComponent,
    MatButtonModule,
    MatDialogModule,
    NgClass,
    NgForOf,
    NgIf,
    ProgressBarComponent,
    TranslateModule,
  ],
  templateUrl: './exp-gain.component.html',
  styleUrls: ['./exp-gain.component.scss'],
})
export class ExpGainComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      trainer: TrainerModel;
      xpAndLevelGain: { xp: number; level: number }[];
      evolutions: {
        pokemonId: string;
        evolution: PokemonBaseModel;
        name: string;
      }[];
    },
    protected experienceQueriesService: ExperienceQueriesService,
    protected dialog: MatDialog,
    protected dialogRef: MatDialogRef<ExpGainComponent>,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    setTimeout(() => {
      this.experienceQueriesService
        .getWeeklyXp(this.data.trainer._id)
        .subscribe((result) => {
          this.data = result;
        });
    }, 500);
  }

  protected trackById(index: number, item: PokemonModel): string {
    return item._id;
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
            this.dialog.open(EvolutionComponent, { data: { evolution } });
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
