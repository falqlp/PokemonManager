import { Injectable } from '@angular/core';
import { CalendarEventQueriesService } from './queries/calendar-event-queries.service';
import { BattleModel } from '../models/Battle.model';
import { DialogButtonsModel } from '../modals/generic-dialog/generic-dialog.models';
import { GenericDialogComponent } from '../modals/generic-dialog/generic-dialog.component';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { BattleInstanceQueriesService } from './queries/battle-instance-queries.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterService } from './router.service';
import { TimeService } from './time.service';

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private stopRequest = false;
  private actualDate: Date;

  private simulatingSubject = new BehaviorSubject<boolean>(false);
  public $simulating: Observable<boolean> =
    this.simulatingSubject.asObservable();

  constructor(
    private calendarEventQueriesService: CalendarEventQueriesService,
    private battleInstanceQueriesService: BattleInstanceQueriesService,
    private dialog: MatDialog,
    private router: RouterService,
    private timeService: TimeService
  ) {
    this.timeService.getActualDate().subscribe((date) => {
      this.actualDate = date;
    });
  }

  public simulate(playerId: string): void {
    this.simulationStarted();
    this.calendarEventQueriesService
      .simulateDay(playerId, this.actualDate)
      .subscribe((res) => {
        if (res.battle) {
          this.goToBattle(res.battle);
          this.simulationStopped();
        } else if (res.redirectTo) {
          this.router.navigateByUrl(res.redirectTo);
          this.simulationStopped();
        } else {
          if (this.stopRequest) {
            this.simulationStopped();
          } else {
            setTimeout(() => {
              this.simulate(playerId);
            }, 1000);
          }
        }
      });
  }

  public stopSimulation(): void {
    this.stopRequest = true;
  }

  private simulationStopped(): void {
    this.simulatingSubject.next(false);
    this.stopRequest = false;
  }

  private simulationStarted(): void {
    this.simulatingSubject.next(true);
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
