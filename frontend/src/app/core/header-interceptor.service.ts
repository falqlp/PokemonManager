import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { CacheService } from '../services/cache.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  private lang = 'fr-Fr';
  constructor(
    protected cacheService: CacheService,
    protected languageService: LanguageService
  ) {
    this.languageService.getLanguage().subscribe((currentLang) => {
      this.lang = currentLang;
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const gameId = this.cacheService.getGameId();

    request = request.clone({
      setHeaders: {
        'Game-Id': gameId ?? '',
        lang: this.lang,
      },
    });

    return next.handle(request);
  }
}
