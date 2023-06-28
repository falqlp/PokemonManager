import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
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

  constructor(
    protected http: HttpClient,
    protected dialog: MatDialog,
    protected playerService: PlayerService,
    protected trainerService: TrainerQueriesService
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

  protected onPokemonsChanged(pokemons: PokemonBaseModel[]): void {
    this.pokemonBases = pokemons;
  }

  protected createPokemon(pokemon: PokemonModel): void {
    this.http
      .post<PokemonModel>('api/pokemon', pokemon)
      .subscribe((pokemon) => {
        if (pokemon._id) {
          this.player.pokemons.push(pokemon._id);
          this.trainerService
            .updateTrainer(this.player._id, this.player)
            .subscribe(() => {
              this.playerService.updatePlayer(this.player._id);
            });
        }
      });
  }

  protected imgNumber(pokemon: PokemonBaseModel): string {
    return (
      'assets/images/sprites/' +
      pokemon.id.toString().padStart(3, '0') +
      'MS.png'
    );
  }
}
