import { Component, DestroyRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { ChangeNicknameComponent } from '../change-nickname/change-nickname.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EggHatchedModel } from '../../services/websocket-event.service';

@Component({
  selector: 'pm-egg-hatched',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, TranslateModule],
  templateUrl: './egg-hatched.component.html',
  styleUrls: ['./egg-hatched.component.scss'],
})
export class EggHatchedComponent {
  data = inject<EggHatchedModel>(MAT_DIALOG_DATA);
  protected pokemonQueriesService = inject(PokemonQueriesService);
  protected dialog = inject(MatDialog);
  protected destroyRef = inject(DestroyRef);
  protected dialogRef = inject<MatDialogRef<EggHatchedComponent>>(MatDialogRef);

  protected message: string;
  protected cracksNumber = 0;

  protected addCracked(): void {
    this.cracksNumber += 1;
  }

  protected changeNickname(): void {
    const pokemon = {
      pokemonBase: this.data.pokemonBase,
      hatchingDate: null,
      level: 1,
      _id: this.data._id,
    } as unknown as PokemonModel;
    this.hatchEgg();
    this.dialog.open(ChangeNicknameComponent, { data: pokemon });
  }

  protected close(): void {
    this.hatchEgg();
    this.dialogRef.close();
  }

  private hatchEgg(): void {
    this.pokemonQueriesService
      .hatchEgg(this.data._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
