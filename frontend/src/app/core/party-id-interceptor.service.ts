import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GameIdInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const gameId = '64fd9cf21308150436317aed';
    request = request.clone({
      setHeaders: {
        'Game-Id': gameId,
      },
    });
    return next.handle(request);
  }
}
