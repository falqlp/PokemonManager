import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { TrainerQueriesService } from 'src/app/services/trainer-queries.service';
import { AttackModel } from '../../models/attack.model';
import { BattleService } from './battle.service';
import { DamageModel } from '../../models/damage.model';
import { BattleOpponentAiService } from './battle-opponent-ai.service';
import { ROUND_TIME_MS } from './battel.const';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  protected opponent: TrainerModel;
  protected opponentSelectedAttack: AttackModel;
  protected opponentDamage: DamageModel;
  protected player: TrainerModel;
  protected playerSelectedAttack: AttackModel;
  protected playerDamage: DamageModel;
  protected playerAttackCooldown = 0;
  protected playerCanAttack = true;

  constructor(
    protected trainerService: TrainerQueriesService,
    protected playerService: PlayerService,
    protected service: BattleService,
    protected aiService: BattleOpponentAiService
  ) {}

  public ngOnInit(): void {
    this.getPlayer();
    this.getOpponent();
    this.battleLoop();
    this.susbcribeAiDecision();
  }

  protected changePlayerActivePokemon(pokemon: PokemonModel): void {
    this.player.pokemons = this.changePokemon(this.player.pokemons, pokemon);
    this.updateAiOpponent();
  }

  protected changeOpponentActivePokemon(pokemon: PokemonModel): void {
    this.opponent.pokemons = this.changePokemon(
      this.opponent.pokemons,
      pokemon
    );
  }

  protected changePokemon(
    pokemons: PokemonModel[],
    pokemon: PokemonModel
  ): PokemonModel[] {
    pokemons[
      pokemons.findIndex((playerPokemon) => playerPokemon?._id === pokemon?._id)
    ] = pokemons[0];
    pokemons[0] = pokemon;
    return pokemons;
  }

  protected getPlayer(): void {
    this.playerService.player$.subscribe((trainer) => {
      trainer.pokemons.map((pokemon) => {
        if (!pokemon.currentHp) {
          pokemon.currentHp = pokemon.stats.hp;
        }
        return pokemon;
      });
      this.player = trainer;
    });
  }

  protected getOpponent(): void {
    this.trainerService
      .getTrainer('6496f985f15bc10f660c1958')
      .subscribe((trainer) => {
        trainer.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats.hp;
          }
          return pokemon;
        });
        this.opponent = trainer;
      });
  }

  protected onAttackChange(newAttack: AttackModel): void {
    this.setPlayerAttackCooldown();
    this.playerSelectedAttack = newAttack;
    this.updateAiOpponent();
  }

  protected battleLoop(): void {
    setInterval(() => {
      this.opponentDamage = undefined;
      this.playerDamage = undefined;

      if (
        this.opponentSelectedAttack &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        this.playerDamage = this.service.calcDamage(
          this.opponent.pokemons[0],
          this.player.pokemons[0],
          this.opponentSelectedAttack
        );
        this.player.pokemons[0] = this.service.damageOnPokemon(
          this.player.pokemons[0],
          this.playerDamage
        );
      }

      if (
        this.playerSelectedAttack &&
        this.player.pokemons[0].currentHp !== 0 &&
        this.opponent.pokemons[0].currentHp !== 0
      ) {
        this.opponentDamage = this.service.calcDamage(
          this.player.pokemons[0],
          this.opponent.pokemons[0],
          this.playerSelectedAttack
        );
        this.opponent.pokemons[0] = this.service.damageOnPokemon(
          this.opponent.pokemons[0],
          this.opponentDamage
        );
      }
      if (this.opponent.pokemons[0].currentHp === 0) {
        this.opponentPokemonKO();
      }
      if (this.player.pokemons[0].currentHp === 0) {
        this.playerPokemonKO();
      }
    }, ROUND_TIME_MS);
  }

  protected updateAiOpponent(): void {
    if (this.playerSelectedAttack) {
      this.aiService.update(
        this.player.pokemons[0],
        this.playerSelectedAttack,
        this.opponent.pokemons
      );
    }
  }

  protected susbcribeAiDecision(): void {
    this.aiService.decision$.subscribe((decision) => {
      if (decision.attack && decision.pokemon) {
        if (decision.pokemon !== this.opponent.pokemons[0]) {
          setTimeout(() => {
            this.changeOpponentActivePokemon(decision.pokemon);
          }, 4 * ROUND_TIME_MS);
        }
        if (decision.attack !== this.opponentSelectedAttack) {
          setTimeout(() => {
            this.opponentSelectedAttack = decision.attack;
          }, 4 * ROUND_TIME_MS);
        }
      }
    });
  }

  protected opponentPokemonKO(): void {
    this.aiService.update(
      this.player.pokemons[0],
      this.playerSelectedAttack,
      this.opponent.pokemons
    );
  }

  protected playerPokemonKO(): void {}

  protected setPlayerAttackCooldown(): void {
    this.playerCanAttack = false;
    this.playerAttackCooldown = 100;
    const interval = setInterval(() => {
      this.playerAttackCooldown -= 1;
      if (this.playerAttackCooldown <= 0) {
        clearInterval(interval);
        this.playerCanAttack = true;
        this.playerAttackCooldown = 0;
      }
    }, this.service.getCooldownMs(this.player.pokemons[0]));
  }
}
