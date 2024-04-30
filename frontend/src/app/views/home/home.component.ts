import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { PokemonQueriesService } from 'src/app/services/queries/pokemon-queries.service';
import { AddCalendarEventComponent } from '../../modals/add-calendar-event/add-calendar-event.component';
import { map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { TimeService } from '../../services/time.service';
import {
  CalendarEventEvent,
  CalendarEventModel,
} from '../../models/calendar-event.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../../components/display-type/display-type.component';
import { AsyncPipe } from '@angular/common';
import { TrainerNameComponent } from '../../components/trainer-name/trainer-name.component';
import { RankingComponent } from '../../components/ranking/ranking.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MoveComponent } from '../../components/move/move.component';
import { SimpleDisplayStatsComponent } from '../../components/simple-display-stats/simple-display-stats.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    DisplayPokemonImageComponent,
    DisplayTypeComponent,
    AsyncPipe,
    TrainerNameComponent,
    RankingComponent,
    MatTabsModule,
    MatButtonModule,
    TranslateModule,
    MoveComponent,
    SimpleDisplayStatsComponent,
  ],
})
export class HomeComponent implements OnInit {
  protected player: TrainerModel;
  protected readonly environment = environment;
  protected nextBattle: CalendarEventModel;
  protected dayToNextBattle: string;
  protected actualDate: Date;

  constructor(
    protected dialog: MatDialog,
    protected playerService: PlayerService,
    protected pokemonService: PokemonQueriesService,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected timeService: TimeService,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        switchMap((player) => {
          this.player = player;
          return this.timeService.getActualDate();
        }),
        switchMap((date) => {
          this.actualDate = date;
          return this.calendarEventQueriesService
            .list({
              custom: {
                trainers: {
                  $in: this.player._id,
                },
                date: {
                  $gte: date,
                },
                type: CalendarEventEvent.BATTLE,
              },
              limit: 2,
              sort: {
                date: 1,
              },
            })
            .pipe(
              map((result) => {
                return result[0].event.winner ? result[1] : result[0];
              }),
              tap((nextBattle) => {
                this.dayToNextBattle = this.getDayToNextBattle(
                  new Date(nextBattle.date)
                );
              })
            );
        })
      )
      .subscribe((nextBattle) => {
        this.nextBattle = nextBattle;
      });
  }

  protected getDayToNextBattle(battleDate: Date): string {
    const diffInMilliseconds = battleDate.getTime() - this.actualDate.getTime();
    const days = Math.abs(diffInMilliseconds / (1000 * 60 * 60 * 24));
    switch (days) {
      case 0:
        return this.translateService.instant('TODAY');
      case 1:
        return this.translateService.instant('TOMORROW');
      default:
        return this.translateService.instant('IN_X_DAYS', {
          days,
        });
    }
  }

  protected click(): void {
    this.dialog
      .open(PokemonFormComponent)
      .afterClosed()
      .subscribe((pokemon) =>
        pokemon ? this.createPokemon(pokemon) : undefined
      );
  }

  protected createPokemon(pokemon: PokemonModel): void {
    this.pokemonService
      .create(pokemon)
      .subscribe((newpokemon) => console.log(newpokemon));
  }

  protected goToCreateCalendarEvent(): void {
    this.dialog.open(AddCalendarEventComponent);
  }
}
