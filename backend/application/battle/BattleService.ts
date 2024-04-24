import { IBattleTrainer, ITrainerAutorizations } from "./BattleInterfaces";
import BattleCalcService from "./BattleCalcService";
import BattleAiService from "./BattleAiService";
import { IBattleInstance } from "../../domain/battleInstance/Battle";
import { ITrainer } from "../../domain/trainer/Trainer";
import { IPokemon } from "../../domain/pokemon/Pokemon";
import { DefaultMove } from "./BattleConst";

class BattleService {
  private static instance: BattleService;

  public static getInstance(): BattleService {
    if (!BattleService.instance) {
      BattleService.instance = new BattleService(
        BattleCalcService.getInstance(),
        BattleAiService.getInstance(),
      );
    }
    return BattleService.instance;
  }

  constructor(
    protected battleCalcService: BattleCalcService,
    protected battleAiService: BattleAiService,
  ) {}

  public simulateBattle(battle: IBattleInstance): IBattleInstance {
    let trainerA = this.mapBattleTrainer(battle.player);
    let trainerB = this.mapBattleTrainer(battle.opponent);
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

  private mapBattleTrainer(trainer: ITrainer): IBattleTrainer {
    return {
      _id: trainer._id,
      name: trainer.name,
      pokemons: trainer.pokemons
        .filter((value) => value.level > 0)
        .map((pokemon) => {
          pokemon.currentHp = pokemon.stats.hp;
          if (pokemon.moves.length === 0) {
            pokemon.moves.push(DefaultMove);
          }
          return pokemon;
        }),
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

  simulateBattleRound(
    trainer1: IBattleTrainer,
    trainer2: IBattleTrainer,
  ): { trainer1: IBattleTrainer; trainer2: IBattleTrainer } {
    [trainer1, trainer2] = this.initializeTrainers(trainer1, trainer2);
    this.decreseCooldown(trainer1);
    this.decreseCooldown(trainer2);
    this.updateDecision(trainer1, trainer2);
    trainer1 = this.applyDecision(trainer1, trainer2);
    trainer2 = this.applyDecision(trainer2, trainer1);
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
        trainer2.selectedMove,
        trainer1.pokemons,
      );
    }
    if (trainer2.autorizations.updateCooldown === 0) {
      trainer2.decision =
        this.battleAiService.decisionMaking(
          trainer1.pokemons[0],
          trainer1.selectedMove,
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
        : this.battleCalcService.getCooldownTurn(trainer.pokemons[0]);
      trainer.autorizations.moveCooldown = trainer.onKo
        ? 0
        : this.battleCalcService.getCooldownTurn(trainer.pokemons[0]);
    }
    return trainer;
  }

  onChangePokemon(trainer: IBattleTrainer): IPokemon[] {
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
