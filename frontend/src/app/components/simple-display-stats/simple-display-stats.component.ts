import { Component, inject } from '@angular/core';
import { PokemonStatsComponent } from '../pokemon-stats/pokemon-stats.component';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../services/player.service';
import { ColorService } from '../../services/color.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'pm-simple-display-stats',
  standalone: true,
  imports: [TranslateModule, NgStyle],
  templateUrl: './simple-display-stats.component.html',
  styleUrl: './simple-display-stats.component.scss',
})
export class SimpleDisplayStatsComponent extends PokemonStatsComponent {
  protected colorService = inject(ColorService);

  protected colorStats: Record<string, string> = {};
  constructor() {
    const playerService = inject(PlayerService);

    super(playerService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.playerService.maxStat$.pipe().subscribe((max) => {
      for (const statsKey in this.pokemon.stats) {
        if (statsKey === 'hp') {
          this.colorStats[statsKey] = this.colorService.hpPourcentToRGB(
            (100 * (this.pokemon.stats[statsKey] - this.pokemon.level - 5)) /
              max
          );
        } else {
          this.colorStats[statsKey] = this.colorService.hpPourcentToRGB(
            (100 * this.pokemon.stats[statsKey]) / max
          );
        }
      }
    });
  }
}
