import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  input,
  AfterViewInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { DisplayType } from './display-pokemon-image.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass, NgIf } from '@angular/common';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';
import { MatIconModule } from '@angular/material/icon';
import { RouterService } from '../../services/router.service';

@Component({
  standalone: true,
  selector: 'app-display-pokemon-image',
  templateUrl: './display-pokemon-image.component.html',
  styleUrls: ['./display-pokemon-image.component.scss'],
  imports: [TranslateModule, NgClass, MatIconModule, NgIf],
})
export class DisplayPokemonImageComponent implements OnInit, OnChanges {
  @ViewChild('img') protected img: ElementRef;
  @Input() public pokemon: PokemonModel | PokemonBaseModel;
  @Input() public type: DisplayType;
  @Input() public height: number;
  @Input() public shiny = false;
  public disabledClick = input<boolean>(false);
  protected fontSize: number;

  protected basePokemon: PokemonBaseModel;
  protected maxHeight = signal<boolean>(false);

  protected imageUrl: string;
  constructor(
    private routerService: RouterService,
    protected elementRef: ElementRef
  ) {}

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

  public loadImg(): void {
    this.fontSize = this.img.nativeElement.height * 0.2;
    const hwRatioImg =
      this.elementRef.nativeElement.children[0].naturalHeight /
      this.elementRef.nativeElement.children[0].naturalWidth;
    const hwRatioImgDiv =
      this.elementRef.nativeElement.parentElement.clientHeight /
      this.elementRef.nativeElement.parentElement.clientWidth;
    this.maxHeight.set(hwRatioImg > hwRatioImgDiv);
  }

  protected click(): void {
    if (!('level' in this.pokemon && this.pokemon.level === 0)) {
      this.routerService.navigateByUrl(
        'pokedex-details/' + this.basePokemon.id
      );
    }
  }
}
