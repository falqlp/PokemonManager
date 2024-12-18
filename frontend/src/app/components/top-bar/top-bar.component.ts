import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { first, tap } from 'rxjs';
import { PokemonInfoComponent } from 'src/app/modals/pokemon-info/pokemon-info.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { RouterService } from '../../services/router.service';
import { TimeService } from '../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidenavService } from '../sidenav/sidenav.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { MatIconModule } from '@angular/material/icon';
import { DisplayPokemonImageComponent } from '../display-pokemon-image/display-pokemon-image.component';
import { NumberFormatterPipe } from '../../pipes/number-formatter.pipe';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TopBarWeekCalendarComponent } from './top-bar-week-calendar/top-bar-week-calendar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { BadgeDataService } from '../../services/badge.data.service';
import { ContinueButtonComponent } from './continue-button/continue-button.component';
import { WebsocketEventService } from '../../services/websocket-event.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    DisplayPokemonImageComponent,
    NumberFormatterPipe,
    MatButtonModule,
    AsyncPipe,
    TranslateModule,
    MatProgressSpinnerModule,
    TopBarWeekCalendarComponent,
    MatBadgeModule,
    ContinueButtonComponent,
  ],
})
export class TopBarComponent implements OnInit {
  protected badgeDataService = inject(BadgeDataService);
  private playerService = inject(PlayerService);
  private dialog = inject(MatDialog);
  private routerService = inject(RouterService);
  private timeService = inject(TimeService);
  private destroyRef = inject(DestroyRef);
  private sidenavService = inject(SidenavService);
  protected languageService = inject(LanguageService);
  private websocketEventService = inject(WebsocketEventService);

  protected player$: Observable<TrainerModel>;
  protected goHomeDisabled$: Observable<boolean>;
  protected title$: Observable<string>;
  protected date$: Observable<string>;
  protected showWeekCalendar = false;
  protected actualDate: Date;
  protected player: TrainerModel;

  public ngOnInit(): void {
    this.player$ = this.playerService.player$.pipe(
      tap((trainer) => {
        this.player = trainer;
      })
    );
    this.websocketEventService.simulatingEvent$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.toggleWeekCalendar(value);
      });
    this.goHomeDisabled$ = this.routerService.$navigationDisabled;
    this.title$ = this.routerService.$title;
    this.date$ = this.timeService.getActualDateToString();
    this.timeService
      .getActualDate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => {
        this.actualDate = date;
      });
  }

  protected openInfo(pokemon: PokemonModel): void {
    if (pokemon.level) {
      this.dialog.open(PokemonInfoComponent, { data: pokemon });
    }
  }

  protected menu(): void {
    this.sidenavService.openSidenav();
  }

  protected showCalendar(): void {
    this.showWeekCalendar = !this.showWeekCalendar;
  }

  protected changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
    this.timeService
      .getActualDate()
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => this.timeService.updateDate(date));
  }

  protected getLangFlag(lang: string): string {
    switch (lang) {
      case 'fr-FR':
        return 'FR';
      case 'en-EN':
        return 'GB';
      default:
        return '';
    }
  }

  protected toggleWeekCalendar(value: boolean): void {
    this.showWeekCalendar = value;
  }
}
