import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AttackModel } from '../models/attack.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttackQueriesService {
  public constructor(protected http: HttpClient) {}

  public getAttacks(attacks: string[]): Observable<AttackModel[]> {
    return this.http.post<AttackModel[]>('api/attack', attacks);
  }
}
