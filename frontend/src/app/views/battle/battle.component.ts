import { DestroyRef, Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { TrainerQueriesService } from 'src/app/services/queries/trainer-queries.service';
import { BattleService } from './battle.service';
import { ROUND_TIME_MS } from './battle.const';
import { combineLatest, switchMap } from 'rxjs';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { BattleModel } from '../../models/Battle.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BattleQueriesService } from './battle-queries.service';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { BattleTrainerModel } from './battle.model';
import { MoveModel } from '../../models/move.model';
import { PlayerService } from '../../services/player.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'pm-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  @Input('id') public battleId: string;
  protected started = false;
  protected battleLoop: number;
  protected battle: BattleModel;
  protected opponent: BattleTrainerModel;
  protected player: BattleTrainerModel;

  public constructor(
    protected trainerService: TrainerQueriesService,
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
    this.battleInstanceQueriesService
      .get(this.battleId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((battle) => {
          this.battle = battle;
          const playerObservable = this.trainerService.get(battle.player._id);
          const opponentObservable = this.trainerService.get(
            battle.opponent._id
          );
          return combineLatest([
            playerObservable,
            opponentObservable,
            this.playerService.player$,
          ]);
        })
      )
      .subscribe(([player, opponent, playerData]) => {
        player.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats['hp'];
          }
          return pokemon;
        });
        opponent.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats['hp'];
          }
          return pokemon;
        });

        if (playerData._id === opponent._id) {
          this.opponent = this.service.mapBattleTrainer(player);
          this.player = this.service.mapBattleTrainer(opponent);
        } else {
          this.player = this.service.mapBattleTrainer(player);
          this.opponent = this.service.mapBattleTrainer(opponent);
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
    this.battleQueriesService
      .simulateTurn(this.player, this.opponent)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((round) => {
        this.player = round.trainer1;
        this.opponent = round.trainer2;
        if (this.player.defeat) {
          this.onDefeat(this.player);
        }
        if (this.opponent.defeat) {
          this.onDefeat(this.opponent);
        }
      });
  }

  public onDefeat(trainer: BattleTrainerModel): void {
    clearInterval(this.battleLoop);
    this.battleInstanceQueriesService
      .setWinner(this.battle, trainer._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['battle-resume'], {
          queryParams: { battle: this.battle._id },
        });
      });
  }

  protected onMoveChange(move: MoveModel): void {
    this.player.selectedMove = move;
  }

  protected onPokemonChange(pokemon: PokemonModel): void {
    this.changePokemon(pokemon);
  }

  protected changePokemon(pokemon: PokemonModel): void {
    this.player.pokemons[
      this.player.pokemons.findIndex(
        (playerPokemon) => playerPokemon?._id === pokemon?._id
      )
    ] = this.player.pokemons[0];
    this.player.pokemons[0] = pokemon;
  }
}
