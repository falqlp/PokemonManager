import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PlayerService } from '../../services/player.service';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'pm-pokemon-stats-radar',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './pokemon-stats-radar.component.html',
  styleUrl: './pokemon-stats-radar.component.scss',
})
export class PokemonStatsRadarComponent {
  public pokemon = input<PokemonModel>();
  protected option = computed<EChartsOption>(() => {
    return {
      darkMode: true,
      tooltip: {
        trigger: 'item',
      },
      radar: {
        indicator: [
          {
            name: this.translateService.instant('HP'),
            max: this.playerService.maxStat + this.pokemon().level + 5,
          },
          {
            name: this.translateService.instant('ATTACK'),
            max: this.playerService.maxStat,
            color: this.colorService.getNatureColor(this.pokemon(), 'atk'),
          },
          {
            name: this.translateService.instant('DEFENSE'),
            max: this.playerService.maxStat,
            color: this.colorService.getNatureColor(this.pokemon(), 'def'),
          },
          {
            name: this.translateService.instant('SPEED'),
            max: this.playerService.maxStat,
            color: this.colorService.getNatureColor(this.pokemon(), 'spe'),
          },
          {
            name: this.translateService.instant('SPECIAL_DEFENSE'),
            max: this.playerService.maxStat,
            color: this.colorService.getNatureColor(this.pokemon(), 'spDef'),
          },
          {
            name: this.translateService.instant('SPECIAL_ATTACK'),
            max: this.playerService.maxStat,
            color: this.colorService.getNatureColor(this.pokemon(), 'spAtk'),
          },
        ],
      },
      series: [
        {
          areaStyle: {},
          symbol: 'none',
          type: 'radar',
          color: this.colorService.getColorByType(
            this.pokemon().basePokemon.types.at(0)
          ),
          data: [
            {
              name:
                this.pokemon().nickname ??
                this.translateService.instant(this.pokemon().basePokemon.name),
              value: [
                this.pokemon().stats['hp'],
                this.pokemon().stats['atk'],
                this.pokemon().stats['def'],
                this.pokemon().stats['spe'],
                this.pokemon().stats['spDef'],
                this.pokemon().stats['spAtk'],
              ],
            },
          ],
        },
      ],
    };
  });

  constructor(
    protected translateService: TranslateService,
    protected playerService: PlayerService,
    protected colorService: ColorService
  ) {}
}
