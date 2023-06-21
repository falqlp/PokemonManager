import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { PokemonBaseModel } from './pokemon.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  protected pokemonBases: PokemonBaseModel[] = [];

  constructor(protected http: HttpClient) {}
  public ngOnInit(): void {
    this.http.get<PokemonBaseModel[]>('/api/pokemonBase').subscribe((res) => {
      this.pokemonBases = res;
    });
  }

  protected click(): void {
    console.log(this.pokemonBases[0]);
  }
}
