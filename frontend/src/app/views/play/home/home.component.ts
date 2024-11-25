import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { PokemonQueriesService } from 'src/app/services/queries/pokemon-queries.service';
import { AddCalendarEventComponent } from '../../../modals/add-calendar-event/add-calendar-event.component';
import { filter, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { DisplayPokemonImageComponent } from '../../../components/display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../../../components/display-type/display-type.component';
import { RankingComponent } from '../../../components/ranking/ranking.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { SimpleDisplayStatsComponent } from '../../../components/simple-display-stats/simple-display-stats.component';
import { TournamentRankingComponent } from '../../../components/ranking/tournament-ranking/tournament-ranking.component';
import { GroupsRankingComponent } from '../../../components/ranking/groups-ranking/groups-ranking.component';
import { BattleEventsQueriesService } from '../../../services/queries/battle-events-queries.service';
import { BattleEventQueryType } from '../../../models/battle-events.model';
import { TimeService } from '../../../services/time.service';
import { NumberFormatterPipe } from '../../../pipes/number-formatter.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    DisplayPokemonImageComponent,
    DisplayTypeComponent,
    RankingComponent,
    MatTabsModule,
    MatButtonModule,
    TranslateModule,
    SimpleDisplayStatsComponent,
    TournamentRankingComponent,
    GroupsRankingComponent,
    NumberFormatterPipe,
  ],
})
export class HomeComponent implements OnInit {
  protected dialog = inject(MatDialog);
  protected playerService = inject(PlayerService);
  protected pokemonService = inject(PokemonQueriesService);
  private readonly battleEventsQueriesService: BattleEventsQueriesService =
    inject(BattleEventsQueriesService);

  private readonly timeService: TimeService = inject(TimeService);

  protected player = signal<TrainerModel>(null);
  protected readonly environment = environment;
  protected statsByPokemon: Record<string, number> = {};

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        filter((player) => !!player),
        switchMap((player) => {
          this.player.set(player);
          return this.timeService.getActualDate();
        }),
        switchMap((actualDate) => {
          Date.UTC(actualDate.getUTCFullYear(), 0, 1);
          return this.battleEventsQueriesService.getBattleEventStats(
            BattleEventQueryType.TOTAL_DAMAGE,
            true,
            {
              period: {
                startDate: new Date(actualDate.getFullYear(), 0, 1),
                endDate: new Date(actualDate.getFullYear() + 1, 0, 1),
              },
              pokemonIds: this.player().pokemons.map((pokemon) => pokemon._id),
            }
          );
        })
      )
      .subscribe((stats) => {
        stats.forEach((stat) => {
          this.statsByPokemon[stat.pokemon._id] = stat.value;
        });
      });
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
    console.log(pokemon);
  }

  protected goToCreateCalendarEvent(): void {
    this.dialog.open(AddCalendarEventComponent);
  }
}
