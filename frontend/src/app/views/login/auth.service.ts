import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { LoginFormModel } from './login-form.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(protected http: HttpClient) {}

  public login(loginForm: LoginFormModel): Observable<string> {
    return this.http.post<string>('api/login', loginForm);
  }
}
