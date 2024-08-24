import { Component, Input, OnInit } from '@angular/core';
import { PokemonBaseModel } from '../../../models/PokemonModels/pokemonBase.model';
import { PokemonQueriesService } from '../../../services/queries/pokemon-queries.service';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DisplayTypeComponent } from '../../../components/display-type/display-type.component';

@Component({
  selector: 'pm-pokemon-base-effictiveness',
  standalone: true,
  imports: [TranslateModule, DisplayTypeComponent, NgClass],
  templateUrl: './pokemon-base-effictiveness.component.html',
  styleUrl: './pokemon-base-effictiveness.component.scss',
})
export class PokemonBaseEffictivenessComponent implements OnInit {
  @Input() pokemonBase: PokemonBaseModel;
  public effectiveness: Record<string, number>;

  constructor(protected pokemonQueriesService: PokemonQueriesService) {}

  public ngOnInit(): void {
    this.pokemonQueriesService
      .getEffectiveness(this.pokemonBase.types)
      .subscribe((effectiveness) => {
        this.effectiveness = effectiveness;
      });
  }

  protected readonly Object = Object;
}
