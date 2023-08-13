import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-pokemon-resume',
  templateUrl: './pokemon-resume.component.html',
  styleUrls: ['./pokemon-resume.component.scss'],
})
export class PokemonResumeComponent implements AfterViewInit {
  @ViewChild('swiperRef') public swiperContainer: HTMLElement;

  @Input() public pokemon: PokemonModel;
  protected swiper: Swiper;

  public ngAfterViewInit(): void {
    console.log(this.swiperContainer);
    this.swiper = new Swiper(this.swiperContainer, {});
  }
}
