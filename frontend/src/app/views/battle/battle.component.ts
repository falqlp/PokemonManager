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
import { combineLatest } from 'rxjs';
import { DecisionModel, TrainerAutorizationsModel } from './battle.model';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  protected started = false;

  protected opponent: TrainerModel;
  protected opponentSelectedAttack: AttackModel;
  protected opponentDamage: DamageModel;
  protected opponentAutorizations: TrainerAutorizationsModel = {
    canChangeAttack: true,
    attackCooldown: 0,
    canChangePokemon: true,
    pokemonCooldown: 0,
  };

  protected opponentAIdecision: DecisionModel;

  protected player: TrainerModel;
  protected playerSelectedAttack: AttackModel;
  protected playerDamage: DamageModel;
  protected playerAutorizations: TrainerAutorizationsModel = {
    canChangeAttack: true,
    attackCooldown: 0,
    canChangePokemon: true,
    pokemonCooldown: 0,
  };

  public constructor(
    protected trainerService: TrainerQueriesService,
    protected playerService: PlayerService,
    protected service: BattleService,
    protected aiService: BattleOpponentAiService
  ) {}

  public ngOnInit(): void {
    this.getPlayerAndOpponent();
  }

  protected getPlayerAndOpponent(): void {
    const playerObservable = this.playerService.player$;
    const opponentObservable = this.trainerService.getTrainer(
      '6496f985f15bc10f660c1958'
    );
    combineLatest([playerObservable, opponentObservable]).subscribe(
      ([player, opponent]) => {
        player.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats.hp;
          }
          return pokemon;
        });
        this.player = player;
        opponent.pokemons.map((pokemon) => {
          if (!pokemon.currentHp) {
            pokemon.currentHp = pokemon.stats.hp;
          }
          return pokemon;
        });
        this.opponent = opponent;
      }
    );
  }

  protected startBattle(): void {
    this.started = true;
    this.battleLoop();
    this.susbcribeAiDecision();
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
        this.opponentAIdecision = decision;
        if (decision.pokemon !== this.opponent.pokemons[0]) {
          this.changeOpponentActivePokemon(decision.pokemon);
        }
        if (decision.attack !== this.opponentSelectedAttack) {
          this.onOpponentAttackChange(decision.attack);
        }
      }
    });
  }

  protected opponentPokemonKO(): void {
    this.updateAiOpponent();
  }

  protected playerPokemonKO(): void {}

  protected onPlayerAttackChange(newAttack: AttackModel): void {
    if (this.playerAutorizations.canChangeAttack) {
      if (this.started) {
        this.setPlayerAttackCooldown(
          this.playerAutorizations,
          this.player.pokemons[0]
        );
      }
      this.playerSelectedAttack = newAttack;
      this.updateAiOpponent();
    }
  }

  protected onOpponentAttackChange(newAttack: AttackModel): void {
    if (this.opponentAutorizations.canChangeAttack) {
      if (this.started) {
        this.setOpponentAttackCooldown(
          this.opponentAutorizations,
          this.opponent.pokemons[0]
        );
      }
      this.opponentSelectedAttack = newAttack;
    }
  }

  protected setOpponentAttackCooldown(
    autorization: TrainerAutorizationsModel,
    pokemon: PokemonModel
  ): void {
    autorization.canChangeAttack = false;
    autorization.attackCooldown = 100;
    const interval = setInterval(() => {
      autorization.attackCooldown -= 1;
      if (
        autorization.attackCooldown <= 0 ||
        this.opponent.pokemons[0].currentHp === 0
      ) {
        clearInterval(interval);
        autorization.canChangeAttack = true;
        autorization.attackCooldown = 0;
        if (this.opponentSelectedAttack !== this.opponentAIdecision.attack) {
          this.onOpponentAttackChange(this.opponentAIdecision.attack);
        }
      }
    }, this.service.getCooldownMs(pokemon));
  }

  protected setPlayerAttackCooldown(
    autorization: TrainerAutorizationsModel,
    pokemon: PokemonModel
  ): void {
    autorization.canChangeAttack = false;
    autorization.attackCooldown = 100;
    const interval = setInterval(() => {
      autorization.attackCooldown -= 1;
      if (
        autorization.attackCooldown <= 0 ||
        this.player.pokemons[0].currentHp === 0
      ) {
        clearInterval(interval);
        autorization.canChangeAttack = true;
        autorization.attackCooldown = 0;
      }
    }, this.service.getCooldownMs(pokemon));
  }

  protected changePlayerActivePokemon(pokemon: PokemonModel): void {
    if (this.playerAutorizations.canChangePokemon && this.started) {
      if (this.player.pokemons[0].currentHp !== 0) {
        this.setPlayerPokemonCooldown(this.playerAutorizations, pokemon);
        this.setPlayerAttackCooldown(this.playerAutorizations, pokemon);
      }
      this.player.pokemons = this.changePokemon(this.player.pokemons, pokemon);
      this.playerSelectedAttack = undefined;
      this.updateAiOpponent();
    }
  }

  protected changeOpponentActivePokemon(pokemon: PokemonModel): void {
    if (this.opponentAutorizations.canChangePokemon && this.started) {
      if (this.opponent.pokemons[0].currentHp !== 0) {
        this.setOpponentPokemonCooldown(this.opponentAutorizations, pokemon);
        this.setOpponentAttackCooldown(this.opponentAutorizations, pokemon);
        this.opponent.pokemons = this.changePokemon(
          this.opponent.pokemons,
          pokemon
        );
      }
    }
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

  protected setOpponentPokemonCooldown(
    autorization: TrainerAutorizationsModel,
    pokemon: PokemonModel
  ): void {
    autorization.canChangePokemon = false;
    autorization.pokemonCooldown = 100;
    const interval = setInterval(() => {
      autorization.pokemonCooldown -= 1;
      if (
        autorization.pokemonCooldown <= 0 ||
        this.opponent.pokemons[0].currentHp === 0
      ) {
        clearInterval(interval);
        autorization.canChangePokemon = true;
        autorization.pokemonCooldown = 0;
        if (this.opponent.pokemons[0] !== this.opponentAIdecision.pokemon) {
          this.changeOpponentActivePokemon(this.opponentAIdecision.pokemon);
        }
      }
    }, this.service.getCooldownMs(pokemon));
  }

  protected setPlayerPokemonCooldown(
    autorization: TrainerAutorizationsModel,
    pokemon: PokemonModel
  ): void {
    autorization.canChangePokemon = false;
    autorization.pokemonCooldown = 100;
    const interval = setInterval(() => {
      autorization.pokemonCooldown -= 1;
      if (
        autorization.pokemonCooldown <= 0 ||
        this.player.pokemons[0].currentHp === 0
      ) {
        clearInterval(interval);
        autorization.canChangePokemon = true;
        autorization.pokemonCooldown = 0;
      }
    }, this.service.getCooldownMs(pokemon));
  }
}
