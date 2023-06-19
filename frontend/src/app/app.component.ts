import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { PokemonModel } from './pokemon.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  protected pokemons: PokemonModel[] = [];

  constructor(protected http: HttpClient) {}
  public ngOnInit(): void {
    this.http.get<PokemonModel[]>('/api/pokemon').subscribe((res) => {
      this.pokemons = res;
    });
  }

  protected click(): void {
    console.log(this.pokemons[0]);
  }
}
