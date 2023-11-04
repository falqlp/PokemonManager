import { Component, DestroyRef, OnInit } from '@angular/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { UserModel } from '../../models/user.model';
import { NgForOf, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { GameModel } from '../../models/game.model';
import { CacheService } from '../../services/cache.service';
import { MatButtonModule } from '@angular/material/button';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatDialog } from '@angular/material/dialog';
import { AddGameComponent } from './add-game/add-game.component';
import { MatIconModule } from '@angular/material/icon';
import { GameQueriesService } from '../../services/queries/game-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'pm-games',
  standalone: true,
  imports: [
    NgIf,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    LocalDatePipe,
    MatButtonModule,
    DisplayPokemonImageComponent,
    NgForOf,
    MatIconModule,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  protected user: UserModel;
  protected gameSubject = new BehaviorSubject<GameModel[]>(undefined);
  protected $game = this.gameSubject.asObservable();
  protected displayedColumns = [
    'name',
    'actualDate',
    'player',
    'pokemons',
    'play',
    'delete',
  ];

  constructor(
    protected userQueriesService: UserQueriesService,
    protected cacheService: CacheService,
    protected gameQueriesService: GameQueriesService,
    protected router: RouterService,
    protected dialog: MatDialog,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.cacheService.removeGameId();
    this.update();
  }

  protected click(game: GameModel): void {
    this.cacheService.setGameId(game._id);
    this.router.navigateByUrl('home');
  }

  protected addGame(): void {
    this.dialog.open(AddGameComponent);
  }

  protected delete(game: GameModel): void {
    this.gameQueriesService
      .delete(game._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.update();
      });
  }

  protected update(): void {
    this.userQueriesService
      .get(this.cacheService.getUserId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.user = user;
        this.gameSubject.next(user.games);
      });
  }
}
