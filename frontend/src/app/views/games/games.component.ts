import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { Languages, UserModel } from '../../models/user.model';
import { NgForOf, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { MatMenuModule } from '@angular/material/menu';
import { LanguageService } from '../../services/language.service';
import { FriendsComponent } from './friends/friends.component';
import { MatBadgeModule } from '@angular/material/badge';
import { UserService } from '../../services/user.service';

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
    MatMenuModule,
    MatBadgeModule,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
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

  constructor(
    private userQueriesService: UserQueriesService,
    private cacheService: CacheService,
    private gameQueriesService: GameQueriesService,
    private router: RouterService,
    private dialog: MatDialog,
    private destroyRef: DestroyRef,
    private languageService: LanguageService,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.cacheService.setGameId(undefined);
    this.languageService
      .getLanguage()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => (this.currentLang = lang));
    this.userService.$user
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: UserModel) => {
        this.user.set(user);
      });
  }

  protected click(game: GameModel): void {
    this.cacheService.setGameId(game._id);
    this.cacheService.setTrainerId(game.player._id);
    this.router.navigateByUrl('home');
  }

  protected addGame(): void {
    this.dialog.open(AddGameComponent);
  }

  protected delete(game: GameModel): void {
    this.gameQueriesService
      .delete(game._id)
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
    this.user().lang = lang;
    this.userQueriesService
      .update(this.user(), this.user()._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected logout(): void {
    this.router.navigateByUrl('login');
  }

  protected friends(): void {
    this.dialog.open(FriendsComponent);
  }
}
