import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { Observable } from 'rxjs';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class TrainerQueriesService extends ReadonlyQuery<TrainerModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/trainer';
  public constructor() {
    const http = inject(HttpClient);

    super(TrainerQueriesService.url, http);
    this.http = http;
  }

  public getPlayer(trainerId: string): Observable<TrainerModel> {
    return this.http.get<TrainerModel>(this.url + '/player/' + trainerId);
  }

  public updatePcPosition(
    trainerId: string,
    teamPositions: string[],
    pcPositions: string[]
  ): Observable<void> {
    return this.http.put<void>(this.url + '/update-pc-positions', {
      trainerId,
      teamPositions,
      pcPositions,
    });
  }
}
