import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadonlyQuery } from './readonly-query';

export abstract class CompleteQuery<T> extends ReadonlyQuery<T> {
  public constructor(url: string, protected override http: HttpClient) {
    super(url, http);
  }

  public create(newObject: T): Observable<T> {
    return this.http.post<T>(this.url, newObject);
  }

  public update(updateObject: T, _id: string): Observable<T> {
    return this.http.put<T>(`${this.url}/${_id}`, updateObject);
  }

  public delete(_id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.url}/${_id}`);
  }
}
