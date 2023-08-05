import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { PokemonModel } from '../models/PokemonModels/pokemon.model';
import type { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from './trainer-queries.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonQueriesService {
  constructor(
    protected http: HttpClient,
    protected trainerService: TrainerQueriesService
  ) {}

  public create(pokemon: PokemonModel): Observable<PokemonModel> {
    return this.http.post<PokemonModel>('api/pokemon', pokemon);
  }

  public get(id: string): Observable<PokemonModel> {
    return this.http.get<PokemonModel>('api/pokemon/' + id);
  }

  public delete(id: string): Observable<unknown> {
    return this.http.delete('api/pokemon/' + id);
  }

  public createPokemonForTrainer(
    pokemon: PokemonModel,
    trainer: TrainerModel
  ): Observable<TrainerModel> {
    return this.create(pokemon).pipe(
      tap((newPokemon) => {
        if (newPokemon) {
          trainer.pokemons.push(newPokemon);
        }
      }),
      switchMap(() => {
        return this.trainerService.updateTrainer(trainer._id, trainer);
      })
    );
  }
}
