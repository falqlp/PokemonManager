import {
  IBattlePokemon,
  IBattleTrainer,
  ITrainerAutorizations,
} from "./BattleInterfaces";
import BattleCalcService from "./BattleCalcService";
import BattleAiService from "./BattleAiService";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import { ITrainer } from "../../domain/trainer/Trainer";
import { DefaultMove } from "./BattleConst";
import { singleton } from "tsyringe";
import { getRandomValue } from "../../utils/RandomUtils";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";

@singleton()
class BattleService {
  constructor(
    protected battleCalcService: BattleCalcService,
    protected battleAiService: BattleAiService,
  ) {}

  public simulateBattle(battle: IBattleInstance): IBattleInstance {
    let trainerA = this.mapBattleTrainer(battle.player, battle._id.toString());
    let trainerB = this.mapBattleTrainer(
      battle.opponent,
      battle._id.toString(),
    );
    for (let i = 0; i < 100000; i++) {
      const { trainer1, trainer2 } = this.simulateBattleRound(
        { ...trainerA },
        { ...trainerB },
      );
      trainerA = trainer1;
      trainerB = trainer2;
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
  } {
    const player = this.mapBattleTrainer(battle.player, battle._id.toString());
    const opponent = this.mapBattleTrainer(
      battle.opponent,
      battle._id.toString(),
    );
    return { player, opponent };
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
        battlePokemon.currentHp = battlePokemon.stats.hp;
        battlePokemon.moves.map((move) => {
          move.used = false;
          return move;
        });
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
      selectedMove: undefined,
      damage: undefined,
      decision: undefined,
      updateDecision: true,
      autorizations: {
        pokemonCooldown: 0,
        moveCooldown: 0,
        updateCooldown: 0,
      },
      defeat: false,
      onKo: false,
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

  simulateBattleRound(
    trainer1: IBattleTrainer,
    trainer2: IBattleTrainer,
  ): { trainer1: IBattleTrainer; trainer2: IBattleTrainer } {
    this.decreseCooldown(trainer1);
    this.decreseCooldown(trainer2);
    this.updateDecision(trainer1, trainer2);
    trainer1 = this.applyDecision(trainer1, trainer2);
    trainer2 = this.applyDecision(trainer2, trainer1);
    [trainer1, trainer2] = this.initializeTrainers(trainer1, trainer2);
    this.processDamage(trainer1, trainer2);
    trainer1.onKo = trainer2.onKo = false;
    this.checkPokemonKo(trainer1);
    this.checkPokemonKo(trainer2);
    return { trainer1, trainer2 };
  }

  initializeTrainers(
    trainer1: IBattleTrainer,
    trainer2: IBattleTrainer,
  ): [IBattleTrainer, IBattleTrainer] {
    trainer1.damage = trainer2.damage = null;
    return [trainer1, trainer2];
  }

  processDamage(trainer1: IBattleTrainer, trainer2: IBattleTrainer): void {
    trainer1.damage = this.battleCalcService.calcDamage(
      trainer2.pokemons[0],
      trainer1.pokemons[0],
      trainer2.selectedMove,
    );
    trainer2.damage = this.battleCalcService.calcDamage(
      trainer1.pokemons[0],
      trainer2.pokemons[0],
      trainer1.selectedMove,
    );
    trainer1.pokemons[0].currentHp = this.battleCalcService.damageOnPokemon(
      trainer1.pokemons[0],
      trainer1.damage,
    );
    trainer2.pokemons[0].currentHp = this.battleCalcService.damageOnPokemon(
      trainer2.pokemons[0],
      trainer2.damage,
    );
  }

  checkPokemonKo(trainer: IBattleTrainer): void {
    if (trainer.pokemons[0].currentHp === 0) {
      trainer.onKo = true;
      trainer.defeat = !trainer.pokemons.some(
        (pokemon) => pokemon.currentHp !== 0,
      );
      if (!trainer.defeat) {
        trainer.autorizations = this.resetCooldowns();
      }
    }
  }

  resetCooldowns(): ITrainerAutorizations {
    return {
      pokemonCooldown: 0,
      moveCooldown: 0,
      updateCooldown: 0,
    };
  }

  updateDecision(trainer1: IBattleTrainer, trainer2: IBattleTrainer): void {
    if (trainer1.autorizations.updateCooldown === 0) {
      trainer1.decision = this.battleAiService.decisionMaking(
        trainer2.pokemons[0],
        trainer1.pokemons,
      );
    }
    if (trainer2.autorizations.updateCooldown === 0) {
      trainer2.decision =
        this.battleAiService.decisionMaking(
          trainer1.pokemons[0],
          trainer2.pokemons,
        ) ?? trainer2.decision;
    }
  }

  applyDecision(
    trainer: IBattleTrainer,
    opponent: IBattleTrainer,
  ): IBattleTrainer {
    trainer = this.changePokemon(trainer, opponent);
    trainer = this.moveChange(trainer, opponent);
    return trainer;
  }

  moveChange(trainer: IBattleTrainer, opp: IBattleTrainer): IBattleTrainer {
    if (
      !trainer.defeat &&
      trainer.autorizations.moveCooldown === 0 &&
      trainer.selectedMove?.name !== trainer.decision.move.name
    ) {
      trainer.selectedMove = trainer.decision.move;
      trainer.pokemons[0].moves.map((move) => {
        if (move.name === trainer.decision.move.name) {
          move.used = true;
        }
        return move;
      });
      opp.autorizations.updateCooldown = 3;
      trainer.autorizations.moveCooldown =
        this.battleCalcService.getCooldownTurn(trainer.pokemons[0]);
    }
    return trainer;
  }

  changePokemon(trainer: IBattleTrainer, opp: IBattleTrainer): IBattleTrainer {
    if (
      !trainer.defeat &&
      trainer.autorizations.pokemonCooldown === 0 &&
      trainer.decision?.pokemon?._id !== trainer.pokemons[0]._id
    ) {
      trainer.pokemons = this.onChangePokemon(trainer);
      trainer.selectedMove = undefined;
      opp.autorizations.updateCooldown = 3;
      trainer.autorizations.pokemonCooldown = trainer.onKo
        ? 0
        : this.battleCalcService.getCooldownTurn(trainer.pokemons[0]) *
          (opp.damage?.damage ? 1 : 2);
      trainer.autorizations.moveCooldown = trainer.onKo
        ? 0
        : this.battleCalcService.getCooldownTurn(trainer.pokemons[0]);
    }
    return trainer;
  }

  onChangePokemon(trainer: IBattleTrainer): IBattlePokemon[] {
    const pokemons = trainer.pokemons;
    const leadingPokemon = pokemons[0];
    const newLeadingPokemon = pokemons.find(
      (playerPokemon) => playerPokemon?._id === trainer.decision.pokemon?._id,
    );
    const index = pokemons.findIndex(
      (playerPokemon) => playerPokemon?._id === trainer.decision.pokemon?._id,
    );
    pokemons[index] = leadingPokemon;
    pokemons[index].currentHp = leadingPokemon.currentHp;
    pokemons[0] = newLeadingPokemon;
    pokemons[0].currentHp = newLeadingPokemon.currentHp;
    return pokemons;
  }

  decreseCooldown(trainer: IBattleTrainer): void {
    if (trainer.autorizations.moveCooldown > 0) {
      trainer.autorizations.moveCooldown -= 1;
    }
    if (trainer.autorizations.pokemonCooldown > 0) {
      trainer.autorizations.pokemonCooldown -= 1;
    }
    if (trainer.autorizations.updateCooldown > 0) {
      trainer.autorizations.updateCooldown -= 1;
    }
  }
}
export default BattleService;
