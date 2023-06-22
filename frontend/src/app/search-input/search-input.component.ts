import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { PokemonBaseModel } from '../pokemon.model';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
  @Output() pokemonsChanged = new EventEmitter<PokemonBaseModel[]>();

  protected pokemons: PokemonBaseModel[];
  protected searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query: string) => {
          if (!query) {
            this.pokemonsChanged.emit([]);
          }
        }),
        filter((query: string) => !!query.trim()),
        switchMap((query: string) =>
          this.http.get<PokemonBaseModel[]>(`/api/pokemonBase/search/${query}`)
        )
      )
      .subscribe((response: PokemonBaseModel[]) => {
        this.pokemonsChanged.emit(response);
      });
  }

  search(event: KeyboardEvent): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }
}
