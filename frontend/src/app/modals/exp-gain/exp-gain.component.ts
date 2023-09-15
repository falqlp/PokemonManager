import { Component, Inject, OnInit } from '@angular/core';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { ExperienceQueriesService } from '../../services/queries/experience-queries.service';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'pm-exp-gain',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    NgForOf,
    DisplayPokemonImageComponent,
    ProgressBarComponent,
    NgIf,
    NgClass,
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
    },
    protected experienceQueriesService: ExperienceQueriesService
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
}
