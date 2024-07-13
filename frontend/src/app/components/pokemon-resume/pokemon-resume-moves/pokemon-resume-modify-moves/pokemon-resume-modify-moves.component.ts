import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { MoveLearningQueriesService } from '../../../../services/queries/move-learning-queries.service';
import { MoveModel } from '../../../../models/move.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { PokemonQueriesService } from '../../../../services/queries/pokemon-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayerService } from '../../../../services/player.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'pm-pokemon-resume-modify-moves',
  standalone: true,
  imports: [
    NgForOf,
    MatCheckboxModule,
    ReactiveFormsModule,
    TranslateModule,
    NgClass,
    NgIf,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './pokemon-resume-modify-moves.component.html',
  styleUrls: ['./pokemon-resume-modify-moves.component.scss'],
})
export class PokemonResumeModifyMovesComponent implements OnInit {
  private playerService: PlayerService = inject(PlayerService);
  @Input() public pokemon: PokemonModel;
  @Output() public save = new EventEmitter<void>();
  protected selectedMoves: MoveModel[];
  protected moveForm: FormGroup<{
    moves: FormArray<
      FormGroup<{ move: FormControl<MoveModel>; checked: FormControl<boolean> }>
    >;
  }>;

  public constructor(
    protected moveLearningQueriesService: MoveLearningQueriesService,
    protected pokemonQueriesService: PokemonQueriesService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.init();
  }

  protected init(): void {
    const query = { sort: { power: -1 } };
    this.selectedMoves = this.pokemon.moves;
    this.moveLearningQueriesService
      .learnableMove(this.pokemon.basePokemon.id, this.pokemon.maxLevel, query)
      .subscribe((moves) => {
        this.moveForm = new FormGroup({
          moves: new FormArray(
            moves.map((move) => {
              return new FormGroup({
                move: new FormControl(move),
                checked: new FormControl(
                  !!this.pokemon.moves.find(
                    (pokemonMove) => pokemonMove._id === move._id
                  )
                ),
              });
            }),
            this.cutomValidator()
          ),
        });
        this.moveForm.controls.moves.valueChanges
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((formMoves) => {
            this.selectedMoves = formMoves
              .filter((formMove) => formMove.checked)
              .map((formMove) => formMove.move);
          });
      });
  }

  protected changeValue(control: AbstractControl): void {
    control.setValue(!control.value);
  }

  protected submit(): void {
    this.pokemon.moves = this.selectedMoves;
    this.playerService.player$
      .pipe(
        switchMap((player) =>
          this.pokemonQueriesService.modifyMoves(
            this.pokemon._id,
            this.selectedMoves.map((move) => move._id),
            player._id
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.save.emit());
  }

  protected cutomValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const moves = (
        control as FormArray<
          FormGroup<{
            move: FormControl<MoveModel>;
            checked: FormControl<boolean>;
          }>
        >
      ).value
        .filter((formMove) => formMove.checked)
        .map((formMove) => formMove.move);
      return moves.length < 1 || moves.length > 2
        ? { length: { value: true } }
        : null;
    };
  }
}
