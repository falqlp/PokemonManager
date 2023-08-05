import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ReadonlyQuery<T> {
  public constructor(protected url: string, protected http: HttpClient) {}

  public get(_id: string): Observable<T> {
    return this.http.get<T>(`${this.url}/${_id}`);
  }

  public getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  public list(ids: string[]): Observable<T[]> {
    return this.http.put<T[]>(this.url, ids);
  }
}
