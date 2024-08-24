import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pm-change-nickname',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './change-nickname.component.html',
  styleUrls: ['./change-nickname.component.scss'],
})
export class ChangeNicknameComponent implements OnInit {
  data = inject<PokemonModel>(MAT_DIALOG_DATA);
  protected pokemonQueriesService = inject(PokemonQueriesService);
  protected destroyRef = inject(DestroyRef);

  protected form: FormGroup<{ nickname: FormControl<string> }>;

  public ngOnInit(): void {
    this.form = new FormGroup({
      nickname: new FormControl<string>(this.data.nickname),
    });
  }

  protected click(): void {
    const nickname =
      this.form.controls.nickname.value === ''
        ? null
        : this.form.controls.nickname.value;
    this.pokemonQueriesService
      .changeNickname(this.data._id, nickname)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
