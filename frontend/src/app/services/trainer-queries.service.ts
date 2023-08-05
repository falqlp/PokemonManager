import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';

@Injectable({
  providedIn: 'root',
})
export class TrainerQueriesService {
  public constructor(protected http: HttpClient) {}

  public getTrainer(id: string): Observable<TrainerModel> {
    return this.http.get<TrainerModel>('api/trainer/' + id);
  }

  public getTrainers(): Observable<TrainerModel[]> {
    return this.http.get<TrainerModel[]>('api/trainer');
  }

  public list(ids: string[]): Observable<TrainerModel[]> {
    return this.http.put<TrainerModel[]>('api/trainer', ids);
  }

  public updateTrainer(
    id: string,
    trainer: TrainerModel
  ): Observable<TrainerModel> {
    return this.http.put<TrainerModel>('api/trainer/' + id, trainer);
  }
}
