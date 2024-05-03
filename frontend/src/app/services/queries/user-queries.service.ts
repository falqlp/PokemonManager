import { Injectable } from '@angular/core';
import { CompleteQuery } from '../../core/complete-query';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserQueriesService extends CompleteQuery<UserModel> {
  public static readonly url = 'api/user';
  public constructor(protected override http: HttpClient) {
    super(UserQueriesService.url, http);
  }

  public isEmailUsed(email: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/is-email-used', { email });
  }

  public isUsernameUsed(username: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/is-username-used', { username });
  }
}
