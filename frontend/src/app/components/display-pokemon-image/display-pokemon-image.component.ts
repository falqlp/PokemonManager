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
        : this.pokemon.basePokemon.id.toString().padStart(3, '0');
    switch (this.type) {
      case 'icon':
        this.imageUrl = `assets/images/test-icon/${this.pokemon.basePokemon.name}.png`;
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
      default:
        this.imageUrl = `assets/images/max-size/${idString}.png`;
    }
  }
}
