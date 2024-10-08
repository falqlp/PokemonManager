import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailQueriesService {
  protected httpClient = inject(HttpClient);

  public contactUs(
    subject: string,
    details: string,
    userId: string
  ): Observable<void> {
    return this.httpClient.post<void>(
      `${environment.apiUrl}/api/email/contact-us`,
      { subject, details, userId }
    );
  }
}
