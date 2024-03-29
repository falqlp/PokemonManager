import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CooldownButtonComponent } from './components/cooldown-button/cooldown-button.component';
import { HomeComponent } from './views/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PokemonFormComponent } from './modals/pokemon-form/pokemon-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './views/login/login.component';
import { BattleComponent } from './views/battle/battle.component';
import { BattleSceneComponent } from './views/battle/components/battle-scene/battle-scene.component';
import { BattleTrainerPokemonsComponent } from './views/battle/components/battle-trainer-pokemons/battle-trainer-pokemons.component';
import { BattlePlayerMoveComponent } from './views/battle/components/battle-move/battle-player-move.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BattleSceneMoveInfoComponent } from './views/battle/components/battle-scene-move-info/battle-scene-move-info.component';
import { BattleSceneOpponentComponent } from './views/battle/components/battle-scene-opponent/battle-scene-opponent.component';
import { CircularProgressBarComponent } from './components/circular-progress-bar/circular-progress-bar.component';
import { CircularHpPokemonComponent } from './components/circular-hp-pokemon/circular-hp-pokemon.component';
import { BattleOpponentPokemonsComponent } from './views/battle/components/battle-oppenent-pokemon/battle-opponent-pokemons.component';
import { BattleResumeComponent } from './views/battle-resume/battle-resume.component';
import { BattleScenePlayerComponent } from './views/battle/components/battle-scene-player/battle-scene-player.component';
import { MatSelectModule } from '@angular/material/select';
import { PcStorageComponent } from './views/pc-storage/pc-storage.component';
import { PokemonResumeComponent } from './components/pokemon-resume/pokemon-resume.component';
import { register } from 'swiper/element/bundle';
import { MatIconModule } from '@angular/material/icon';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { DisplayPokemonImageComponent } from './components/display-pokemon-image/display-pokemon-image.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { PokemonStatsComponent } from './components/pokemon-stats/pokemon-stats.component';
import { NumberCooldownComponent } from './components/number-cooldown/number-cooldown.component';
import { TopBarWeekCalendarComponent } from './components/top-bar-week-calendar/top-bar-week-calendar.component';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotifierModule } from 'angular-notifier';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { PokemonResumeMovesComponent } from './components/pokemon-resume/pokemon-resume-moves/pokemon-resume-moves.component';
import { HeaderInterceptor } from './core/header-interceptor.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DisplayTypeComponent } from './components/display-type/display-type.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';

register();
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CooldownButtonComponent,
    HomeComponent,
    PokemonFormComponent,
    LoginComponent,
    BattleComponent,
    BattleSceneComponent,
    BattleTrainerPokemonsComponent,
    BattlePlayerMoveComponent,
    BattleSceneMoveInfoComponent,
    BattleSceneOpponentComponent,
    CircularProgressBarComponent,
    CircularHpPokemonComponent,
    BattleOpponentPokemonsComponent,
    BattleResumeComponent,
    BattleScenePlayerComponent,
    PcStorageComponent,
    PokemonResumeComponent,
    TopBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr-FR',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatSelectModule,
    MatIconModule,
    MatNativeDateModule,
    DisplayPokemonImageComponent,
    ProgressBarComponent,
    PokemonStatsComponent,
    NumberCooldownComponent,
    TopBarWeekCalendarComponent,
    MatProgressSpinnerModule,
    MatMomentDateModule,
    NotifierModule,
    PokemonResumeMovesComponent,
    MatSidenavModule,
    SidenavComponent,
    DisplayTypeComponent,
    MatSlideToggleModule,
    NumberFormatterPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
