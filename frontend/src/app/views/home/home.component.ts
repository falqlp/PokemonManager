import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { PokemonQueriesService } from 'src/app/services/pokemon-queries.service';
import { TrainerQueriesService } from 'src/app/services/trainer-queries.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  protected pokemonBases: PokemonBaseModel[];
  protected trainerPokemon: PokemonModel[];
  protected player: TrainerModel;
  protected progress = 50;

  constructor(
    protected dialog: MatDialog,
    protected playerService: PlayerService,
    protected trainerService: TrainerQueriesService,
    protected pokemonService: PokemonQueriesService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$.subscribe((player) => {
      this.player = player;
      this.trainerService
        .getTrainerPokemon(this.player._id)
        .subscribe((pokemons) => {
          this.trainerPokemon = pokemons;
        });
    });
  }

  protected click(): void {
    this.dialog
      .open(PokemonFormComponent)
      .afterClosed()
      .subscribe((pokemon) =>
        pokemon ? this.createPokemon(pokemon) : undefined
      );
  }
  protected clickP(): void {
    this.progress -= 10;
  }

  protected onPokemonsChanged(pokemons: PokemonBaseModel[]): void {
    this.pokemonBases = pokemons;
  }

  protected createPokemon(pokemon: PokemonModel): void {
    this.pokemonService
      .createPokemonForTrainer(pokemon, this.player)
      .pipe(
        tap(() => {
          this.playerService.updatePlayer(this.player._id);
        })
      )
      .subscribe();
  }

  protected imgNumber(pokemon: PokemonBaseModel): string {
    return (
      'assets/images/sprites/' +
      pokemon.id.toString().padStart(3, '0') +
      'MS.png'
    );
  }
}
