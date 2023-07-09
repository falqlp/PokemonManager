import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { PokemonModel } from '../models/PokemonModels/pokemon.model';
import type { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from './trainer-queries.service';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonQueriesService {
  constructor(
    protected http: HttpClient,
    protected trainerService: TrainerQueriesService,
    protected playerService: PlayerService
  ) {}

  public create(pokemon: PokemonModel): Observable<PokemonModel> {
    return this.http.post<PokemonModel>('api/pokemon', pokemon);
  }

  public createPokemonForTrainer(
    pokemon: PokemonModel,
    trainer: TrainerModel
  ): Observable<TrainerModel> {
    return this.create(pokemon).pipe(
      tap((newPokemon) => {
        if (newPokemon._id) {
          trainer.pokemons.push(newPokemon._id);
        }
      }),
      switchMap(() => {
        return this.trainerService.updateTrainer(trainer._id, trainer);
      })
    );
  }
}
