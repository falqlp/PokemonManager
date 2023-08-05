import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { TrainerModel } from '../models/TrainersModels/trainer.model';
import { CompleteQuery } from './complete-query';

@Injectable({
  providedIn: 'root',
})
export class TrainerQueriesService extends CompleteQuery<TrainerModel> {
  public static readonly url = 'api/trainer';
  public constructor(protected override http: HttpClient) {
    super(TrainerQueriesService.url, http);
  }
}
