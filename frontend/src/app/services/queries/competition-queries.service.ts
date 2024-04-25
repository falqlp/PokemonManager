import { Injectable } from '@angular/core';
import { ReadonlyQuery } from '../../core/readonly-query';
import { CompetitionModel } from '../../models/competition.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CompetitionQueriesService extends ReadonlyQuery<CompetitionModel> {
  public static readonly url = 'api/competition';
  constructor(http: HttpClient) {
    super(CompetitionQueriesService.url, http);
  }
}
