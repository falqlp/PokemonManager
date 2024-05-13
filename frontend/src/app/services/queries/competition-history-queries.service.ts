import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompetitionHistoryModel } from '../../models/competition-history.model';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class CompetitionHistoryQueriesService extends ReadonlyQuery<CompetitionHistoryModel> {
  public static readonly url = 'api/competition-history';
  constructor(protected override http: HttpClient) {
    super(CompetitionHistoryQueriesService.url, http);
  }
}
