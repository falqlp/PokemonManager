import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameModel } from '../../../models/game.model';
import { TrainerModel } from '../../../models/TrainersModels/trainer.model';
import { GameQueriesService } from '../../../services/queries/game-queries.service';
import { CacheService } from '../../../services/cache.service';
import { RouterService } from '../../../services/router.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user.model';
import { AsyncPipe } from '@angular/common';
import { PlayerModel } from '../../../models/player.model';

@Component({
  selector: 'pm-add-game',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    MatExpansionModule,
    AsyncPipe,
  ],
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent implements OnInit {
  protected gameForm = new FormGroup({
    gameName: new FormControl<string>(undefined, Validators.required),
    playerName: new FormControl<string>(undefined, Validators.required),
  });

  protected friendForm = new FormControl<string>('');
  protected $user: Observable<UserModel> = this.userService.$user;
  protected $friends: Observable<UserModel[]>;
  protected friendIdList: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { friendId: string },
    private router: RouterService,
    private gameQueriesService: GameQueriesService,
    private cacheService: CacheService,
    private destroyRef: DestroyRef,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.friendIdList.push(this.data.friendId);
    this.$friends = this.$user.pipe(
      switchMap((user) => {
        return this.friendForm.valueChanges.pipe(
          startWith(''),
          map(() => user)
        );
      }),
      map((user) => {
        return user.friends
          .filter((friend) => {
            return friend.username
              .toLowerCase()
              .includes(this.friendForm.value.toLowerCase());
          })
          .slice(0, 5);
      })
    );
  }

  protected submit(): void {
    const players: PlayerModel[] = this.friendIdList.map((userId) => {
      return { userId, playingTime: 0 };
    });
    players.push({
      userId: this.cacheService.getUserId(),
      trainer: {
        name: this.gameForm.controls.playerName.value,
      } as TrainerModel,
      playingTime: 0,
    });
    const createdGame = {
      name: this.gameForm.controls.gameName.value,
      player: { name: this.gameForm.controls.playerName.value } as TrainerModel,
    } as GameModel;
    this.gameQueriesService
      .createWithUser(createdGame, this.cacheService.getUserId())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((game) => {
          this.cacheService.setGameId(game._id);
          this.cacheService.setTrainerId(game.player._id);
          this.router.navigateByUrl('starters');
          return this.gameQueriesService.initGame(game.player._id);
        })
      )
      .subscribe();
  }

  protected addFriend(friend: UserModel): void {
    this.friendIdList.push(friend._id);
  }

  protected deleteFriend(friend: UserModel): void {
    this.friendIdList = this.friendIdList.filter((id) => id !== friend._id);
  }
}
