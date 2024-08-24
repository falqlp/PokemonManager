import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PasswordRequestModel } from '../../models/password-request.model';

@Injectable({
  providedIn: 'root',
})
export class PasswordRequestQueriesService {
  protected http = inject(HttpClient);

  private readonly url = 'api/password-request';

  public createPasswordRequest(
    email: string,
    username: string
  ): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/${this.url}`, {
      username,
      email,
    });
  }

  public getPasswordRequest(id: string): Observable<PasswordRequestModel> {
    return this.http.get<PasswordRequestModel>(
      `${environment.apiUrl}/${this.url}/${id}`
    );
  }
}
