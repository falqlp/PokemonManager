import { Component, Input, OnInit, inject } from '@angular/core';
import {
  POKEMON_NATURES,
  PokemonModel,
} from '../../models/PokemonModels/pokemon.model';
import { PlayerService } from '../../services/player.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.scss'],
  imports: [ProgressBarComponent, TranslateModule, NgClass],
})
export class PokemonStatsComponent implements OnInit {
  protected playerService = inject(PlayerService);

  @Input()
  public set pokemon(value: PokemonModel) {
    this._pokemon = value;
  }

  public get pokemon(): PokemonModel {
    return this._pokemon;
  }

  protected upAndDown: { [key: string]: string } = {
    atk: '',
    def: '',
    spAtk: '',
    spDef: '',
    spe: '',
  };

  protected _pokemon: PokemonModel;
  protected max = 0;

  public ngOnInit(): void {
    this.max = this.playerService.maxStat;
    Object.keys(this.upAndDown).forEach((key: string) => {
      if (POKEMON_NATURES[this.pokemon.nature][key] > 0) {
        this.upAndDown[key] = 'stat--up';
      } else if (POKEMON_NATURES[this.pokemon.nature][key] < 0) {
        this.upAndDown[key] = 'stat--down';
      }
    });
  }
}
