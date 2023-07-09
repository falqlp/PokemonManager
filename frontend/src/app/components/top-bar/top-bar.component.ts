import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { PokemonInfoComponent } from 'src/app/modals/pokemon-info/pokemon-info.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { TrainerQueriesService } from 'src/app/services/trainer-queries.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  protected player$: Observable<TrainerModel>;
  protected playerPokemons: PokemonModel[];
  private destroy$ = new Subject<void>();

  constructor(
    protected playerService: PlayerService,
    protected trainerService: TrainerQueriesService,
    protected dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.player$ = this.playerService.player$;
    this.player$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((player) => this.trainerService.getTrainerPokemon(player._id))
      )
      .subscribe((pokemons) => {
        this.playerPokemons = pokemons;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected openInfo(pokemon: PokemonModel): void {
    this.dialog.open(PokemonInfoComponent, { data: pokemon });
  }
}
