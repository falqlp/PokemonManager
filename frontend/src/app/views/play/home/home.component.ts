import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { PokemonQueriesService } from 'src/app/services/queries/pokemon-queries.service';
import { AddCalendarEventComponent } from '../../../modals/add-calendar-event/add-calendar-event.component';
import { filter } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { DisplayPokemonImageComponent } from '../../../components/display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../../../components/display-type/display-type.component';
import { AsyncPipe } from '@angular/common';
import { TrainerNameComponent } from '../../../components/trainer-name/trainer-name.component';
import { RankingComponent } from '../../../components/ranking/ranking.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MoveComponent } from '../../../components/move/move.component';
import { SimpleDisplayStatsComponent } from '../../../components/simple-display-stats/simple-display-stats.component';
import { TournamentRankingComponent } from '../../../components/ranking/tournament-ranking/tournament-ranking.component';
import { GroupsRankingComponent } from '../../../components/ranking/groups-ranking/groups-ranking.component';

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
    TournamentRankingComponent,
    GroupsRankingComponent,
  ],
})
export class HomeComponent implements OnInit {
  protected dialog = inject(MatDialog);
  protected playerService = inject(PlayerService);
  protected pokemonService = inject(PokemonQueriesService);

  protected player = signal<TrainerModel>(null);
  protected readonly environment = environment;

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(filter((player) => !!player))
      .subscribe((player) => {
        this.player.set(player);
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
