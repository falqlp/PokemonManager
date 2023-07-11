import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { tap, switchMap, map } from 'rxjs';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { TrainerModel } from 'src/app/models/TrainersModels/trainer.model';
import { PlayerService } from 'src/app/services/player.service';
import { TrainerQueriesService } from 'src/app/services/trainer-queries.service';
import { AttackModel } from '../../models/attack.model';
import { BattleService } from './battle.service';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.scss'],
})
export class BattleComponent implements OnInit {
  protected opponent: TrainerModel;
  protected player: TrainerModel;
  protected opponentPokemons: PokemonModel[];
  protected playerPokemons: PokemonModel[];
  protected selectedAttack: AttackModel;

  constructor(
    protected trainerService: TrainerQueriesService,
    protected playerService: PlayerService,
    protected service: BattleService
  ) {}

  public ngOnInit(): void {
    this.getPlayer();
    this.getOpponent();
    setInterval(() => {
      if (this.selectedAttack) {
        const damage = this.service.calcDamage(
          this.playerPokemons[0],
          this.opponentPokemons[0],
          this.selectedAttack
        );
        let opponentCurrentHp =
          this.opponentPokemons[0].currentHp - damage.damage / 5;
        opponentCurrentHp = Math.round(opponentCurrentHp * 10) / 10;
        this.opponentPokemons[0].currentHp = Math.max(0, opponentCurrentHp);
      }
    }, 500);
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
      });
  }

  protected onAttackChange(newAttack: AttackModel): void {
    this.selectedAttack = newAttack;
  }
}
