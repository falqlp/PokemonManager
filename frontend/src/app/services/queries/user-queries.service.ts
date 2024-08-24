import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ReadonlyQuery } from '../../core/readonly-query';

@Injectable({
  providedIn: 'root',
})
export class UserQueriesService extends ReadonlyQuery<UserModel> {
  protected override http: HttpClient;

  public static readonly url = 'api/user';
  public constructor() {
    const http = inject(HttpClient);

    super(UserQueriesService.url, http);
    this.http = http;
  }

  public isEmailUsed(email: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/is-email-used', { email });
  }

  public isUsernameUsed(username: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/is-username-used', { username });
  }

  public changeLanguage(userId: string, lang: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/change-language', {
      userId,
      lang,
    });
  }

  public verify(userId: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/verify', {
      userId,
    });
  }

  public acceptFriendRequest(
    userId: string,
    friendId: string
  ): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/accept-friend-request', {
      userId,
      friendId,
    });
  }

  public deleteFriendRequest(
    userId: string,
    friendId: string
  ): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/delete-friend-request', {
      userId,
      friendId,
    });
  }

  public changePassword(
    password: string,
    passwordRequestId: string
  ): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/delete-friend-request', {
      password,
      passwordRequestId,
    });
  }

  public readNews(userId: string): Observable<boolean> {
    return this.http.put<boolean>(this.url + '/read-news', {
      userId,
    });
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
