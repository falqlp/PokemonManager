import { Component, DestroyRef, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameModel } from '../../../models/game.model';
import { UserService } from '../../../services/user.service';
import { switchMap } from 'rxjs';
import { TrainerModel } from '../../../models/TrainersModels/trainer.model';
import { RouterService } from '../../../services/router.service';
import { CacheService } from '../../../services/cache.service';
import { GameQueriesService } from '../../../services/queries/game-queries.service';

@Component({
  selector: 'pm-add-player-to-game',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    TranslateModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './add-player-to-game.component.html',
  styleUrl: './add-player-to-game.component.scss',
})
export class AddPlayerToGameComponent {
  data = inject<GameModel>(MAT_DIALOG_DATA);
  private gameQueriesService = inject(GameQueriesService);
  private destroyRef = inject(DestroyRef);
  private userService = inject(UserService);
  private routerService = inject(RouterService);
  private dialogRef =
    inject<MatDialogRef<AddPlayerToGameComponent>>(MatDialogRef);

  private cacheService = inject(CacheService);

  protected trainerNameForm = new FormControl<string>('', Validators.required);

  protected submit(): void {
    this.userService.$user
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((user) => {
          this.data.players = this.data.players.map((player) => {
            if (player.userId === user._id) {
              player.trainer = {
                name: this.trainerNameForm.value,
              } as TrainerModel;
            }
            return player;
          });
          this.cacheService.setGameId(this.data._id);
          return this.gameQueriesService.addPlayerToGame(this.data, user._id);
        })
      )
      .subscribe((trainer) => {
        this.cacheService.setTrainerId(trainer._id);
        this.dialogRef.close();
        this.routerService.navigateByUrl('starters');
      });
  }
}
