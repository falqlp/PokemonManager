import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { NurseryModel } from '../../models/nursery.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NurseryQueriesService extends CompleteQuery<NurseryModel> {
  public static readonly url = 'api/nursery';
  public constructor(protected override http: HttpClient) {
    super(NurseryQueriesService.url, http);
  }
}
