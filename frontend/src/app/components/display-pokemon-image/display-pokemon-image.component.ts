import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { DisplayType } from './display-pokemon-image.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';

@Component({
  standalone: true,
  selector: 'app-display-pokemon-image',
  templateUrl: './display-pokemon-image.component.html',
  styleUrls: ['./display-pokemon-image.component.scss'],
  imports: [TranslateModule, NgClass],
})
export class DisplayPokemonImageComponent implements OnInit, OnChanges {
  @Input() public pokemon: PokemonModel | PokemonBaseModel;
  @Input() public type: DisplayType;

  protected basePokemon: PokemonBaseModel;

  protected imageUrl: string;

  public ngOnInit(): void {
    this.updateImageUrl();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemon']) {
      this.updateImageUrl();
    }
  }

  protected updateImageUrl(): void {
    let idString;
    if ('level' in this.pokemon) {
      this.basePokemon = this.pokemon.basePokemon;
      idString =
        this.pokemon.level === 0
          ? '000'
          : this.pokemon.basePokemon.name?.replace('-', '');
    } else {
      this.basePokemon = this.pokemon;
      idString = this.pokemon.name?.replace('-', '');
    }
    switch (this.type) {
      case 'icon':
        this.imageUrl = `assets/pokemons/Icons/${idString}.png`;
        break;
      case 'back':
        this.imageUrl = `assets/pokemons/Back/${idString}.png`;
        break;
      case 'thumbnails':
        this.imageUrl = `assets/pokemons/Front/${idString}.png`;
        break;
      case 'max-size':
        this.imageUrl = `assets/pokemons/max-size/${idString}.png`;
        break;
      default:
        this.imageUrl = `assets/pokemons/Front/${idString}.png`;
    }
  }
}
