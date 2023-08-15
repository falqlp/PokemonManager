import { Component, Input } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.component.html',
  styleUrls: ['./pokemon-stats.component.scss'],
})
export class PokemonStatsComponent {
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
