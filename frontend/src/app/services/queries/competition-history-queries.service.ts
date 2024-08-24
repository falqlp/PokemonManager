import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CompetitionHistoryModel } from '../../models/competition-history.model';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class CompetitionHistoryQueriesService extends ReadonlyQuery<CompetitionHistoryModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/competition-history';
  constructor() {
    const http = inject(HttpClient);

    super(CompetitionHistoryQueriesService.url, http);
    this.http = http;
  }
}
