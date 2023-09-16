import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { Observable, tap } from 'rxjs';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PlayerService } from '../../services/player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pm-evolution',
  standalone: true,
  imports: [MatDialogModule, NgIf, MatButtonModule, TranslateModule, AsyncPipe],
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss'],
})
export class EvolutionComponent implements OnInit {
  protected pokemon: PokemonModel;
  protected message: string;
  public constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      evolution: {
        pokemonId: string;
        evolution: PokemonBaseModel;
        name: string;
      };
    },
    protected pokemonQueriesService: PokemonQueriesService,
    protected translateService: TranslateService,
    protected playerService: PlayerService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.pokemonQueriesService
      .get(this.data.evolution.pokemonId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pokemon) => {
        this.pokemon = pokemon;
      });
    setTimeout(() => {
      this.message = this.translateService.instant('CONGRAT_POKEMON_EVOLVED', {
        evolving: this.translateService.instant(this.data.evolution.name),
        evolved: this.translateService.instant(
          this.data.evolution.evolution.name
        ),
      });
      this.pokemon.basePokemon = this.data.evolution.evolution;
      this.pokemonQueriesService
        .update(this.pokemon, this.pokemon._id)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => {
            this.playerService.updatePlayer();
          })
        )
        .subscribe();
    }, 5000);
  }
}
