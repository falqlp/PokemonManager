import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PcStorageModel } from '../../models/pc-storage.model';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class PcStorageQueriesService extends ReadonlyQuery<PcStorageModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/pc-storage';
  constructor() {
    const http = inject(HttpClient);

    super(PcStorageQueriesService.url, http);
    this.http = http;
  }
}
