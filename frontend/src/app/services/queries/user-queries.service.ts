import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class UserQueriesService extends ReadonlyQuery<UserModel> {
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

  public addFriend(userId: string, friendId: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/add-friend', {
      userId,
      friendId,
    });
  }

  public create(newObject: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.url, newObject);
  }
}
