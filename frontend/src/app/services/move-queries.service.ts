import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MoveModel } from '../models/move.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoveQueriesService {
  public constructor(protected http: HttpClient) {}

  public getMoves(moves: string[]): Observable<MoveModel[]> {
    return this.http.post<MoveModel[]>('api/move', moves);
  }
}
