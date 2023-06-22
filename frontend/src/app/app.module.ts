import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonPanelComponent } from './pokemon-panel/pokemon-panel.component';
import { SearchInputComponent } from './search-input/search-input.component';

@NgModule({
  declarations: [AppComponent, PokemonPanelComponent, SearchInputComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
