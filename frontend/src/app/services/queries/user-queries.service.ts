import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserQueriesService extends CompleteQuery<UserModel> {
  public static readonly url = 'api/user';
  public constructor(protected override http: HttpClient) {
    super(UserQueriesService.url, http);
  }
}
