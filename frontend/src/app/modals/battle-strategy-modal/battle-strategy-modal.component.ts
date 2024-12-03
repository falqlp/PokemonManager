import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
import { PlayerService } from '../../services/player.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable, switchMap } from 'rxjs';
import { BattleStrategyComponent } from '../../components/battle-strategy/battle-strategy.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { BattleEventsStatsGraphComponent } from '../../views/play/battle-events-stats/battle-events-stats-graph/battle-events-stats-graph.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  BattleEventQueryType,
  DamageEventQueryModel,
} from '../../models/battle-events.model';
import { BattleModel } from '../../models/Battle.model';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { RouterService } from '../../services/router.service';
import { DialogButtonsModel } from '../generic-dialog/generic-dialog.models';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { TrainerNameComponent } from '../../components/trainer-name/trainer-name.component';
import { RankingPipe } from '../../pipes/ranking.pipe';

@Component({
  selector: 'pm-battle-strategy-modal',
  standalone: true,
  imports: [
    BattleStrategyComponent,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    TranslateModule,
    MatDialogClose,
    MatTabGroup,
    MatTab,
    BattleEventsStatsGraphComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    ReactiveFormsModule,
    SpinnerComponent,
    MatDialogTitle,
    TrainerNameComponent,
    RankingPipe,
  ],
  templateUrl: './battle-strategy-modal.component.html',
  styleUrl: './battle-strategy-modal.component.scss',
})
export class BattleStrategyModalComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly playerService: PlayerService = inject(PlayerService);
  private readonly routerService = inject(RouterService);
  private readonly dialogRef = inject(
    MatDialogRef<BattleStrategyModalComponent>
  );

  private readonly dialog = inject(MatDialog);
  private readonly battleInstanceQueriesService = inject(
    BattleInstanceQueriesService
  );

  protected readonly data: {
    battle: BattleModel;
    isMultiplayerBattle: boolean;
  } = inject(MAT_DIALOG_DATA);

  private readonly pokemonQueriesService: PokemonQueriesService = inject(
    PokemonQueriesService
  );

  protected readonly indicators = Object.values(BattleEventQueryType);
  protected readonly statsQueryForm = new FormGroup({
    indicator: new FormControl<BattleEventQueryType>(
      BattleEventQueryType.TOTAL_DAMAGE
    ),
    isRelative: new FormControl<boolean>(true),
  });

  protected readonly strategyForms = new FormArray<
    FormArray<FormControl<number>>
  >([]);

  protected opponent: TrainerModel;
  protected player: TrainerModel;
  protected query: DamageEventQueryModel;

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        filter((value) => !!value),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((player) => {
        this.player = player;
        this.opponent =
          player._id === this.data.battle.player._id
            ? this.data.battle.opponent
            : this.data.battle.player;
        this.query = {
          trainerIds: [this.opponent._id],
        };
      });
  }

  private save(): Observable<void> {
    return this.pokemonQueriesService.modifyBattleStrategy(
      this.strategyForms.value.map((strategy, index) => {
        return {
          strategy,
          pokemonId: this.player.pokemons[index]._id,
        };
      }),
      this.player._id
    );
  }

  protected goToBattle(): void {
    this.save()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close();
        this.routerService.navigate(['play', 'battle', this.data.battle._id]);
      });
  }

  protected goToPc(): void {
    this.routerService.navigate(['play', 'pcStorage']);
  }

  protected simulate(): void {
    const lambdaButtons: DialogButtonsModel[] = [
      {
        label: 'YES',
        color: 'warn',
        close: true,
      },
      {
        label: 'NO',
        color: 'primary',
        close: true,
      },
    ];
    this.dialog
      .open(GenericDialogComponent, {
        data: {
          buttons: lambdaButtons,
          message: 'SURE_SIMULATE',
        },
      })
      .afterClosed()
      .pipe(
        filter((value) => value === 'YES'),
        switchMap(() => this.save()),
        switchMap(() => {
          return this.battleInstanceQueriesService.simulateBattle(
            this.data.battle
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.routerService.navigate(['play', 'battle-summary'], {
          queryParams: { battle: this.data.battle._id },
        });
        this.dialog.closeAll();
      });
  }
}
