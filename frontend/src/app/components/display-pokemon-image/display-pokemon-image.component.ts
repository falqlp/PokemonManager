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

  private updateImageUrl(): void {
    switch (this.type) {
      case 'icon':
        this.imageUrl = `assets/images/sprites/${this.pokemon.basePokemon.id}MS.png`;
        break;
      case 'back':
        this.imageUrl = `assets/images/back/${this.pokemon.basePokemon.id}.png`;
        break;
      case 'thumbnails':
        this.imageUrl = `assets/images/thumbnails/${this.pokemon.basePokemon.id}.png`;
        break;
    }
  }
}
