import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  protected pokemonBases: PokemonBaseModel[] = [];

  constructor(protected http: HttpClient) {}

  protected click(): void {
    console.log(this.pokemonBases[0]);
  }

  protected onPokemonsChanged(pokemons: PokemonBaseModel[]): void {
    this.pokemonBases = pokemons;
  }
}
