import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PingQueriesService {
  private readonly http: HttpClient = inject(HttpClient);
  public pingCore(): Observable<void> {
    return this.http.get<void>(environment.apiUrl + '/api/core-app/ping');
  }

  public pingBattle(): Observable<void> {
    return this.http.get<void>(
      environment.apiUrl + '/api/battle/battle-app/ping'
    );
  }
}
