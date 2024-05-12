import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryModel } from './query.model';
import { environment } from '../../environments/environment';
import { TableResult } from '../components/custom-table/custom-table.model';

export abstract class ReadonlyQuery<T> {
  protected url: string;
  public constructor(url: string, protected http: HttpClient) {
    this.url = environment.apiUrl + '/' + url;
  }

  public get(_id: string): Observable<T> {
    return this.http.get<T>(`${this.url}/${_id}`);
  }

  public list(query?: QueryModel): Observable<T[]> {
    return this.http.put<T[]>(this.url, query);
  }

  public count(query?: QueryModel): Observable<number> {
    return this.http.put<number>(this.url + '/count', query);
  }

  public queryTable(query?: QueryModel): Observable<TableResult<T>> {
    return this.http.post<TableResult<T>>(this.url + '/query-table', query);
  }
}
