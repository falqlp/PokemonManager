import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  protected pokemonBases: PokemonBaseModel[];
  protected trainerPokemon: PokemonModel[];

  constructor(protected http: HttpClient, protected dialog: MatDialog) {}

  public ngOnInit(): void {
    this.http
      .get<PokemonModel[]>('api/trainer/pokemons/6496f985f15bc10f660c1958')
      .subscribe((pokemons) => {
        this.trainerPokemon = pokemons;
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
    this.http.post<PokemonModel>('api/pokemon', pokemon).subscribe((pokemon) =>
      this.http
        .put('api/trainer/6496f985f15bc10f660c1958', {
          name: 'Popole',
          pokemons: [pokemon._id],
        })
        .subscribe()
    );
  }

  protected imgNumber(pokemon: PokemonBaseModel): string {
    return (
      'assets/images/sprites/' +
      pokemon.id.toString().padStart(3, '0') +
      'MS.png'
    );
  }
}
