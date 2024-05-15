import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { CompleteQuery } from '../../core/complete-query';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainerQueriesService extends CompleteQuery<TrainerModel> {
  public static readonly url = 'api/trainer';
  public constructor(protected override http: HttpClient) {
    super(TrainerQueriesService.url, http);
  }

  public getPlayer(trainerId: string): Observable<TrainerModel> {
    return this.http.get<TrainerModel>(this.url + '/player/' + trainerId);
  }
}
