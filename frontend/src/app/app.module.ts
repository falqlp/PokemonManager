import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonPanelComponent } from './components/pokemon-panel/pokemon-panel.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { CooldownButtonComponent } from './components/cooldown-button/cooldown-button.component';
import { HomeComponent } from './views/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PokemonFormComponent } from './modals/pokemon-form/pokemon-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LoginComponent } from './views/login/login.component';
import { PokemonInfoComponent } from './modals/pokemon-info/pokemon-info.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { BattleComponent } from './views/battle/battle.component';
import { BattleSceneComponent } from './views/battle/components/battle-scene/battle-scene.component';
import { BattleTrainerPokemonsComponent } from './views/battle/components/battle-trainer-pokemons/battle-trainer-pokemons.component';
import { BattleAttackComponent } from './views/battle/components/battle-attack/battle-attack.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    PokemonPanelComponent,
    SearchInputComponent,
    CooldownButtonComponent,
    HomeComponent,
    PokemonFormComponent,
    TopBarComponent,
    LoginComponent,
    PokemonInfoComponent,
    ProgressBarComponent,
    BattleComponent,
    BattleSceneComponent,
    BattleTrainerPokemonsComponent,
    BattleAttackComponent,
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
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
