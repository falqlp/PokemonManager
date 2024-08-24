import { Component, DestroyRef, input, OnInit, inject } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DisplayPokemonImageComponent } from '../display-pokemon-image/display-pokemon-image.component';
import { DisplayTypeComponent } from '../display-type/display-type.component';
import { MoveComponent } from '../move/move.component';
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
import { MatDialog } from '@angular/material/dialog';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { ModifyMoveModalComponent } from '../../modals/modify-move-modal/modify-move-modal.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { filter } from 'rxjs';

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
  protected playerService = inject(PlayerService);
  protected destroyRef = inject(DestroyRef);
  protected dialog = inject(MatDialog);

  protected player: TrainerModel;
  public form = input.required<FormArray<FormArray<FormControl<number>>>>();

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
          this.form().push(formStrategy);
        });
        this.player = player;
      });
  }

  protected modifyMove(pokemon: PokemonModel): void {
    this.dialog.open(ModifyMoveModalComponent, { data: pokemon });
  }
}
