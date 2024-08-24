import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TrainerModel } from '../../../models/TrainersModels/trainer.model';
import { GameQueriesService } from '../../../services/queries/game-queries.service';
import { CacheService } from '../../../services/cache.service';
import { RouterService } from '../../../services/router.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, Observable, startWith, switchMap, tap } from 'rxjs';
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
  data = inject(MAT_DIALOG_DATA);
  private router = inject(RouterService);
  private gameQueriesService = inject(GameQueriesService);
  private cacheService = inject(CacheService);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private dialogRef = inject<MatDialogRef<AddGameComponent>>(MatDialogRef);

  protected gameForm = new FormGroup({
    gameName: new FormControl<string>(undefined, Validators.required),
    playerName: new FormControl<string>(undefined, Validators.required),
  });

  protected friendForm = new FormControl<string>('');
  protected $user: Observable<UserModel> = this.userService.$user;
  protected $friends: Observable<UserModel[]>;
  protected friendIdList: string[] = [];

  public ngOnInit(): void {
    if (this.data) {
      this.friendIdList.push(this.data.friendId);
    }
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
    players.unshift({
      userId: this.cacheService.getUserId(),
      trainer: {
        name: this.gameForm.controls.playerName.value,
      } as TrainerModel,
      playingTime: 0,
    });
    this.gameQueriesService
      .createWithUsers(players, this.gameForm.controls.gameName.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((game) => {
          this.cacheService.setGameId(game._id);
          const trainerId = game.players.find(
            (player) => player.userId === this.cacheService.getUserId()
          ).trainer._id;
          this.cacheService.setTrainerId(trainerId);
          this.router.navigateByUrl('play/starters');
          this.dialogRef.close();
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
