import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { combineLatest, debounceTime, map, startWith, switchMap } from 'rxjs';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import { TrainerQueriesService } from '../../services/trainer-queries.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TranslateService } from '@ngx-translate/core';
import { PokemonBaseQueriesService } from '../../services/pokemon-base-queries.service';
import { MoveModel } from '../../models/move.model';
import { MoveLearningService } from '../../services/move-learning.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-pokemon-form',
  templateUrl: './pokemon-form.component.html',
  styleUrls: ['./pokemon-form.component.scss'],
})
export class PokemonFormComponent implements OnInit {
  protected pokemonForm = new FormGroup({
    basePokemon: new FormControl<PokemonBaseModel>(null, Validators.required),
    nickname: new FormControl<string>(''),
    level: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    trainerId: new FormControl<string>('', Validators.required),
    moves: new FormControl<MoveModel[]>([], this.arrayMaxLength(2)),
  });

  protected trainers: TrainerModel[];
  protected pokemons: PokemonBaseModel[];
  protected filteredPokemons: Observable<PokemonBaseModel[]>;
  protected moves: MoveModel[];

  public constructor(
    protected dialogRef: MatDialogRef<PokemonFormComponent>,
    protected pokemonBaseService: PokemonBaseQueriesService,
    protected trainerService: TrainerQueriesService,
    protected translateService: TranslateService,
    protected moveLearningService: MoveLearningService
  ) {}

  public ngOnInit(): void {
    this.getData();
    this.subscribeLearnableMove();
  }

  protected getData(): void {
    this.pokemonBaseService.getAll().subscribe((pokemons) => {
      this.pokemons = pokemons.sort((a, b) => a.id - b.id);
      this.filteredPokemons =
        this.pokemonForm.controls.basePokemon.valueChanges.pipe(
          startWith(''),
          map((value) => this.filter(value as string))
        );
    });
    this.trainerService.getAll().subscribe((trainers) => {
      this.trainers = trainers.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  protected subscribeLearnableMove(): void {
    combineLatest([
      this.pokemonForm.controls.basePokemon.valueChanges,
      this.pokemonForm.controls.level.valueChanges.pipe(startWith(1)),
    ])
      .pipe(
        debounceTime(500),
        switchMap(() => {
          const pokemonId = this.pokemons.find(
            (pokemon) =>
              pokemon._id === this.pokemonForm.controls.basePokemon.value._id
          )?.id;
          return this.moveLearningService.learnableMove(
            pokemonId,
            this.pokemonForm.controls.level.value
          );
        })
      )
      .subscribe((moves) => {
        this.moves = moves;
      });
  }

  protected filter(value: string): PokemonBaseModel[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();

      return this.pokemons.filter((option) =>
        this.translateService
          .instant(option.name)
          .toLowerCase()
          .startsWith(filterValue)
      );
    }
    return [];
  }

  protected submit(): void {
    this.dialogRef.close({
      ...this.pokemonForm.value,
    } as PokemonModel);
  }

  protected displayPokemon(pokemon: PokemonBaseModel): string {
    if (pokemon) {
      return this.translateService.instant(pokemon.name);
    }
    return '';
  }

  protected moveSelectionChange(event: MatSelectChange): void {
    const oldValue = this.pokemonForm.controls.moves.value;
    if (!oldValue.includes(event.value)) {
      const updatedMoves = [...oldValue, event.value];
      this.pokemonForm.controls.moves.setValue(updatedMoves);
    }
  }

  protected arrayMaxLength(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const arrayLength = control.value.length;
      return arrayLength > max ? { maxLength: { value: arrayLength } } : null;
    };
  }
}
