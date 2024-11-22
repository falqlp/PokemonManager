import {
  Component,
  inject,
  Input,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { DisplayType } from './display-pokemon-image.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterService } from '../../services/router.service';

@Component({
  standalone: true,
  selector: 'app-display-pokemon-image',
  templateUrl: './display-pokemon-image.component.html',
  styleUrls: ['./display-pokemon-image.component.scss'],
  imports: [TranslateModule, NgClass, MatIconModule],
})
export class DisplayPokemonImageComponent implements OnInit, OnChanges {
  private routerService = inject(RouterService);

  @Input() public pokemon: PokemonModel | PokemonBaseModel;
  @Input() public type: DisplayType;
  @Input() public shiny = false;
  public disabledClick = input<boolean>(false);
  public dynamicSizing = input<boolean>(false);
  protected fontSize: number;

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
      this.shiny = this.pokemon.shiny;
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
        this.imageUrl = `assets/pokemons/Icons${
          this.shiny ? ' shiny' : ''
        }/${idString}.png`;
        break;
      case 'back':
        this.imageUrl = `assets/pokemons/Back${
          this.shiny ? ' shiny' : ''
        }/${idString}.png`;
        break;
      case 'thumbnails':
        this.imageUrl = `assets/pokemons/Front${
          this.shiny ? ' shiny' : ''
        }/${idString}.png`;
        break;
      case 'max-size':
        this.imageUrl = `assets/pokemons/max-size/${idString}.png`;

        break;
      default:
        this.imageUrl = `assets/pokemons/Front${
          this.shiny ? ' shiny' : ''
        }/${idString}.png`;
    }
  }

  protected click(): void {
    if (!('level' in this.pokemon && this.pokemon.level === 0)) {
      this.routerService.navigateByUrl(
        'play/pokedex-details/' + this.basePokemon.id
      );
    }
  }
}
