import { Component, DestroyRef } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
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
import { switchMap } from 'rxjs';

@Component({
  selector: 'pm-add-game',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent {
  protected gameForm = new FormGroup({
    gameName: new FormControl<string>(undefined, Validators.required),
    playerName: new FormControl<string>(undefined, Validators.required),
  });

  constructor(
    protected router: RouterService,
    protected gameQueriesService: GameQueriesService,
    protected cacheService: CacheService,
    protected destroyRef: DestroyRef
  ) {}

  protected submit(): void {
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
}
