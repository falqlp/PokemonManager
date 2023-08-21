import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompleteQuery } from '../core/complete-query';
import { PcStorageModel } from '../models/pc-storage.model';

@Injectable({
  providedIn: 'root',
})
export class PcStorageQueriesService extends CompleteQuery<PcStorageModel> {
  public static readonly url = 'api/pcStorage';
  constructor(protected override http: HttpClient) {
    super(PcStorageQueriesService.url, http);
  }
}
