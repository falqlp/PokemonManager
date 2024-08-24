import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadonlyQuery } from '../../core/readonly-query';
import { MoveModel } from '../../models/move.model';

@Injectable({
  providedIn: 'root',
})
export class MoveQueriesService extends ReadonlyQuery<MoveModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/move';
  public constructor() {
    const http = inject(HttpClient);

    super(MoveQueriesService.url, http);
    this.http = http;
  }
}
