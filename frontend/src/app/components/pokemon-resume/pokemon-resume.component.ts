import { Component, Input, OnInit } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-pokemon-resume',
  templateUrl: './pokemon-resume.component.html',
  styleUrls: ['./pokemon-resume.component.scss'],
})
export class PokemonResumeComponent implements OnInit {
  @Input()
  public set pokemon(value: PokemonModel) {
    this._pokemon = value;
    this.calcMax();
  }

  public get pokemon(): PokemonModel {
    return this._pokemon;
  }

  protected _pokemon: PokemonModel;
  protected max = 0;

  public ngOnInit(): void {
    this.calcMax();
  }

  protected calcMax(): void {
    this.max = 0;
    for (const key in this.pokemon.stats) {
      if (key === 'hp') {
        this.max = Math.max(
          this.max,
          this.pokemon.stats['hp'] - this.pokemon.level - 5
        );
      } else if (key !== '_id') {
        this.max = Math.max(this.max, this.pokemon.stats[key]);
      }
    }
  }
}
