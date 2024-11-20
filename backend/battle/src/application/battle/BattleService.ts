import {
  BattleDamageInfo,
  IBattlePokemon,
  IBattleState,
  IBattleTrainer,
  IDamage,
} from './BattleInterfaces';
import BattleCalcService from './BattleCalcService';
import { DefaultMove } from './BattleConst';
import { Injectable } from '@nestjs/common';
import { getRandomFromArray, getRandomValue } from 'shared/utils/RandomUtils';
import { BattleDataService } from './BattleDataService';
import { BattleEventsService } from '../battle-events/battle-events.service';
import BattleSideEffectService from './BattleSideEffectService';
import { IPokemonStats } from 'shared/models/pokemon/pokemon-models';
import { IMove, SideEffect } from 'shared/models/move/mode-model';
import {
  BattleInstanceBattle,
  BattleTrainer,
  CoreInterfaceService,
} from '../core-interface/core-interface.service';
import BattleWebsocketService from '../websocket/battle-websocket.service';

@Injectable()
export default class BattleService {
  constructor(
    private readonly battleCalcService: BattleCalcService,
    private readonly battleDataService: BattleDataService,
    private readonly battleWebsocketService: BattleWebsocketService,
    private readonly battleEventsService: BattleEventsService,
    private readonly battleSideEffectService: BattleSideEffectService,
    private readonly coreInterfaceService: CoreInterfaceService,
  ) {}

  public simulateBattle(
    battle: BattleInstanceBattle,
    date: Date,
  ): BattleInstanceBattle {
    let battleState = this.initBattle(battle);
    for (let i = 0; i < 100000; i++) {
      battleState = this.simulateBattleRound(battleState);
      if (battleState.player.defeat || battleState.opponent.defeat) {
        break;
      }
    }
    this.battleEventsService.insertBattleEventsData(
      battleState.damageEvents,
      battleState.battleParticipationEvents,
      battle,
      date,
    );
    battle.winner = battleState.player.defeat ? 'opponent' : 'player';
    return battle;
  }

  public initBattle(battle: BattleInstanceBattle): IBattleState {
    const player = this.mapBattleTrainer(battle.player, battle._id.toString());
    const opponent = this.mapBattleTrainer(
      battle.opponent,
      battle._id.toString(),
    );
    const battleOrder = this.initBattleOrder(player, opponent);
    const battleState: IBattleState = {
      player,
      opponent,
      battleOrder,
      _id: battle._id.toString(),
      damageEvents: [],
      battleParticipationEvents: [],
    };
    battleState.battleParticipationEvents.push({
      battleId: battle._id.toString(),
      trainerId: player._id.toString(),
      pokemonIds: player.pokemons.map((pokemon) => pokemon._id.toString()),
    });
    battleState.battleParticipationEvents.push({
      battleId: battle._id.toString(),
      trainerId: opponent._id.toString(),
      pokemonIds: opponent.pokemons.map((pokemon) => pokemon._id.toString()),
    });
    return battleState;
  }

  public async initBattleForTrainer(battleId: string): Promise<IBattleState> {
    const battle = await this.coreInterfaceService.getBattleInstance(battleId);
    if (battle.winner) {
      return;
    }
    return this.battleDataService.setBattleState(
      battle._id,
      this.initBattle(battle),
    );
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

  public mapBattleTrainer(
    trainer: BattleTrainer,
    battleId: string,
  ): IBattleTrainer {
    if ((trainer as any)._doc) {
      trainer = { ...(trainer as any)._doc };
    }
    const battlePokemons = trainer.pokemons
      .filter((value) => value.level > 0)
      .map((pokemon) => {
        const dailyForm = this.getDailyForm(pokemon._id, battleId);
        const stats = this.setDailyForm(dailyForm, pokemon.stats);
        const battlePokemon: IBattlePokemon = {
          dailyForm,
          stats,
          cumulatedSpeed: stats.spe,
          currentHp: stats.hp,
          reload: 0,
          moves: pokemon.moves,
          _id: pokemon._id,
          trainerId: pokemon.trainerId,
          battleStrategy: pokemon.battleStrategy,
          strategy: pokemon.strategy,
          level: pokemon.level,
          basePokemon: pokemon.basePokemon,
        };
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
    };
  }

  public getDailyForm(battleId: string, pokemonId: string): number {
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

  public setDailyForm(dailyForm: number, stats: IPokemonStats): IPokemonStats {
    const newStats: { [key: string]: number } = stats as unknown as {
      [key: string]: number;
    };
    Object.keys(stats).forEach((key) => {
      newStats[key] += Math.round((newStats[key] * dailyForm) / 10);
    });
    return stats;
  }

  public simulateBattleRound(battleState: IBattleState): IBattleState {
    const player = battleState.player;
    const opponent = battleState.opponent;
    this.resetPokemonStates(player.pokemons);
    this.resetPokemonStates(opponent.pokemons);

    const attPokemon = this.findAttackingPokemon(
      [player, opponent],
      battleState.battleOrder,
    );
    attPokemon.moving = true;
    const selectedMove = this.selectMove(
      attPokemon.moves,
      attPokemon.battleStrategy ?? attPokemon.strategy,
    );
    let damage: IDamage;
    if (attPokemon.reload === 0) {
      const res = this.conductBattleRound(
        attPokemon,
        player._id.toString() === attPokemon.trainerId.toString()
          ? opponent.pokemons
          : player.pokemons,
        selectedMove,
      );
      damage = res.damage;
      const maxDamagedPokemon = res.maxDamagedPokemon;

      battleState.battleOrder = this.updatePostBattleStates(
        player,
        opponent,
        battleState.battleOrder,
        maxDamagedPokemon,
      );
      battleState.damageEvents.push({
        battleId: battleState._id,
        pokemonId: attPokemon._id,
        trainerId: attPokemon.trainerId,
        onPokemonId: maxDamagedPokemon._id,
        onTrainerId: maxDamagedPokemon.trainerId,
        value: damage.damage,
        ko: maxDamagedPokemon.currentHp === 0,
        critical: damage.critical,
        missed: damage.missed,
        moveId: damage.move._id,
        effectiveness: damage.effectiveness,
      });
    } else {
      attPokemon.reload -= 1;
      damage = {
        damage: 0,
        defPokemon: null,
        attPokemon,
        critical: false,
        info: BattleDamageInfo.RELOAD,
        move: null,
        missed: true,
        effectiveness: 'IMMUNE',
      };
    }
    battleState.damage = damage;
    return battleState;
  }

  public selectMove(moves: IMove[], strategy: number[]): IMove {
    if (
      !strategy ||
      strategy.length === 0 ||
      strategy.length !== moves.length
    ) {
      return getRandomFromArray(moves);
    }
    const randomValue = Math.random();
    const strategySum = strategy.reduce((acc, curr) => acc + curr, 0);
    strategy = strategy.map((value) => value / strategySum);
    let percentageSum = 0;
    for (let i = 0; i < strategy.length; i++) {
      percentageSum += strategy[i];
      if (randomValue < percentageSum) {
        return moves[i];
      }
    }
    return moves[0];
  }

  public getMaxDamagedPokemon(
    pokemons: IBattlePokemon[],
    move: IMove,
    selectedPokemon: IBattlePokemon,
  ): IBattlePokemon {
    const remainingPokemons = pokemons.filter(
      (pokemon) => pokemon.currentHp > 0,
    );
    if (remainingPokemons.length === 0) {
      throw new Error('No remaining pokemons');
    }
    return remainingPokemons.reduce((prev, current) => {
      return this.battleCalcService.estimator(selectedPokemon, prev, move) >
        this.battleCalcService.estimator(selectedPokemon, current, move)
        ? prev
        : current;
    });
  }

  public resetPokemonStates(pokemons: IBattlePokemon[]): void {
    pokemons.forEach((pokemon) => {
      pokemon.animation = undefined;
      pokemon.moving = false;
    });
  }

  public findAttackingPokemon(
    trainers: IBattleTrainer[],
    battleOrder: IBattlePokemon[],
  ): IBattlePokemon {
    if (!battleOrder[0]) {
      return;
    }
    const { trainerId, _id } = battleOrder[0];
    return trainers
      .find((trainer) => trainer._id.toString() === trainerId.toString())
      ?.pokemons.find((pokemon) => pokemon._id.toString() === _id.toString());
  }

  public conductBattleRound(
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

    if (damage && !damage.missed && damage.effectiveness !== 'IMMUNE') {
      attPokemon.animation = selectedMove.animation.player;
      maxDamagedPokemon.animation = selectedMove.animation.opponent;
      maxDamagedPokemon.currentHp = this.battleCalcService.damageOnPokemon(
        maxDamagedPokemon,
        damage,
      );
      if (selectedMove.sideEffect) {
        Object.keys(selectedMove.sideEffect).forEach((sideEffect) => {
          this.battleSideEffectService.SIDE_EFFECT_MAP[
            sideEffect as SideEffect
          ](
            selectedMove.sideEffect[sideEffect as SideEffect],
            attPokemon,
            maxDamagedPokemon,
            damage,
          );
        });
      }
    }

    return { damage, maxDamagedPokemon };
  }

  public updatePostBattleStates(
    player: IBattleTrainer,
    opponent: IBattleTrainer,
    battleOrder: IBattlePokemon[],
    maxDamagedPokemon: IBattlePokemon,
  ): IBattlePokemon[] {
    const koPokemonIds: string[] = [
      player.pokemons
        .filter((pokemon) => pokemon.currentHp === 0)
        .map((pokemon) => pokemon._id.toString()),
      opponent.pokemons
        .filter((pokemon) => pokemon.currentHp === 0)
        .map((pokemon) => pokemon._id.toString()),
    ].flat();
    battleOrder.shift();
    battleOrder = this.initBattleOrder(
      player,
      opponent,
      battleOrder.filter(
        (pokemon) =>
          maxDamagedPokemon.currentHp > 0 ||
          pokemon._id.toString() !== maxDamagedPokemon._id.toString() ||
          !koPokemonIds.includes(pokemon._id.toString()),
      ),
    );

    player.defeat = player.pokemons.every((pokemon) => pokemon.currentHp === 0);
    opponent.defeat = opponent.pokemons.every(
      (pokemon) => pokemon.currentHp === 0,
    );
    return battleOrder;
  }

  public async playNextRound(battleId: string, init?: boolean): Promise<void> {
    const battleState = await this.battleDataService.getBattleState(battleId);
    let newBattleState: IBattleState;
    let defeat = false;
    if (!init && battleState) {
      newBattleState = this.simulateBattleRound(battleState);
    } else {
      const battle =
        await this.coreInterfaceService.getBattleInstance(battleId);
      newBattleState = this.initBattle(battle);
      if (battle.winner) {
        if (battle.winner === 'player') {
          newBattleState.opponent.defeat = true;
        } else {
          newBattleState.player.defeat = true;
        }
      }
    }
    if (newBattleState.player.defeat || newBattleState.opponent.defeat) {
      defeat = true;
      const battle = {
        _id: battleId,
        winner: newBattleState.player.defeat ? 'opponent' : 'player',
      } as BattleInstanceBattle;
      this.coreInterfaceService.updateBattleInstance(battle);
    } else {
      await this.battleDataService.setBattleState(battleId, newBattleState);
    }
    newBattleState._id = battleId;
    this.battleWebsocketService.playRound(newBattleState);
    if (defeat) {
      const date = await this.coreInterfaceService.getBattleDate(battleId);
      const battle =
        await this.coreInterfaceService.getBattleInstance(battleId);
      this.battleEventsService.insertBattleEventsData(
        newBattleState.damageEvents,
        newBattleState.battleParticipationEvents,
        battle,
        date,
      );
      this.battleDataService.delete(battleId);
      this.battleWebsocketService.resetNextRoundStatus([
        newBattleState.player._id,
        newBattleState.opponent._id,
      ]);
    }
  }

  public async initTrainer(
    trainerId: string,
    battleId: string,
    gameId: string,
  ): Promise<void> {
    this.battleWebsocketService.addInitBattleStatus(trainerId);
    const playerIds = await this.getPlayerIds(battleId, gameId);
    if (await this.battleWebsocketService.getInitBattleReady(playerIds)) {
      await this.playNextRound(battleId, true);
      this.battleWebsocketService.deleteInitBattleStatus(playerIds);
    }
  }

  public async askNextRound(
    trainerId: string,
    battleId: string,
    gameId: string,
  ): Promise<void> {
    this.battleWebsocketService.addAskNextRound([trainerId], true);
    const playerIds = await this.getPlayerIds(battleId, gameId);
    if (await this.battleWebsocketService.getNextRoundStatus(playerIds)) {
      await this.playNextRound(battleId);
      this.battleWebsocketService.resetNextRoundStatus(playerIds);
    }
    this.battleWebsocketService.updateNextRoundStatus(playerIds);
  }

  public async deleteAskNextRound(
    trainerId: string,
    battleId: string,
    gameId: string,
  ): Promise<void> {
    const playerIds = await this.getPlayerIds(battleId, gameId);
    this.battleWebsocketService.addAskNextRound([trainerId], false);
    this.battleWebsocketService.updateNextRoundStatus(playerIds);
  }

  public async deleteAskNextRoundLoop(
    trainerId: string,
    battleId: string,
    gameId: string,
  ): Promise<void> {
    const playerIds = await this.getPlayerIds(battleId, gameId);
    this.battleWebsocketService.addAskNextRoundLoop([trainerId], false);
    this.battleWebsocketService.updateNextRoundStatus(playerIds);
  }

  public async askNextRoundLoop(
    trainerId: string,
    battleId: string,
    gameId: string,
  ): Promise<void> {
    this.battleWebsocketService.addAskNextRoundLoop([trainerId], true);
    const playerIds = await this.getPlayerIds(battleId, gameId);
    if (await this.battleWebsocketService.getNextRoundStatus(playerIds)) {
      if (await this.battleWebsocketService.getNextRoundLoopStatus(playerIds)) {
        await this.nextRoundLoop(battleId, playerIds, gameId);
      } else {
        await this.playNextRound(battleId);
        this.battleWebsocketService.resetNextRoundStatus(playerIds);
      }
    }
    this.battleWebsocketService.updateNextRoundStatus(playerIds);
  }

  public async nextRoundLoop(
    battleId: string,
    playerIds: string[],
    gameId: string,
  ): Promise<void> {
    this.battleWebsocketService.setLoopMode(playerIds);
    this.battleWebsocketService.updateNextRoundStatus(playerIds);
    await this.playNextRound(battleId);
    const interval = setInterval(async () => {
      if (
        !(await this.battleWebsocketService.getNextRoundLoopStatus(playerIds))
      ) {
        clearInterval(interval);
        await this.resetNextRoundStatus(battleId, gameId);
      } else {
        await this.playNextRound(battleId);
      }
    }, 4000);
  }

  public async resetNextRoundStatus(
    battleId: string,
    gameId: string,
  ): Promise<void> {
    const playerIds = await this.getPlayerIds(battleId, gameId);
    this.battleWebsocketService.resetNextRoundStatus(playerIds);
    this.battleWebsocketService.updateNextRoundStatus(playerIds);
  }

  public async getPlayerIds(
    battleId: string,
    gameId: string,
  ): Promise<string[]> {
    const battle = await this.coreInterfaceService.getBattleInstance(battleId);
    const game = await this.coreInterfaceService.getGame(gameId);
    return game.players
      .map((player) => player.trainer._id.toString())
      .filter(
        (id) =>
          id === battle.player._id.toString() ||
          id === battle.opponent._id.toString(),
      );
  }
}
