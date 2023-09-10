import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { PokemonInfoComponent } from 'src/app/modals/pokemon-info/pokemon-info.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { TimeService } from '../../services/time.service';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { GenericDialogComponent } from '../../modals/generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../../modals/generic-dialog/generic-dialog.models';

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
  protected partyId = '64fd9cf21308150436317aed';
  protected simulating = false;

  public constructor(
    protected playerService: PlayerService,
    protected dialog: MatDialog,
    protected router: Router,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected routerService: RouterService,
    protected timeService: TimeService
  ) {}

  public ngOnInit(): void {
    this.player$ = this.playerService.player$;
    this.goHomeDisabled$ = this.routerService.goHomeDisabled();
    this.title$ = this.routerService.getTitle();
    this.date$ = this.timeService.getActualDateToString();
    this.timeService.getActualDate().subscribe((date) => {
      this.actualDate = date;
    });
  }

  protected openInfo(pokemon: PokemonModel): void {
    this.dialog.open(PokemonInfoComponent, { data: pokemon });
  }

  protected goHome(): void {
    this.router.navigate(['home']);
  }

  protected simulate(playerId: string): void {
    this.simulating = true;
    this.calendarEventQueriesService
      .simulateDay(playerId, this.actualDate, this.partyId)
      .subscribe((res) => {
        if (res.battle) {
          const buttons: DialogButtonsModel[] = [
            {
              label: 'CANCEL',
              color: undefined,
              click: (): void => {
                this.dialog.closeAll();
              },
            },
            {
              label: 'GO_TO_PC',
              color: 'accent',
              click: (): void => {
                this.dialog.closeAll();
                this.router.navigate(['pcStorage']);
              },
            },
            {
              label: 'GO_TO_BATTLE',
              color: 'warn',
              click: (): void => {
                this.dialog.closeAll();
                this.router.navigate(['battle/' + res.battle._id]);
              },
            },
          ];
          this.dialog.open(GenericDialogComponent, {
            data: {
              buttons,
              message: 'SURE_GO_TO_BATTLE',
            },
          });
        }
        this.simulating = false;
      });
  }

  protected showCalendar(): void {
    this.showWeekCalendar = !this.showWeekCalendar;
  }
}
