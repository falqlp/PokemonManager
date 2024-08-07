import { Component, DestroyRef, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../../components/display-type/display-type.component';
import { MoveComponent } from '../../components/move/move.component';
import { MatSliderModule } from '@angular/material/slider';
import {
  FormArray,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { NotifierService } from '../../services/notifier.service';
import { MatDialog } from '@angular/material/dialog';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { ModifyMoveModalComponent } from '../../modals/modify-move-modal/modify-move-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { debounceTime, filter, Observable, switchMap } from 'rxjs';

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
    MatButtonToggleModule,
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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value)
      )
      .subscribe((player) => {
        player.pokemons.forEach((pokemon) => {
          const formStrategy = new FormArray<FormControl<number>>([]);
          pokemon.strategy = pokemon.strategy ?? [];
          pokemon.moves.forEach((move, index) => {
            formStrategy.push(
              new FormControl<number>(
                pokemon.strategy[index] ?? 9,
                Validators.required
              )
            );
          });
          this.form.push(formStrategy);
        });
        this.player = player;
      });
    this.form.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap(() => this.save()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.save());
  }

  private save(): Observable<void> {
    return this.pokemonQueriesService.modifyStrategy(
      this.form.value.map((strategy, index) => {
        return {
          strategy,
          pokemonId: this.player.pokemons[index]._id,
        };
      }),
      this.player._id
    );
  }

  protected modifyMove(pokemon: PokemonModel): void {
    this.dialog.open(ModifyMoveModalComponent, { data: pokemon });
  }

  protected compareArray(array1: number[], array2: number[]): boolean {
    if (!array1 || !array2) {
      return false;
    }
    let isEqual = true;
    for (let i = 0; i < array1.length; i++) {
      if (array1.at(i) !== array2.at(i)) {
        isEqual = false;
      }
    }
    return isEqual;
  }
}
