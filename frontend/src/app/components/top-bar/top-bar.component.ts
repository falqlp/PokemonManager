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
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { GenericDialogComponent } from '../../modals/generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../../modals/generic-dialog/generic-dialog.models';
import { BattleModel } from '../../models/Battle.model';
import { ExpGainComponent } from '../../modals/exp-gain/exp-gain.component';
import { first, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidenavService } from '../sidenav/sidenav.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  protected player$: Observable<TrainerModel>;
  protected goHomeDisabled$: Observable<boolean>;
  protected title$: Observable<string>;
  protected date$: Observable<string>;
  protected showWeekCalendar = false;
  protected actualDate: Date;
  protected simulating = false;
  protected player: TrainerModel;
  protected lang =
    this.translateService.currentLang ?? this.translateService.defaultLang;

  public constructor(
    protected playerService: PlayerService,
    protected dialog: MatDialog,
    protected router: RouterService,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected routerService: RouterService,
    protected timeService: TimeService,
    protected destroyRef: DestroyRef,
    protected sidenavService: SidenavService,
    protected translateService: TranslateService,
    protected languageService: LanguageService,
    protected battleInstanceQueriesService: BattleInstanceQueriesService
  ) {}

  public ngOnInit(): void {
    this.player$ = this.playerService.player$.pipe(
      tap((trainer) => {
        this.player = trainer;
      })
    );
    this.goHomeDisabled$ = this.routerService.goHomeDisabled();
    this.title$ = this.routerService.getTitle();
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

  protected simulate(playerId: string): void {
    this.simulating = true;
    const oldDay = this.actualDate.getDay();
    this.calendarEventQueriesService
      .simulateDay(playerId, this.actualDate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (
          this.actualDate.getDay() === 1 &&
          this.actualDate.getDay() !== oldDay
        ) {
          this.dialog.afterAllClosed
            .pipe(first(), takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.dialog.open(ExpGainComponent, {
                data: { trainer: this.player },
                disableClose: true,
              });
            });
        }
        if (res.battle) {
          this.goToBattle(res.battle);
        }
        if (res.redirectTo) {
          this.router.navigateByUrl(res.redirectTo);
        }
        this.simulating = false;
      });
  }

  protected showCalendar(): void {
    this.showWeekCalendar = !this.showWeekCalendar;
  }

  protected goToBattle(battle: BattleModel): void {
    const lambdaButtons: DialogButtonsModel[] = [
      {
        label: 'YES',
        color: 'warn',
        close: true,
        click: (): void => {
          this.battleInstanceQueriesService
            .simulateBattle(battle)
            .subscribe(() => {
              this.router.navigate(['battle-resume'], {
                queryParams: { battle: battle._id },
              });
              this.dialog.closeAll();
            });
        },
      },
      {
        label: 'NO',
        color: 'primary',
        close: true,
      },
    ];
    const buttons: DialogButtonsModel[] = [
      {
        label: 'CANCEL',
        color: undefined,
        close: true,
      },
      {
        label: 'GO_TO_PC',
        color: 'accent',
        close: true,
        click: (): void => {
          this.router.navigate(['pcStorage']);
        },
      },
      {
        label: 'SIMULATE',
        color: 'accent',
        click: (): void => {
          this.dialog.open(GenericDialogComponent, {
            data: {
              buttons: lambdaButtons,
              message: 'SURE_SIMULATE',
            },
          });
        },
      },
      {
        label: 'GO_TO_BATTLE',
        color: 'warn',
        close: true,
        click: (): void => {
          this.router.navigate(['battle/' + battle._id]);
        },
      },
    ];
    this.dialog.afterAllClosed
      .pipe(first(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialog.open(GenericDialogComponent, {
          data: {
            buttons,
            message: 'SURE_GO_TO_BATTLE',
          },
        });
      });
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
}
