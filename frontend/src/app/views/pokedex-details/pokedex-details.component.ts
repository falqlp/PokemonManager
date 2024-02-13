import {
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './pokedex-details.component.html',
  styleUrls: ['./pokedex-details.component.scss'],
})
export class PokedexDetailsComponent implements OnInit, OnChanges {
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
    this.refresh();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  protected refresh(): void {
    this.pokedexQueriesService
      .get(String(this.pokemonId))
      // .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokedexDetails) => {
        this.evolutions = pokedexDetails.evolutions;
        this.evolutionOf = pokedexDetails.evolutionOf;
        this.pokemonBase = pokedexDetails.pokemonBase;
        this.routerService.setTitle(this.pokemonBase.name);
      });
  }

  protected navigateToPokemon(id: number) {
    this.routerService.navigateByUrl('pokedex-details/' + id);
  }
}
