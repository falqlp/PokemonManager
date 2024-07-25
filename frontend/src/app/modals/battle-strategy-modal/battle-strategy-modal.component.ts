import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { FormArray, FormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable } from 'rxjs';
import { BattleStrategyComponent } from '../../components/battle-strategy/battle-strategy.component';
import { MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'pm-battle-strategy-modal',
  standalone: true,
  imports: [BattleStrategyComponent, MatDialogContent],
  templateUrl: './battle-strategy-modal.component.html',
  styleUrl: './battle-strategy-modal.component.scss',
})
export class BattleStrategyModalComponent implements OnInit {
  private readonly pokemonQueriesService: PokemonQueriesService = inject(
    PokemonQueriesService
  );

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly playerService: PlayerService = inject(PlayerService);
  protected player: TrainerModel;

  protected form = new FormArray<FormArray<FormControl<number>>>([]);

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value)
      )
      .subscribe((player) => {
        this.player = player;
      });
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
}
