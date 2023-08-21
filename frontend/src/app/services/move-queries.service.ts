import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReadonlyQuery } from '../core/readonly-query';
import { MoveModel } from '../models/move.model';

@Injectable({
  providedIn: 'root',
})
export class MoveQueriesService extends ReadonlyQuery<MoveModel> {
  public static readonly url = 'api/move';
  public constructor(protected override http: HttpClient) {
    super(MoveQueriesService.url, http);
  }
}
