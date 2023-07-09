import { HttpClient } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import type { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {
  @Output() public pokemonsChanged = new EventEmitter<PokemonBaseModel[]>();

  protected searchSubject = new Subject<string>();

  public constructor(private http: HttpClient) {}

  public ngOnInit(): void {
    this.searchPokemon();
  }

  protected inputType(event: KeyboardEvent): void {
    this.searchSubject.next((event.target as HTMLInputElement).value);
  }

  protected searchPokemon(): void {
    this.searchSubject
      .pipe(
        debounceTime(200),
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
}
