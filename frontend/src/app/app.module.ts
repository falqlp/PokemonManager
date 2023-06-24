import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonPanelComponent } from './components/pokemon-panel/pokemon-panel.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { CooldownButtonComponent } from './components/cooldown-button/cooldown-button.component';
import { HomeComponent } from './views/home/home.component';

@NgModule({
  declarations: [AppComponent, PokemonPanelComponent, SearchInputComponent, CooldownButtonComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
