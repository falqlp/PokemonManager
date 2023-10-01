import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CacheService } from '../services/cache.service';

@Injectable()
export class GameIdInterceptor implements HttpInterceptor {
  constructor(protected cacheService: CacheService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const gameId = this.cacheService.getGameId();
    request = request.clone({
      setHeaders: {
        'Game-Id': gameId ?? '',
      },
    });
    return next.handle(request);
  }
}
