import { Injectable } from '@angular/core';
import { CalendarEventQueriesService } from './queries/calendar-event-queries.service';
import { BattleModel } from '../models/Battle.model';
import { first, map, switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RouterService } from './router.service';
import { TimeService } from './time.service';
import { PlayerService } from './player.service';
import { BattleStrategyModalComponent } from '../modals/battle-strategy-modal/battle-strategy-modal.component';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  public askForNextDay = false;

  constructor(
    private calendarEventQueriesService: CalendarEventQueriesService,
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
    this.dialog.afterAllClosed.pipe(first()).subscribe(() => {
      this.dialog.open(BattleStrategyModalComponent, {
        data: { battle, isMultiplayerBattle },
      });
    });
  }
}
