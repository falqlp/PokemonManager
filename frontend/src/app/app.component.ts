import { Component } from '@angular/core';
import type { PokemonBaseModel } from './models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected pokemonBases: PokemonBaseModel[] = [];

  protected click(): void {
    console.log(this.pokemonBases[0]);
  }

  protected onPokemonsChanged(pokemons: PokemonBaseModel[]): void {
    this.pokemonBases = pokemons;
  }
}
