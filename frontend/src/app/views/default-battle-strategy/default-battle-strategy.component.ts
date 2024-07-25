import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { BattleStrategyComponent } from '../../components/battle-strategy/battle-strategy.component';
import { debounceTime, filter, Observable, switchMap } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'pm-default-battle-strategy',
  standalone: true,
  imports: [BattleStrategyComponent],
  templateUrl: './default-battle-strategy.component.html',
  styleUrl: './default-battle-strategy.component.scss',
})
export class DefaultBattleStrategyComponent implements OnInit {
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
}
