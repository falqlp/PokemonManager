import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PokemonModel } from './pokemon.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  protected pokemons: PokemonModel[]=[];

  constructor(protected http:HttpClient){}
  public ngOnInit(): void {
    this.http.get('/api/pokemon').subscribe((res: PokemonModel)=>this.pokemons = res)
  }
  protected click(): void {
    
  }
}
