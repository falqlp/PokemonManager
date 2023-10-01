import { Component } from '@angular/core';
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
import { Router } from '@angular/router';
import { GameModel } from '../../../models/game.model';
import { TrainerModel } from '../../../models/TrainersModels/trainer.model';
import { GameQueriesService } from '../../../services/queries/game-queries.service';
import { CacheService } from '../../../services/cache.service';
import { DialogRef } from '@angular/cdk/dialog';

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
    protected router: Router,
    protected gameQueriesService: GameQueriesService,
    protected cacheService: CacheService,
    protected dialogRef: DialogRef<AddGameComponent>
  ) {}

  protected submit(): void {
    const createdGame = {
      name: this.gameForm.controls.gameName.value,
      player: { name: this.gameForm.controls.playerName.value } as TrainerModel,
    } as GameModel;
    this.gameQueriesService
      .createWithUser(createdGame, this.cacheService.getUserId())
      .subscribe((game) => {
        this.cacheService.setGameId(game._id);
        this.router.navigateByUrl('home');
        this.dialogRef.close();
      });
  }
}
