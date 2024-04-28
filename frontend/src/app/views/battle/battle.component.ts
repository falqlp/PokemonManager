import { DestroyRef, Input, OnInit, signal } from '@angular/core';
import { Component } from '@angular/core';
import { BattleService } from './battle.service';
import { ROUND_TIME_MS } from './battle.const';
import { combineLatest } from 'rxjs';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BattleQueriesService } from './battle-queries.service';
import { BattleTrainerModel } from './battle.model';
import { PlayerService } from '../../services/player.service';
import { RouterService } from '../../services/router.service';
import { BattleTrainerPokemonsComponent } from './components/battle-trainer-pokemons/battle-trainer-pokemons.component';
import { BattleSceneComponent } from './components/battle-scene/battle-scene.component';
import { BattlePlayerMoveComponent } from './components/battle-move/battle-player-move.component';
import { BattleOpponentPokemonsComponent } from './components/battle-oppenent-pokemon/battle-opponent-pokemons.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'pm-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
  standalone: true,
  imports: [
    BattleTrainerPokemonsComponent,
    BattleSceneComponent,
    BattlePlayerMoveComponent,
    BattleOpponentPokemonsComponent,
    NgIf,
  ],
})
export class BattleComponent implements OnInit {
  @Input('id') public battleId: string;
  private playerId: string; // id dans le battleInstance
  protected started = false;
  protected battleLoop: number;
  protected opponent: BattleTrainerModel;
  protected player = signal<BattleTrainerModel>(null);

  public constructor(
    protected service: BattleService,
    protected battleInstanceQueriesService: BattleInstanceQueriesService,
    protected battleQueriesService: BattleQueriesService,
    protected router: RouterService,
    protected destroyRef: DestroyRef,
    protected playerService: PlayerService
  ) {}

  public ngOnInit(): void {
    this.getPlayerAndOpponent();
  }

  protected getPlayerAndOpponent(): void {
    combineLatest([
      this.playerService.player$,
      this.battleInstanceQueriesService.initBattle(this.battleId),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([player, battle]) => {
        this.playerId = battle.player._id;
        if (player._id === battle.opponent._id) {
          this.opponent = battle.player;
          this.player.set(battle.opponent);
        } else {
          this.player.set(battle.player);
          this.opponent = battle.opponent;
        }
      });
  }

  protected startBattle(): void {
    this.started = true;
    this.startBattleLoop();
  }

  protected startBattleLoop(): void {
    this.battleLoop = setInterval(() => {
      this.simulateTurn();
    }, ROUND_TIME_MS);
  }

  protected simulateTurn(): void {
    console.log(this.player().damage);
    this.battleQueriesService
      .simulateBattleRound(this.player(), this.opponent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((round) => {
        this.player.set(round.trainer1);
        this.opponent = { ...round.trainer2 };
        if (this.player().defeat) {
          this.onDefeat(this.player());
        }
        if (this.opponent.defeat) {
          this.onDefeat(this.opponent);
        }
      });
  }

  public onDefeat(trainer: BattleTrainerModel): void {
    clearInterval(this.battleLoop);
    this.battleInstanceQueriesService
      .setWinner(this.battleId, trainer._id, this.playerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['battle-resume'], {
          queryParams: { battle: this.battleId },
        });
      });
  }
}
