import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  protected pokemonBases: PokemonBaseModel[];
  protected trainerPokemon: PokemonBaseModel[];

  constructor(protected http: HttpClient, protected dialog: MatDialog) {}

  protected click(): void {
    this.dialog
      .open(PokemonFormComponent)
      .afterClosed()
      .subscribe((pokemon) => this.createPokemon(pokemon));
  }

  protected onPokemonsChanged(pokemons: PokemonBaseModel[]): void {
    this.pokemonBases = pokemons;
  }

  protected createPokemon(pokemon: PokemonModel): void {
    this.http
      .post<PokemonModel>('api/pokemon', pokemon)
      .subscribe((pokemon) => console.log(pokemon));
  }
}
