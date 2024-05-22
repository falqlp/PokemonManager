import { DestroyRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { PokemonInfoComponent } from 'src/app/modals/pokemon-info/pokemon-info.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { RouterService } from '../../services/router.service';
import { TimeService } from '../../services/time.service';
import { first, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidenavService } from '../sidenav/sidenav.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { MatIconModule } from '@angular/material/icon';
import { DisplayPokemonImageComponent } from '../display-pokemon-image/display-pokemon-image.component';
import { NumberFormatterPipe } from '../../pipes/number-formatter.pipe';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
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
    NgIf,
    NgForOf,
    AsyncPipe,
    TranslateModule,
    MatProgressSpinnerModule,
    TopBarWeekCalendarComponent,
    MatBadgeModule,
    ContinueButtonComponent,
  ],
})
export class TopBarComponent implements OnInit {
  protected player$: Observable<TrainerModel>;
  protected goHomeDisabled$: Observable<boolean>;
  protected title$: Observable<string>;
  protected date$: Observable<string>;
  protected showWeekCalendar = false;
  protected actualDate: Date;
  protected player: TrainerModel;
  protected lang =
    this.translateService.currentLang ?? this.translateService.defaultLang;

  public constructor(
    private playerService: PlayerService,
    private dialog: MatDialog,
    private routerService: RouterService,
    private timeService: TimeService,
    private destroyRef: DestroyRef,
    private sidenavService: SidenavService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    protected badgeDataService: BadgeDataService,
    private websocketEventService: WebsocketEventService
  ) {}

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
    this.dialog.open(PokemonInfoComponent, { data: pokemon });
  }

  protected menu(): void {
    this.sidenavService.openSidenav();
  }

  protected showCalendar(): void {
    this.showWeekCalendar = !this.showWeekCalendar;
  }

  protected changeLanguage(lang: string): void {
    this.translateService.use(lang);
    this.lang = this.translateService.currentLang;
    this.languageService.setLanguage(this.lang);
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
