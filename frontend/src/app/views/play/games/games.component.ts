import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserQueriesService } from '../../../services/queries/user-queries.service';
import { Languages, UserModel } from '../../../models/user.model';

import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, first } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalDatePipe } from '../../../pipes/local-date.pipe';
import { GameModel } from '../../../models/game.model';
import { CacheService } from '../../../services/cache.service';
import { MatButtonModule } from '@angular/material/button';
import { DisplayPokemonImageComponent } from '../../../components/display-pokemon-image/display-pokemon-image.component';
import { MatDialog } from '@angular/material/dialog';
import { AddGameComponent } from './add-game/add-game.component';
import { MatIconModule } from '@angular/material/icon';
import { GameQueriesService } from '../../../services/queries/game-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterService } from '../../../services/router.service';
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from '../../../services/language.service';
import { FriendsComponent } from './friends/friends.component';
import { MatBadgeModule } from '@angular/material/badge';
import { UserService } from '../../../services/user.service';
import { PlayerModel } from '../../../models/player.model';
import { AddPlayerToGameComponent } from './add-player-to-game/add-player-to-game.component';
import { NewsDialogComponent } from '../../../modals/news-dialog/news-dialog.component';

@Component({
  selector: 'pm-games',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    TranslateModule,
    LocalDatePipe,
    MatButtonModule,
    DisplayPokemonImageComponent,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  private userQueriesService = inject(UserQueriesService);
  private cacheService = inject(CacheService);
  private gameQueriesService = inject(GameQueriesService);
  private router = inject(RouterService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private userService = inject(UserService);

  protected user = signal<UserModel>(null);
  protected gameSubject = new BehaviorSubject<GameModel[]>(undefined);
  protected $game = this.gameSubject.asObservable();
  protected displayedColumns = [
    'name',
    'actualDate',
    'player',
    'pokemons',
    'playingTime',
    'play',
    'delete',
  ];

  protected settings = {
    languages: [Languages.FR, Languages.EN],
  };

  protected currentLang: string;

  public ngOnInit(): void {
    this.cacheService.setGameId(undefined);
    this.cacheService.setTrainerId(undefined);
    this.languageService
      .getLanguage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => (this.currentLang = lang));
    this.userService.$user
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: UserModel) => {
        this.user.set(user);
        this.gameSubject.next(user.games);
      });
    this.userService.$user
      .pipe(takeUntilDestroyed(this.destroyRef), first())
      .subscribe((user) => {
        if (!user.hasReadNews) {
          this.dialog.open(NewsDialogComponent);
        }
      });
  }

  protected click(game: GameModel): void {
    if (this.getPlayer(game.players)?.trainer) {
      this.cacheService.setGameId(game._id);
      this.cacheService.setTrainerId(this.getPlayer(game.players).trainer._id);
      this.router.navigateByUrl('play/home');
    } else {
      this.dialog.open(AddPlayerToGameComponent, { data: game });
    }
    this.gameQueriesService.initIfNot(game._id).pipe(first()).subscribe();
  }

  protected addGame(): void {
    this.dialog.open(AddGameComponent);
  }

  protected delete(game: GameModel): void {
    this.gameQueriesService
      .deleteGame(game._id, this.user()._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected formatPlayingTime(time: number): string {
    if (!time) {
      return '00:00';
    }
    const minutes = Math.floor(time / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes =
      remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes;

    return `${formattedHours}:${formattedMinutes}`;
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

  protected changeLanguage(lang: Languages): void {
    this.translateService.use(lang);
    this.currentLang = this.translateService.currentLang;
    this.languageService.setLanguage(this.currentLang);
    this.userQueriesService
      .changeLanguage(this.user()._id, lang)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected logout(): void {
    this.router.navigateByUrl('login');
  }

  protected friends(): void {
    this.dialog.open(FriendsComponent);
  }

  protected getPlayer(players: PlayerModel[]): PlayerModel {
    return players.find((player) => player.userId === this.user()._id);
  }
}
