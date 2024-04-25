import { Component, Input, OnInit } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PlayerService } from '../../services/player.service';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.scss'],
  imports: [ProgressBarComponent, TranslateModule],
})
export class PokemonStatsComponent implements OnInit {
  @Input()
  public set pokemon(value: PokemonModel) {
    this._pokemon = value;
  }

  public get pokemon(): PokemonModel {
    return this._pokemon;
  }

  protected _pokemon: PokemonModel;
  protected max = 0;

  public constructor(protected playerService: PlayerService) {}

  public ngOnInit(): void {
    this.max = this.playerService.maxStat;
  }
}
