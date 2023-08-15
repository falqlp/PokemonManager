import { Component, Input } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-pokemon-resume',
  templateUrl: './pokemon-resume.component.html',
  styleUrls: ['./pokemon-resume.component.scss'],
})
export class PokemonResumeComponent {
  @Input()
  public set pokemon(value: PokemonModel) {
    this._pokemon = value;
  }

  public get pokemon(): PokemonModel {
    return this._pokemon;
  }

  protected _pokemon: PokemonModel;
}
