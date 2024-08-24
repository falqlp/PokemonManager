import { Component, Input } from '@angular/core';
import { ProgressBarComponent } from '../../../../components/progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import type { PokemonStatsModel } from '../../../../models/PokemonModels/pokemonStats.model';

@Component({
  selector: 'pm-pokemon-details-stats',
  standalone: true,
  imports: [ProgressBarComponent, TranslateModule],
  templateUrl: './pokemon-details-stats.component.html',
  styleUrls: ['./pokemon-details-stats.component.scss'],
})
export class PokemonDetailsStatsComponent {
  @Input() public baseStats: PokemonStatsModel;
}
