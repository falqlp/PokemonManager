import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-pokemon-resume',
  templateUrl: './pokemon-resume.component.html',
  styleUrls: ['./pokemon-resume.component.scss'],
})
export class PokemonResumeComponent implements AfterViewInit {
  @ViewChild('swiperContainer') protected swiperContainer: ElementRef;
  protected swiper = Swiper;
  @Input()
  public set pokemon(value: PokemonModel) {
    this._pokemon = value;
  }

  public get pokemon(): PokemonModel {
    return this._pokemon;
  }

  protected _pokemon: PokemonModel;

  public ngAfterViewInit(): void {
    const swiperOption: SwiperOptions = {
      pagination: {
        clickable: true,
      },
    };
    const swiperContainerEl = this.swiperContainer.nativeElement;
    Object.assign(swiperContainerEl, swiperOption);
    swiperContainerEl.initialize();
    this.swiper = swiperContainerEl.swiper;
  }
}
