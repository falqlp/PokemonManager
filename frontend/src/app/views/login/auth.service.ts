import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { LoginFormModel } from './login-form.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(protected http: HttpClient) {}

  public login(loginForm: LoginFormModel): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/login', loginForm);
  }
}
