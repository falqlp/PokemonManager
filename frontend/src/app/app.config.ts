import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { HeaderInterceptor } from './core/header-interceptor.service';
import { register } from 'swiper/element/bundle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxEchartsModule } from 'ngx-echarts';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { LanguageService } from './services/language.service';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

register();
export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const provideTranslation = (): TranslateModule => ({
  defaultLanguage: navigator.language === 'fr-FR' ? 'fr-FR' : 'en-EN',
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([
      TranslateModule.forRoot(provideTranslation()),
      MatDialogModule,
      MatSnackBarModule,
      RouterModule.forRoot(routes, {
        bindToComponentInputs: true,
      }),
      NgxEchartsModule.forRoot({
        echarts: () => import('echarts'),
      }),
    ]),
    {
      provide: MAT_DATE_LOCALE,
      useFactory: (languageService: LanguageService): string => {
        return languageService.getCurrentLang();
      },
      deps: [LanguageService],
    },
    provideMomentDateAdapter(undefined, { useUtc: true }),
    provideNativeDateAdapter(),
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
};
