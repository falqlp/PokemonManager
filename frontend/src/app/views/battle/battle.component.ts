import { DestroyRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { TrainerQueriesService } from 'src/app/services/queries/trainer-queries.service';
import { BattleService } from './battle.service';
import { ROUND_TIME_MS } from './battel.const';
import { combineLatest, switchMap } from 'rxjs';
import { BattleTrainer } from './battle-trainer';
import { ActivatedRoute, Router } from '@angular/router';
import { BattleQueriesService } from '../../services/queries/battle-queries.service';
import { BattleModel } from '../../models/Battle.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    protected battleQueries: BattleQueriesService,
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
          return this.battleQueries.get(params['battle']);
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
        this.player = new BattleTrainer(player, true, this.service, this);

        opponent.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats['hp'];
          }
          return pokemon;
        });
        this.opponent = new BattleTrainer(opponent, true, this.service, this);
      });
  }

  protected startBattle(): void {
    this.started = true;
    this.startBattleLoop();
  }

  protected startBattleLoop(): void {
    this.battleLoop = setInterval(() => {
      this.opponent.damage = undefined;
      this.player.damage = undefined;

      if (
        this.opponent.selectedMove &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        this.player.damage = this.service.calcDamage(
          this.opponent.pokemons[0],
          this.player.pokemons[0],
          this.opponent.selectedMove
        );
        this.player.pokemons[0] = this.service.damageOnPokemon(
          this.player.pokemons[0],
          this.player.damage
        );
      }

      if (
        this.player.selectedMove &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        this.opponent.damage = this.service.calcDamage(
          this.player.pokemons[0],
          this.opponent.pokemons[0],
          this.player.selectedMove
        );
        this.opponent.pokemons[0] = this.service.damageOnPokemon(
          this.opponent.pokemons[0],
          this.opponent.damage
        );
      }
      if (this.opponent.pokemons[0].currentHp === 0) {
        this.opponent.pokemonKO();
      }
      if (this.player.pokemons[0].currentHp === 0) {
        this.player.pokemonKO();
      }
    }, ROUND_TIME_MS);
  }

  public updateAiOpponent(battleTrainer: BattleTrainer, ownAI = false): void {
    if (
      ((battleTrainer === this.player && !ownAI) ||
        (battleTrainer !== this.player && ownAI)) &&
      this.player.selectedMove
    ) {
      this.opponent.aiService.update(
        this.player.pokemons[0],
        this.player.selectedMove,
        this.opponent.pokemons
      );
    }
    if (
      ((battleTrainer === this.opponent && !ownAI) ||
        (battleTrainer !== this.opponent && ownAI)) &&
      this.player.selectedMove
    ) {
      this.player.aiService.update(
        this.opponent.pokemons[0],
        this.opponent.selectedMove,
        this.player.pokemons
      );
    }
  }

  public onDefeat(trainer: BattleTrainer): void {
    clearInterval(this.battleLoop);
    this.battleQueries
      .setWinner(this.battle, trainer._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['battle-resume'], {
          queryParams: { battle: this.battle._id },
        });
      });
  }
}
