import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoveModel } from '../../models/move.model';

@Injectable({
  providedIn: 'root',
})
export class MoveLearningService {
  public static readonly url = 'api/moveLearning';
  constructor(protected http: HttpClient) {}

  public learnableMove(id: number, level: number): Observable<MoveModel[]> {
    return this.http.put<MoveModel[]>(
      MoveLearningService.url + '/learnableMoves',
      { id, level }
    );
  }
}
