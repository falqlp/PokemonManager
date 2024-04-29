import { IBattlePokemon, IBattleTrainer, IDamage } from "./BattleInterfaces";
import BattleCalcService from "./BattleCalcService";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import { ITrainer } from "../../domain/trainer/Trainer";
import { DefaultMove } from "./BattleConst";
import { singleton } from "tsyringe";
import { getRandomFromArray, getRandomValue } from "../../utils/RandomUtils";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import { IMove } from "../../domain/move/Move";

@singleton()
class BattleService {
  constructor(protected battleCalcService: BattleCalcService) {}

  public simulateBattle(battle: IBattleInstance): IBattleInstance {
    const res = this.initBattle(battle);
    let trainerA = res.player;
    let trainerB = res.opponent;
    let moveOrder = res.battleOrder;
    for (let i = 0; i < 100000; i++) {
      const { player, opponent, battleOrder } = this.simulateNewBattleRound(
        { ...trainerA },
        { ...trainerB },
        [...moveOrder],
      );
      trainerA = player;
      trainerB = opponent;
      moveOrder = battleOrder;
      if (trainerA.defeat || trainerB.defeat) {
        break;
      }
    }
    battle.winner = trainerA.defeat ? "opponent" : "player";
    return battle;
  }

  public initBattle(battle: IBattleInstance): {
    player: IBattleTrainer;
    opponent: IBattleTrainer;
    battleOrder: IBattlePokemon[];
  } {
    const player = this.mapBattleTrainer(battle.player, battle._id.toString());
    const opponent = this.mapBattleTrainer(
      battle.opponent,
      battle._id.toString(),
    );
    const battleOrder = this.initBattleOrder(player, opponent);
    return { player, opponent, battleOrder };
  }

  private initBattleOrder(
    player: IBattleTrainer,
    opponent: IBattleTrainer,
    moveOrder?: IBattlePokemon[],
  ): IBattlePokemon[] {
    const pokemons = [
      ...player.pokemons.filter((pokemon) => pokemon.currentHp > 0),
      ...opponent.pokemons.filter((pokemon) => pokemon.currentHp > 0),
    ];
    moveOrder = moveOrder ?? [];
    while (moveOrder.length < 5) {
      const maxPokemon = pokemons.reduce((prev, current) => {
        return prev.cumulatedSpeed > current.cumulatedSpeed ? prev : current;
      });
      moveOrder.push(maxPokemon);
      pokemons.map((pokemon) => {
        if (pokemon._id === maxPokemon._id) {
          pokemon.cumulatedSpeed = 0;
        } else {
          pokemon.cumulatedSpeed += pokemon.stats.spe;
        }
        return pokemon;
      });
    }
    return moveOrder;
  }

  private mapBattleTrainer(
    trainer: ITrainer,
    battleId: string,
  ): IBattleTrainer {
    trainer = { ...(trainer as any)._doc };
    const battlePokemons = trainer.pokemons
      .filter((value) => value.level > 0)
      .map((pokemon) => {
        const battlePokemon: IBattlePokemon = {
          ...(pokemon as any)._doc,
        } as IBattlePokemon;
        battlePokemon.dailyForm = this.getDailyForm(
          battlePokemon._id,
          battleId,
        );
        battlePokemon.stats = this.setDailyForm(
          battlePokemon.dailyForm,
          battlePokemon.stats,
        );
        battlePokemon.cumulatedSpeed = battlePokemon.stats.spe;
        battlePokemon.currentHp = battlePokemon.stats.hp;
        if (battlePokemon.moves.length === 0) {
          battlePokemon.moves.push(DefaultMove);
        }
        return battlePokemon;
      });
    return {
      _id: trainer._id,
      name: trainer.name,
      class: trainer.class,
      pokemons: battlePokemons,
      defeat: false,
    } as IBattleTrainer;
  }

  private getDailyForm(battleId: string, pokemonId: string): number {
    const randomValue = getRandomValue(battleId + pokemonId);

    if (randomValue < 0.5) {
      return 0;
    } else if (randomValue < 0.7) {
      return 1;
    } else if (randomValue < 0.9) {
      return -1;
    } else if (randomValue < 0.95) {
      return 2;
    } else {
      return -2;
    }
  }

  private setDailyForm(dailyForm: number, stats: IPokemonStats): IPokemonStats {
    const newStats: { [key: string]: number } = stats as unknown as {
      [key: string]: number;
    };
    Object.keys(stats).forEach((key) => {
      newStats[key] += Math.round((newStats[key] * dailyForm) / 10);
    });
    return stats;
  }

  public simulateNewBattleRound(
    player: IBattleTrainer,
    opponent: IBattleTrainer,
    battleOrder: IBattlePokemon[],
  ): {
    player: IBattleTrainer;
    opponent: IBattleTrainer;
    battleOrder: IBattlePokemon[];
    damage: IDamage;
  } {
    this.resetPokemonStates(player.pokemons);
    this.resetPokemonStates(opponent.pokemons);

    const attPokemon = this.findAttackingPokemon(
      [player, opponent],
      battleOrder,
    );
    attPokemon.moving = true;
    const selectedMove = getRandomFromArray(attPokemon.moves);

    const { damage, maxDamagedPokemon } = this.conductBattleRound(
      attPokemon,
      player._id.toString() === attPokemon.trainerId.toString()
        ? opponent.pokemons
        : player.pokemons,
      selectedMove,
    );

    battleOrder = this.updatePostBattleStates(
      player,
      opponent,
      battleOrder,
      maxDamagedPokemon,
    );

    return { player, opponent, battleOrder, damage };
  }

  private getMaxDamagedPokemon(
    pokemons: IBattlePokemon[],
    move: IMove,
    selectedPokemon: IBattlePokemon,
  ): IBattlePokemon {
    return pokemons
      .filter((pokemon) => pokemon.currentHp > 0)
      .reduce((prev, current) => {
        return this.battleCalcService.estimator(selectedPokemon, prev, move) >
          this.battleCalcService.estimator(selectedPokemon, current, move)
          ? prev
          : current;
      });
  }

  private resetPokemonStates(pokemons: IBattlePokemon[]): void {
    pokemons.forEach((pokemon) => {
      pokemon.animation = undefined;
      pokemon.moving = false;
    });
  }

  private findAttackingPokemon(
    trainers: IBattleTrainer[],
    battleOrder: IBattlePokemon[],
  ): IBattlePokemon {
    const { trainerId, _id } = battleOrder[0];
    return trainers
      .find((trainer) => trainer._id.toString() === trainerId.toString())
      ?.pokemons.find((pokemon) => pokemon._id.toString() === _id.toString());
  }

  private conductBattleRound(
    attPokemon: IBattlePokemon,
    opponents: IBattlePokemon[],
    selectedMove: IMove,
  ): { damage: IDamage; maxDamagedPokemon: IBattlePokemon } {
    const maxDamagedPokemon = this.getMaxDamagedPokemon(
      opponents,
      selectedMove,
      attPokemon,
    );
    const damage = this.battleCalcService.calcDamage(
      attPokemon,
      maxDamagedPokemon,
      selectedMove,
    );

    if (!damage.missed && damage.effectiveness !== "IMMUNE") {
      attPokemon.animation = selectedMove.animation.player;
      maxDamagedPokemon.animation = selectedMove.animation.opponent;
      maxDamagedPokemon.currentHp = this.battleCalcService.damageOnPokemon(
        maxDamagedPokemon,
        damage,
      );
    }

    return { damage, maxDamagedPokemon };
  }

  private updatePostBattleStates(
    player: IBattleTrainer,
    opponent: IBattleTrainer,
    battleOrder: IBattlePokemon[],
    maxDamagedPokemon: IBattlePokemon,
  ): IBattlePokemon[] {
    battleOrder.shift();
    battleOrder = this.initBattleOrder(
      player,
      opponent,
      battleOrder.filter(
        (pokemon) =>
          maxDamagedPokemon.currentHp > 0 ||
          pokemon._id.toString() !== maxDamagedPokemon._id.toString(),
      ),
    );

    player.defeat = player.pokemons.every((pokemon) => pokemon.currentHp === 0);
    opponent.defeat = opponent.pokemons.every(
      (pokemon) => pokemon.currentHp === 0,
    );
    return battleOrder;
  }
}
export default BattleService;
