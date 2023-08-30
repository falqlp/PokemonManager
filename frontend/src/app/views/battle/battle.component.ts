import { DestroyRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { TrainerQueriesService } from 'src/app/services/queries/trainer-queries.service';
import { BattleService } from './battle.service';
import { ROUND_TIME_MS } from './battel.const';
import { combineLatest, forkJoin, Observable, of, switchMap } from 'rxjs';
import { BattleTrainer } from './battle-trainer';
import { ActivatedRoute, Router } from '@angular/router';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { BattleModel } from '../../models/Battle.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BattleQueriesService } from './battle-queries.service';
import { DamageModel } from '../../models/damage.model';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  public started = false;
  protected battleLoop: number;
  protected battle: BattleModel;

  protected opponent: BattleTrainer;
  protected player: BattleTrainer;

  public constructor(
    protected trainerService: TrainerQueriesService,
    protected service: BattleService,
    protected battleInstanceQueriesService: BattleInstanceQueriesService,
    protected battleQueriesService: BattleQueriesService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.getPlayerAndOpponent();
  }

  protected getPlayerAndOpponent(): void {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          return this.battleInstanceQueriesService.get(params['battle']);
        }),
        switchMap((battle) => {
          this.battle = battle;
          const playerObservable = this.trainerService.get(battle.player._id);
          const opponentObservable = this.trainerService.get(
            battle.opponent._id
          );
          return combineLatest([playerObservable, opponentObservable]);
        })
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([player, opponent]) => {
        player.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats['hp'];
          }
          return pokemon;
        });
        this.player = new BattleTrainer(
          player,
          true,
          this.service,
          this,
          this.battleQueriesService
        );

        opponent.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats['hp'];
          }
          return pokemon;
        });
        this.opponent = new BattleTrainer(
          opponent,
          true,
          this.service,
          this,
          this.battleQueriesService
        );
      });
  }

  protected startBattle(): void {
    this.started = true;
    this.startBattleLoop();
  }

  protected startBattleLoop(): void {
    this.battleLoop = setInterval(() => {
      let opponentDamage$: Observable<{
        damage: DamageModel;
        pokemon: PokemonModel;
      }>;
      if (
        this.opponent.selectedMove &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        opponentDamage$ = this.battleQueriesService.calcDamage(
          this.opponent.pokemons[0],
          this.player.pokemons[0],
          this.opponent.selectedMove
        );
      } else {
        opponentDamage$ = of(null);
      }

      let playerDamage$: Observable<{
        damage: DamageModel;
        pokemon: PokemonModel;
      }>;
      if (
        this.player.selectedMove &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        playerDamage$ = this.battleQueriesService.calcDamage(
          this.player.pokemons[0],
          this.opponent.pokemons[0],
          this.player.selectedMove
        );
      } else {
        playerDamage$ = of(null);
      }
      forkJoin({
        opponentDamage: opponentDamage$,
        playerDamage: playerDamage$,
      }).subscribe((res) => {
        this.opponent.damage = undefined;
        this.player.damage = undefined;
        if (res.opponentDamage) {
          this.player.damage = res.opponentDamage.damage;
          this.player.pokemons[0] = res.opponentDamage.pokemon;
        }
        if (res.playerDamage) {
          this.opponent.damage = res.playerDamage.damage;
          this.opponent.pokemons[0] = res.playerDamage.pokemon;
        }
        if (this.opponent.pokemons[0].currentHp === 0) {
          this.opponent.pokemonKO();
        }
        if (this.player.pokemons[0].currentHp === 0) {
          this.player.pokemonKO();
        }
      });
    }, ROUND_TIME_MS);
  }

  public updateAiOpponent(battleTrainer: BattleTrainer, ownAI = false): void {
    if (
      (battleTrainer === this.player && !ownAI) ||
      (battleTrainer !== this.player && ownAI)
    ) {
      this.opponent
        .update(
          this.player.pokemons[0],
          this.player.selectedMove,
          this.opponent.pokemons
        )
        .subscribe();
    }
    if (
      (battleTrainer === this.opponent && !ownAI) ||
      (battleTrainer !== this.opponent && ownAI)
    ) {
      this.player
        .update(
          this.opponent.pokemons[0],
          this.opponent.selectedMove,
          this.player.pokemons
        )
        .subscribe();
    }
  }

  public onDefeat(trainer: BattleTrainer): void {
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
}
