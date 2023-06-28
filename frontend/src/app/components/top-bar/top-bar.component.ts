import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
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
  private playerSubscription: Subscription;
  constructor(
    protected playerService: PlayerService,
    protected trainerService: TrainerQueriesService
  ) {}

  public ngOnInit(): void {
    this.player$ = this.playerService.player$;
    this.playerSubscription = this.player$.subscribe((player) => {
      this.trainerService
        .getTrainerPokemon(player._id)
        .subscribe((pokemons) => {
          this.playerPokemons = pokemons;
        });
    });
  }

  public ngOnDestroy(): void {
    if (this.playerSubscription) {
      this.playerSubscription.unsubscribe();
    }
  }

  protected imgNumber(pokemon: PokemonBaseModel): string {
    return (
      'assets/images/sprites/' +
      pokemon.id.toString().padStart(3, '0') +
      'MS.png'
    );
  }
}
