import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { PartyModel } from '../../models/party.model';
import { Observable } from 'rxjs';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';

@Injectable({
  providedIn: 'root',
})
export class PartyQueriesService extends CompleteQuery<PartyModel> {
  public static readonly url = 'api/party';
  public constructor(protected override http: HttpClient) {
    super(PartyQueriesService.url, http);
  }

  public getPlayer(partyId: string): Observable<TrainerModel> {
    return this.http.get<TrainerModel>(
      PartyQueriesService.url + '/player/' + partyId
    );
  }

  public getTime(partyId: string): Observable<Date> {
    return this.http.get<Date>(PartyQueriesService.url + '/time/' + partyId);
  }
}
