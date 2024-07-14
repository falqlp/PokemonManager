import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PcStorageModel } from '../../models/pc-storage.model';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class PcStorageQueriesService extends ReadonlyQuery<PcStorageModel> {
  public static readonly url = 'api/pcStorage';
  constructor(protected override http: HttpClient) {
    super(PcStorageQueriesService.url, http);
  }
}
