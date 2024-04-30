import { Component, DestroyRef, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../../components/display-type/display-type.component';
import { MoveComponent } from '../../components/move/move.component';
import { MatSliderModule } from '@angular/material/slider';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import {
  NotificationType,
  NotifierService,
} from '../../services/notifier.service';
import { MatDialog } from '@angular/material/dialog';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { ModifyMoveModalComponent } from '../../modals/modify-move-modal/modify-move-modal.component';

@Component({
  selector: 'pm-battle-strategy',
  standalone: true,
  imports: [
    DisplayPokemonImageComponent,
    DisplayTypeComponent,
    MoveComponent,
    MatSliderModule,
    FormsModule,
    TranslateModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './battle-strategy.component.html',
  styleUrl: './battle-strategy.component.scss',
})
export class BattleStrategyComponent implements OnInit {
  protected player: TrainerModel;
  protected form = new FormArray<FormArray<FormControl<number>>>([]);
  constructor(
    protected playerService: PlayerService,
    protected destroyRef: DestroyRef,
    protected pokemonQueriesService: PokemonQueriesService,
    protected notifierService: NotifierService,
    protected dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((player) => {
        player.pokemons.forEach((pokemon) => {
          const formStrategy = new FormArray<FormControl<number>>(
            [],
            this.sumValidator(100)
          );
          pokemon.strategy = pokemon.strategy ?? [];
          pokemon.moves.forEach((move, index) => {
            formStrategy.push(
              new FormControl<number>(pokemon.strategy[index] ?? 10)
            );
          });
          this.form.push(formStrategy);
        });
        this.player = player;
      });
  }

  protected save(index: number): void {
    this.pokemonQueriesService
      .update(
        {
          ...this.player.pokemons[index],
          strategy: this.form.controls.at(index).getRawValue(),
        },
        this.player.pokemons[index]._id
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notifierService.notify(
          'MODIFICATIONS_SAVED',
          NotificationType.Success
        );
      });
  }

  private sumValidator(targetSum: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const sum = formArray.controls
        .map((ctrl) => parseFloat(ctrl.value) || 0)
        .reduce((acc, current) => acc + current, 0);

      return sum === targetSum
        ? null
        : { sumError: { requiredSum: targetSum, currentSum: sum } };
    };
  }

  protected modifyMove(pokemon: PokemonModel): void {
    this.dialog.open(ModifyMoveModalComponent, { data: pokemon });
  }
}
