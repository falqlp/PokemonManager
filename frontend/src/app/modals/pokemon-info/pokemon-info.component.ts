import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { NgClass, NgForOf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { PokemonStatsComponent } from '../../components/pokemon-stats/pokemon-stats.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-pokemon-info',
  templateUrl: './pokemon-info.component.html',
  styleUrls: ['./pokemon-info.component.scss'],
  imports: [
    NgClass,
    MatDialogModule,
    DisplayPokemonImageComponent,
    TranslateModule,
    ProgressBarComponent,
    PokemonStatsComponent,
    MatButtonModule,
    NgForOf,
  ],
})
export class PokemonInfoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: PokemonModel) {}
}
