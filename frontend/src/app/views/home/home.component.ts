import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PokemonFormComponent } from 'src/app/modals/pokemon-form/pokemon-form.component';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { PokemonQueriesService } from 'src/app/services/queries/pokemon-queries.service';
import { Router } from '@angular/router';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MoveLearningQueriesService } from '../../services/queries/move-learning-queries.service';
import { AddCalendarEventComponent } from '../../modals/add-calendar-event/add-calendar-event.component';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { TimeService } from '../../services/time.service';
import { GameQueriesService } from '../../services/queries/game-queries.service';
import { WebsocketService } from '../../services/websocket.service';
import { NotifierService } from 'angular-notifier';
import { NurseryWishlistFormComponent } from '../../modals/nursery-wishlist-form/nursery-wishlist-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  protected pokemonBases: PokemonBaseModel[];
  protected player: TrainerModel;
  protected opponent: TrainerModel;
  protected progress = 50;
  protected actualDate: Date;

  constructor(
    protected moveLearningService: MoveLearningQueriesService,
    protected router: Router,
    protected dialog: MatDialog,
    protected playerService: PlayerService,
    protected pokemonService: PokemonQueriesService,
    protected battleQueries: BattleInstanceQueriesService,
    protected trainerService: TrainerQueriesService,
    protected gameQueriesService: GameQueriesService,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected pokemonQueriesService: PokemonQueriesService,
    protected timeService: TimeService,
    protected http: HttpClient,
    protected translateService: TranslateService,
    protected webSocketService: WebsocketService,
    protected notifierService: NotifierService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$.subscribe((player) => {
      this.player = player;
    });
    this.trainerService.get('6496f985f15bc10f660c1958').subscribe((trainer) => {
      this.opponent = trainer;
    });
    this.timeService.getActualDate().subscribe((date) => {
      this.actualDate = date;
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

  protected clickP(): void {
    this.dialog.open(NurseryWishlistFormComponent);
  }

  protected createPokemon(pokemon: PokemonModel): void {
    this.pokemonService
      .create(pokemon)
      .subscribe((newpokemon) => console.log(newpokemon));
  }

  protected startBattle(): void {
    this.battleQueries
      .create({
        player: this.player,
        opponent: this.opponent,
      })
      .subscribe((battle) => {
        this.router.navigate(['battle'], {
          queryParams: { battle: battle._id },
        });
      });
  }

  protected goToPc(): void {
    this.router.navigate(['pcStorage']);
  }

  protected testRoute(): void {
    this.http
      .get('/api/xp/weeklyXpGain/' + this.player._id)
      .subscribe(console.log);
  }

  protected goToTrainers(): void {
    this.router.navigate(['trainers']);
  }

  protected goToCreateCalendarEvent(): void {
    this.dialog.open(AddCalendarEventComponent);
  }

  protected goToGames(): void {
    this.router.navigateByUrl('games');
  }
}
