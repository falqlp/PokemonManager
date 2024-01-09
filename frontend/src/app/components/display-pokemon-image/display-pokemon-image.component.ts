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

@Component({
  standalone: true,
  selector: 'app-display-pokemon-image',
  templateUrl: './display-pokemon-image.component.html',
  styleUrls: ['./display-pokemon-image.component.scss'],
  imports: [TranslateModule, NgClass],
})
export class DisplayPokemonImageComponent implements OnInit, OnChanges {
  @Input() public pokemon: PokemonModel;
  @Input() public type: DisplayType;

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
    const idString =
      this.pokemon.level === 0
        ? '000'
        : this.pokemon.basePokemon.name.replace('-', '');
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
        this.imageUrl = `assets/images/max-size/${this.pokemon.basePokemon.id
          .toString()
          .padStart(3, '0')}.png`;
        break;
      default:
        this.imageUrl = `assets/pokemons/Front/${idString}.png`;
    }
  }
}
