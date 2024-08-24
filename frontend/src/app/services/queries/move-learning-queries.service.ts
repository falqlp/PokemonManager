import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MoveModel } from '../../models/move.model';
import { QueryModel } from '../../core/query.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoveLearningQueriesService {
  protected http = inject(HttpClient);

  public static readonly url = 'api/moveLearning';

  public learnableMove(
    id: number,
    level: number,
    query?: QueryModel
  ): Observable<MoveModel[]> {
    return this.http.put<MoveModel[]>(
      `${environment.apiUrl}/${MoveLearningQueriesService.url}/learnableMoves`,
      { id, level, query }
    );
  }
}
