import { Injectable } from '@angular/core';
import { CalendarEventQueriesService } from './queries/calendar-event-queries.service';
import { BattleModel } from '../models/Battle.model';
import { DialogButtonsModel } from '../modals/generic-dialog/generic-dialog.models';
import { GenericDialogComponent } from '../modals/generic-dialog/generic-dialog.component';
import { BehaviorSubject, first, map, Observable, switchMap, tap } from 'rxjs';
import { BattleInstanceQueriesService } from './queries/battle-instance-queries.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterService } from './router.service';
import { TimeService } from './time.service';
import { PlayerService } from './player.service';
import { WebsocketEventService } from './websocket-event.service';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  public askForNextDay = false;

  constructor(
    private calendarEventQueriesService: CalendarEventQueriesService,
    private battleInstanceQueriesService: BattleInstanceQueriesService,
    private dialog: MatDialog,
    private routerService: RouterService,
    private timeService: TimeService,
    private playerService: PlayerService
  ) {
    this.timeService.getActualDate().subscribe(() => {
      this.askForNextDay = false;
    });
  }

  public simulate(): void {
    this.playerService.player$
      .pipe(
        switchMap((player) => {
          return this.timeService.getActualDate().pipe(
            first(),
            map((date) => {
              return { date, playerId: player._id };
            })
          );
        }),
        first(),
        switchMap(({ date, playerId }) => {
          if (this.askForNextDay) {
            return this.calendarEventQueriesService
              .deleteAskNextDay(playerId)
              .pipe(
                tap(() => {
                  this.askForNextDay = !this.askForNextDay;
                })
              );
          } else {
            return this.calendarEventQueriesService
              .askNextDay(playerId, date)
              .pipe(
                tap((res) => {
                  if (res.battle) {
                    this.goToBattle(res.battle, res.isMultiplayerBattle);
                  } else if (res.redirectTo) {
                    this.routerService.navigateByUrl(res.redirectTo);
                  } else {
                    this.askForNextDay = !this.askForNextDay;
                  }
                })
              );
          }
        })
      )
      .subscribe();
  }

  public stopSimulation(): void {
    this.playerService.player$
      .pipe(
        switchMap((trainer) => {
          return this.calendarEventQueriesService.deleteAskNextDay(trainer._id);
        }),
        first()
      )
      .subscribe(() => {
        this.askForNextDay = false;
      });
  }

  protected goToBattle(
    battle: BattleModel,
    isMultiplayerBattle: boolean
  ): void {
    const lambdaButtons: DialogButtonsModel[] = [
      {
        label: 'YES',
        color: 'warn',
        close: true,
        click: (): void => {
          this.battleInstanceQueriesService
            .simulateBattle(battle)
            .subscribe(() => {
              this.routerService.navigate(['battle-resume'], {
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
          this.routerService.navigate(['pcStorage']);
        },
      },
      {
        label: 'SIMULATE',
        color: 'accent',
        disabled: isMultiplayerBattle,
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
          this.routerService.navigate(['battle/' + battle._id]);
        },
      },
    ];
    this.dialog.afterAllClosed.pipe(first()).subscribe(() => {
      this.dialog.open(GenericDialogComponent, {
        data: {
          buttons,
          message: 'SURE_GO_TO_BATTLE',
        },
      });
    });
  }
}
