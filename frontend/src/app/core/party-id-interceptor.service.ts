import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PartyIdInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const partyId = '64fd9cf21308150436317aed';
    request = request.clone({
      setHeaders: {
        'Party-Id': partyId,
      },
    });
    return next.handle(request);
  }
}
