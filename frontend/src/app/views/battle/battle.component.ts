import { Component, OnInit } from '@angular/core';
import { tap, switchMap } from 'rxjs';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { TrainerQueriesService } from 'src/app/services/trainer-queries.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  protected opponent: TrainerModel;
  protected player: TrainerModel;
  protected opponentPokemons: PokemonModel[];
  protected playerPokemons: PokemonModel[];

  constructor(
    protected trainerService: TrainerQueriesService,
    protected playerService: PlayerService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        tap((player) => (this.player = player)),
        switchMap((player) => this.trainerService.getTrainerPokemon(player._id))
      )
      .subscribe((pokemons) => {
        this.playerPokemons = pokemons;
      });

    this.trainerService
      .getTrainer('6496f985f15bc10f660c1958')
      .pipe(
        tap((trainer) => (this.opponent = trainer)),
        switchMap(() =>
          this.trainerService.getTrainerPokemon('6496f985f15bc10f660c1958')
        )
      )
      .subscribe((pokemons) => {
        this.opponentPokemons = pokemons;
      });
  }

  protected changePlayerActivePokemon(pokemon: PokemonModel): void {
    this.playerPokemons = this.changePokemon(this.playerPokemons, pokemon);
  }

  protected changeOpponentActivePokemon(pokemon: PokemonModel): void {
    this.opponentPokemons = this.changePokemon(this.opponentPokemons, pokemon);
  }

  protected changePokemon(
    pokemons: PokemonModel[],
    pokemon: PokemonModel
  ): PokemonModel[] {
    pokemons[
      pokemons.findIndex((playerPokemon) => playerPokemon?._id === pokemon?._id)
    ] = pokemons[0];
    pokemons[0] = pokemon;
    return pokemons;
  }
}
