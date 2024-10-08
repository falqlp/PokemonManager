import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { PokemonBaseModel } from '../../../models/PokemonModels/pokemonBase.model';
import { NgClass } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../../components/display-pokemon-image/display-pokemon-image.component';
import { RouterService } from '../../../services/router.service';
import { DisplayTypeComponent } from '../../../components/display-type/display-type.component';
import { ProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonDetailsStatsComponent } from './pokemon-details-stats/pokemon-details-stats.component';
import { PokedexQueriesService } from '../../../services/queries/pokedex-queries.service';
import {
  PokedexEvolutionModel,
  PokedexMoveLearnedModel,
} from './pokedex-details.model';
import { MatIconModule } from '@angular/material/icon';
import { EvolutionTreeComponent } from './evolution-tree/evolution-tree.component';
import { PokedexMovesLearnedComponent } from './pokedex-moves-learned/pokedex-moves-learned.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PokemonBaseEffictivenessComponent } from './pokemon-base-effictiveness/pokemon-base-effictiveness.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pm-pokedex-details',
  standalone: true,
  imports: [
    DisplayPokemonImageComponent,
    DisplayTypeComponent,
    ProgressBarComponent,
    TranslateModule,
    PokemonDetailsStatsComponent,
    MatIconModule,
    EvolutionTreeComponent,
    PokedexMovesLearnedComponent,
    MatCheckboxModule,
    NgClass,
    PokemonBaseEffictivenessComponent,
  ],
  templateUrl: './pokedex-details.component.html',
  styleUrls: ['./pokedex-details.component.scss'],
})
export class PokedexDetailsComponent implements OnInit, OnChanges {
  protected pokedexQueriesService = inject(PokedexQueriesService);
  protected routerService = inject(RouterService);
  protected destroyRef = inject(DestroyRef);

  @Input('id') public pokemonId: number;
  protected pokemonBase: PokemonBaseModel;
  protected evolutions: PokedexEvolutionModel[];
  protected evolutionOf: PokedexEvolutionModel[];
  protected movesLearned: PokedexMoveLearnedModel[];

  public ngOnInit(): void {
    this.refresh();
  }

  public ngOnChanges(): void {
    this.refresh();
  }

  protected refresh(): void {
    this.pokedexQueriesService
      .get(String(this.pokemonId))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokedexDetails) => {
        this.evolutions = pokedexDetails.evolutions;
        this.evolutionOf = pokedexDetails.evolutionOf;
        this.pokemonBase = pokedexDetails.pokemonBase;
        this.routerService.setTitle(this.pokemonBase.name);
        this.movesLearned = pokedexDetails.movesLearned;
      });
  }
}
