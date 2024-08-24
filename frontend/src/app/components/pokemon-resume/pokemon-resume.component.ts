import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  ViewChild,
  inject,
} from '@angular/core';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { MatDialog } from '@angular/material/dialog';
import { ChangeNicknameComponent } from '../../modals/change-nickname/change-nickname.component';
import { MatIconModule } from '@angular/material/icon';
import { DisplayPokemonImageComponent } from '../display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../display-type/display-type.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';
import { PokemonResumeMovesComponent } from './pokemon-resume-moves/pokemon-resume-moves.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { PokemonResumeInfosComponent } from './pokemon-resume-infos/pokemon-resume-infos.component';
import { PokemonStatsRadarComponent } from '../pokemon-stats-radar/pokemon-stats-radar.component';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-pokemon-resume',
  templateUrl: './pokemon-resume.component.html',
  styleUrls: ['./pokemon-resume.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    DisplayPokemonImageComponent,
    DisplayTypeComponent,
    ProgressBarComponent,
    PokemonResumeMovesComponent,
    TranslateModule,
    NgClass,
    PokemonResumeInfosComponent,
    PokemonStatsRadarComponent,
    MatGridList,
    MatGridTile,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PokemonResumeComponent implements AfterViewInit {
  protected dialog = inject(MatDialog);

  @ViewChild('swiperContainer') protected swiperContainer: ElementRef;
  protected swiper = Swiper;
  public pokemon = input<PokemonModel>();

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

  protected editNickname(): void {
    this.dialog.open(ChangeNicknameComponent, { data: this.pokemon() });
  }
}
