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
  }

  protected changePlayerActivePokemon(pokemon: PokemonModel): void {
    this.player.pokemons = this.changePokemon(this.player.pokemons, pokemon);
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
        this.aiService.init(trainer);
      });
  }

  protected onAttackChange(newAttack: AttackModel): void {
    this.playerSelectedAttack = newAttack;
  }

  protected battleLoop(): void {
    setInterval(() => {
      this.opponentDamage = undefined;
      this.playerDamage = undefined;
      this.opponentSelectedAttack = this.aiService.decision.attack;

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
      this.aiService.update();
    }, 500);
  }
}
