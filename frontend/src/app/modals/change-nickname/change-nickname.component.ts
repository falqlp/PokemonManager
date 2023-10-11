import { Component, DestroyRef, Inject, OnInit } from '@angular/core';
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
  protected form: FormGroup<{ nickname: FormControl<string> }>;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: PokemonModel,
    protected pokemonQueriesService: PokemonQueriesService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.form = new FormGroup({
      nickname: new FormControl<string>(this.data.nickname),
    });
  }

  protected click(): void {
    this.data.nickname =
      this.form.controls.nickname.value === ''
        ? null
        : this.form.controls.nickname.value;
    this.pokemonQueriesService
      .update(this.data, this.data._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
