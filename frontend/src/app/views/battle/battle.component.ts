import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { TrainerQueriesService } from 'src/app/services/trainer-queries.service';
import { BattleService } from './battle.service';
import { ROUND_TIME_MS } from './battel.const';
import { combineLatest, switchMap } from 'rxjs';
import { BattleTrainer } from './battle-trainer';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  public started = false;

  protected opponent: BattleTrainer;

  protected player: BattleTrainer;

  public constructor(
    protected trainerService: TrainerQueriesService,
    protected playerService: PlayerService,
    protected service: BattleService,
    protected route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.getPlayerAndOpponent();
  }

  protected getPlayerAndOpponent(): void {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          const playerObservable = this.trainerService.getTrainer(
            params['player']
          );
          const opponentObservable = this.trainerService.getTrainer(
            params['opponent']
          );
          return combineLatest([playerObservable, opponentObservable]);
        })
      )
      .subscribe(([player, opponent]) => {
        player.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats.hp;
          }
          return pokemon;
        });
        this.player = new BattleTrainer(player, true, this.service, this);
        opponent.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats.hp;
          }
          return pokemon;
        });
        this.opponent = new BattleTrainer(opponent, true, this.service, this);
      });
  }

  protected startBattle(): void {
    this.started = true;
    this.battleLoop();
  }

  protected battleLoop(): void {
    setInterval(() => {
      this.opponent.damage = undefined;
      this.player.damage = undefined;

      if (
        this.opponent.selectedAttack &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        this.player.damage = this.service.calcDamage(
          this.opponent.pokemons[0],
          this.player.pokemons[0],
          this.opponent.selectedAttack
        );
        this.player.pokemons[0] = this.service.damageOnPokemon(
          this.player.pokemons[0],
          this.player.damage
        );
      }

      if (
        this.player.selectedAttack &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        this.opponent.damage = this.service.calcDamage(
          this.player.pokemons[0],
          this.opponent.pokemons[0],
          this.player.selectedAttack
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
      this.player.selectedAttack
    ) {
      this.opponent.aiService.update(
        this.player.pokemons[0],
        this.player.selectedAttack,
        this.opponent.pokemons
      );
    }
    if (
      ((battleTrainer === this.opponent && !ownAI) ||
        (battleTrainer !== this.opponent && ownAI)) &&
      this.player.selectedAttack
    ) {
      this.player.aiService.update(
        this.opponent.pokemons[0],
        this.opponent.selectedAttack,
        this.player.pokemons
      );
    }
  }
}
