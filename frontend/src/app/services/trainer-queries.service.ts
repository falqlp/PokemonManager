import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainerModel } from '../models/TrainersModels/trainer.model';
import { PokemonModel } from '../models/PokemonModels/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class TrainerQueriesService {
  constructor(protected http: HttpClient) {}

  public getTrainer(id: string): Observable<TrainerModel> {
    return this.http.get<TrainerModel>('api/trainer/' + id);
  }

  public getTrainers(): Observable<TrainerModel[]> {
    return this.http.get<TrainerModel[]>('api/trainer');
  }

  public getTrainerPokemon(id: string): Observable<PokemonModel[]> {
    return this.http.get<PokemonModel[]>('api/trainer/pokemons/' + id);
  }

  public updateTrainer(
    id: string,
    trainer: TrainerModel
  ): Observable<TrainerModel> {
    return this.http.put<TrainerModel>('api/trainer/' + id, trainer);
  }
}
