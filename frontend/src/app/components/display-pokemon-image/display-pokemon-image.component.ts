import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { DisplayType } from './display-pokemon-image.model';

@Component({
  selector: 'app-display-pokemon-image',
  templateUrl: './display-pokemon-image.component.html',
  styleUrls: ['./display-pokemon-image.component.scss'],
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
    const idString = this.pokemon.basePokemon.id.toString().padStart(3, '0');
    switch (this.type) {
      case 'icon':
        this.imageUrl = `assets/images/sprites/${idString}MS.png`;
        break;
      case 'back':
        this.imageUrl = `assets/images/back/${idString}.png`;
        break;
      case 'thumbnails':
        this.imageUrl = `assets/images/thumbnails/${idString}.png`;
        break;
      case 'max-size':
        this.imageUrl = `assets/images/max-size/${idString}.png`;
        break;
    }
  }
}
