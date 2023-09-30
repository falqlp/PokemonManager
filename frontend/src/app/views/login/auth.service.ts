import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { LoginFormModel } from './login-form.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(protected http: HttpClient) {}

  public login(loginForm: LoginFormModel): Observable<any> {
    return this.http.post<any>('api/login', loginForm);
  }

  public getUser(_id: string): Observable<any> {
    return this.http.get<any>('api/login' + _id);
  }
}
