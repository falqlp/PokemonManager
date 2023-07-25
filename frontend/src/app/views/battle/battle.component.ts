import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { tap, switchMap, map } from 'rxjs';
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
  protected opponentPokemons: PokemonModel[];
  protected opponentSelectedAttack: AttackModel;
  protected opponentDamage: DamageModel;
  protected player: TrainerModel;
  protected playerPokemons: PokemonModel[];
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
    this.playerPokemons = this.changePokemon(this.playerPokemons, pokemon);
  }

  protected changeOpponentActivePokemon(pokemon: PokemonModel): void {
    this.opponentPokemons = this.changePokemon(this.opponentPokemons, pokemon);
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
    this.playerService.player$
      .pipe(
        tap((player) => (this.player = player)),
        switchMap((player) =>
          this.trainerService.getTrainerPokemon(player._id)
        ),
        map((pokemons) =>
          pokemons.map((pokemon) => {
            if (!pokemon.currentHp) {
              pokemon.currentHp = pokemon.stats.hp;
            }
            return pokemon;
          })
        )
      )
      .subscribe((pokemons) => {
        this.playerPokemons = pokemons;
      });
  }

  protected getOpponent(): void {
    this.trainerService
      .getTrainer('6496f985f15bc10f660c1958')
      .pipe(
        tap((trainer) => (this.opponent = trainer)),
        switchMap(() =>
          this.trainerService.getTrainerPokemon('6496f985f15bc10f660c1958')
        ),
        map((pokemons) =>
          pokemons.map((pokemon) => {
            if (!pokemon.currentHp) {
              pokemon.currentHp = pokemon.stats.hp;
            }
            return pokemon;
          })
        )
      )
      .subscribe((pokemons) => {
        this.opponentPokemons = pokemons;
        this.aiService.init(this.opponentPokemons);
      });
  }

  protected onAttackChange(newAttack: AttackModel): void {
    this.playerSelectedAttack = newAttack;
  }

  protected battleLoop(): void {
    setInterval(() => {
      this.opponentDamage = undefined;
      this.playerDamage = undefined;
      this.opponentSelectedAttack = this.aiService.getAttack();

      if (
        this.opponentSelectedAttack &&
        this.playerPokemons[0].currentHp !== 0 &&
        this.opponentPokemons[0].currentHp !== 0
      ) {
        this.playerDamage = this.service.calcDamage(
          this.opponentPokemons[0],
          this.playerPokemons[0],
          this.opponentSelectedAttack
        );
        this.playerPokemons[0] = this.service.damageOnPokemon(
          this.playerPokemons[0],
          this.playerDamage
        );
      }

      if (
        this.playerSelectedAttack &&
        this.playerPokemons[0].currentHp !== 0 &&
        this.opponentPokemons[0].currentHp !== 0
      ) {
        this.opponentDamage = this.service.calcDamage(
          this.playerPokemons[0],
          this.opponentPokemons[0],
          this.playerSelectedAttack
        );
        this.opponentPokemons[0] = this.service.damageOnPokemon(
          this.opponentPokemons[0],
          this.opponentDamage
        );
      }
    }, 500);
  }
}
