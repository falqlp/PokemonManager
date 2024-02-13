import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { RouterService } from '../../services/router.service';
import { DisplayTypeComponent } from '../../components/display-type/display-type.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonDetailsStatsComponent } from './pokemon-details-stats/pokemon-details-stats.component';
import { PokedexQueriesService } from '../../services/queries/pokedex-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokedexEvolutionModel } from './pokedex-details.model';

@Component({
  selector: 'pm-pokedex-details',
  standalone: true,
  imports: [
    NgIf,
    DisplayPokemonImageComponent,
    DisplayTypeComponent,
    ProgressBarComponent,
    TranslateModule,
    PokemonDetailsStatsComponent,
    NgForOf,
  ],
  templateUrl: './pokedex-details.component.html',
  styleUrls: ['./pokedex-details.component.scss'],
})
export class PokedexDetailsComponent implements OnInit {
  @Input('id') public pokemonId: number;
  protected destroyRef: DestroyRef;
  protected pokemonBase: PokemonBaseModel;
  protected evolutions: PokedexEvolutionModel[];
  protected evolutionOf: PokedexEvolutionModel[];

  constructor(
    protected pokedexQueriesService: PokedexQueriesService,
    protected routerService: RouterService
  ) {}

  public ngOnInit(): void {
    console.log('pokemonId', this.pokemonId);
    this.pokedexQueriesService
      .get(String(this.pokemonId))
      // .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokedexDetails) => {
        console.log(pokedexDetails);
        this.evolutions = pokedexDetails.evolutions;
        this.evolutionOf = pokedexDetails.evolutionOf;
        this.pokemonBase = pokedexDetails.pokemonBase;
        this.routerService.setTitle(this.pokemonBase.name);
      });
  }
}
