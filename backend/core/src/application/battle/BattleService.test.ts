import { Test, TestingModule } from '@nestjs/testing';
import BattleService from './BattleService';
import { BattleDataService } from './BattleDataService';
import { BattleEventsService } from '../BattleEvents/BattleEventsService';
import { IBattleInstance } from '../../domain/battleInstance/Battle';
import BattleTestMother from '../../test/domain/battle/BattleTestMother';
import { TrainerTestMother } from '../../test/domain/Trainer/TrainerTestMother';
import { getRandomValue } from '../../utils/RandomUtils';
import { ITrainer } from '../../domain/trainer/Trainer';
import BattleCalcService from './BattleCalcService';
import BattleInstanceRepository from '../../domain/battleInstance/BattleInstanceRepository';
import GameRepository from '../../domain/game/GameRepository';
import BattleSideEffectService from './BattleSideEffectService';
import BattleWebsocketService from '../../websocket/BattleWebsocketService';
import CalendarEventRepository from '../../domain/calendarEvent/CalendarEventRepository';
import DamageEventRepository from '../../domain/battleevents/damageevent/DamageEventRepository';
import BattleParticipationEventRepository from '../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository';
import PokemonRepository from '../../domain/pokemon/PokemonRepository';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import ColorService from '../color/ColorService';
import { StatsTestMother } from '../../test/domain/Stats/StatsTestMother';
import { IPokemonStats } from '../../models/PokemonModels/pokemonStats';
import { IMove } from '../../domain/move/Move';
import { MoveTestMother } from '../../test/domain/Move/MoveTestMother';
import { IBattlePokemon, IBattleTrainer } from './BattleInterfaces';
import BattlePokemonTestMother from '../../test/domain/battle/BattlePokemonTestMother';
import { PokemonType } from '../../models/Types/Types';
import BattleTrainerTestMother from '../../test/domain/battle/BattleTrainerTestMother';

jest.mock('../../websocket/BattleWebsocketService');

jest.mock('../../utils/RandomUtils', () => ({
  ...jest.requireActual('../../utils/RandomUtils'),
  getRandomValue: jest.fn(),
}));

const mockedGetRandomValue = getRandomValue as jest.MockedFunction<
  typeof getRandomValue
>;

describe('BattleService', () => {
  let battleService: BattleService;
  let battleMock: IBattleInstance;
  let battleDataService: BattleDataService;
  let battleEventsService: BattleEventsService;
  let battleWebsocketService: BattleWebsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleService,
        BattleDataService,
        BattleEventsService,
        BattleCalcService,
        BattleWebsocketService,
        { provide: BattleInstanceRepository, useValue: {} },
        { provide: GameRepository, useValue: {} },
        { provide: BattleSideEffectService, useValue: {} },
        { provide: CalendarEventRepository, useValue: {} },
        { provide: DamageEventRepository, useValue: {} },
        { provide: BattleParticipationEventRepository, useValue: {} },
        { provide: PokemonRepository, useValue: {} },
        { provide: TrainerRepository, useValue: {} },
        { provide: ColorService, useValue: {} },
      ],
    }).compile();

    battleService = module.get<BattleService>(BattleService);
    battleDataService = module.get<BattleDataService>(BattleDataService);
    battleWebsocketService = module.get<BattleWebsocketService>(
      BattleWebsocketService,
    );
    battleEventsService = module.get<BattleEventsService>(BattleEventsService);

    jest.clearAllMocks();
    jest.restoreAllMocks();

    battleMock = BattleTestMother.getBattleInstance();
  });

  describe('simulateBattle method', () => {
    it('should correctly simulate a battle scenario', async () => {
      jest
        .spyOn(battleEventsService, 'insertBattleEventsData')
        .mockResolvedValue();
      jest.spyOn(battleDataService, 'delete');
      const result = await battleService.simulateBattle(battleMock);
      expect(result).toBeDefined();
      expect(result.winner).toBeDefined();
      expect(result.winner).toMatch(/^(opponent|player)$/);
      expect(battleDataService.delete).toHaveBeenCalledWith(battleMock._id);
    });
  });

  describe('mapBattleTrainer method', () => {
    let trainer: ITrainer;
    let battleId: string;

    beforeEach(() => {
      trainer = TrainerTestMother.weakTrainer();
      battleId = 'battleId';
    });

    it('should return a trainer transformed into an instance of IBattleTrainer', () => {
      const result = battleService.mapBattleTrainer(trainer, battleId);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('_id', trainer._id.toString());
      expect(result).toHaveProperty('name', trainer.name);
      expect(result).toHaveProperty('class', trainer.class);
    });

    it('should initialize the defeat property to false', () => {
      const result = battleService.mapBattleTrainer(trainer, battleId);
      expect(result).toHaveProperty('defeat', false);
    });

    it("should transform trainer's pokemons to battle pokemons array", () => {
      const result = battleService.mapBattleTrainer(trainer, battleId);
      expect(result).toHaveProperty('pokemons', trainer.pokemons);
    });

    it('should filter pokemon with level 0 from battle pokemons array', () => {
      const result = battleService.mapBattleTrainer(trainer, battleId);
      expect(result).toHaveProperty('pokemons');
      expect(result.pokemons.every((pokemon) => pokemon.level > 0)).toEqual(
        true,
      );
    });
  });

  describe('getDailyForm', () => {
    beforeEach(() => {
      mockedGetRandomValue.mockReset();
    });

    it('should return 0 if getRandomValue < 0.5', () => {
      mockedGetRandomValue.mockReturnValue(0.4);
      const result = battleService.getDailyForm('battle1', 'pokemon1');
      expect(result).toBe(0);
    });

    it('should return 1 if 0.5 <= getRandomValue < 0.7', () => {
      mockedGetRandomValue.mockReturnValue(0.6);
      const result = battleService.getDailyForm('battle1', 'pokemon1');
      expect(result).toBe(1);
    });

    it('should return -1 if 0.7 <= getRandomValue < 0.9', () => {
      mockedGetRandomValue.mockReturnValue(0.8);
      const result = battleService.getDailyForm('battle1', 'pokemon1');
      expect(result).toBe(-1);
    });

    it('should return 2 if 0.9 <= getRandomValue < 0.95', () => {
      mockedGetRandomValue.mockReturnValue(0.93);
      const result = battleService.getDailyForm('battle1', 'pokemon1');
      expect(result).toBe(2);
    });

    it('should return -2 if getRandomValue >= 0.95', () => {
      mockedGetRandomValue.mockReturnValue(0.96);
      const result = battleService.getDailyForm('battle1', 'pokemon1');
      expect(result).toBe(-2);
    });
  });

  describe('setDailyForm method', () => {
    let dailyFormValue: number;
    let pokemonStats: {
      [key: string]: number;
    };

    beforeEach(() => {
      dailyFormValue = 1;
      pokemonStats = StatsTestMother.basicStats() as unknown as {
        [key: string]: number;
      };
    });

    it('should correctly update pokemon stats based on dailyForm value', () => {
      const resultStats: {
        [key: string]: number;
      } = battleService.setDailyForm(dailyFormValue, {
        ...pokemonStats,
      } as unknown as IPokemonStats) as unknown as {
        [key: string]: number;
      };
      expect(resultStats).toBeDefined();
      Object.keys(resultStats).forEach((key) => {
        expect(resultStats[key]).toEqual(
          pokemonStats[key] +
            Math.round((pokemonStats[key] * dailyFormValue) / 10),
        );
      });
    });

    it('should return the same stats if dailyForm value is 0', () => {
      dailyFormValue = 0;
      const resultStats: {
        [key: string]: number;
      } = battleService.setDailyForm(dailyFormValue, {
        ...pokemonStats,
      } as unknown as IPokemonStats) as unknown as {
        [key: string]: number;
      };
      expect(resultStats).toBeDefined();
      Object.keys(resultStats).forEach((key) => {
        expect(resultStats[key]).toEqual(pokemonStats[key]);
      });
    });
  });

  describe('BattleService selectMove method', () => {
    let moves: IMove[];
    let strategy: number[];

    beforeEach(() => {
      moves = [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()];
      strategy = [0.25, 0.75];
    });

    it('should select a move based on strategy probabilities', () => {
      const desiredMovesCount = [0, 0];
      const totalRuns = 100000;

      for (let i = 0; i < totalRuns; i++) {
        const selectedMove = battleService.selectMove(moves, strategy);
        desiredMovesCount[
          moves.findIndex((move) => move.id === selectedMove.id)
        ] += 1;
      }

      // We expect the move2 have twice the chance to be selected over the move1 and move3 since it has twice the value in the strategy array
      expect(desiredMovesCount[1]).toBeCloseTo(desiredMovesCount[0] * 3, -4);
    });

    it('should select a random move when no strategy is defined', () => {
      const selectedMove = battleService.selectMove(moves, undefined);
      expect(moves).toContain(selectedMove);
    });
  });

  describe('BattleService getMaxDamagedPokemon method', () => {
    let pokemons: IBattlePokemon[];
    let move: IMove;

    beforeEach(() => {
      pokemons = [
        { currentHp: 70, stats: { atk: 100, def: 50 } } as IBattlePokemon,
        { currentHp: 100, stats: { atk: 50, def: 100 } } as IBattlePokemon,
        { currentHp: 50, stats: { atk: 70, def: 70 } } as IBattlePokemon,
      ];
      pokemons = [
        BattlePokemonTestMother.withCustomOptions({
          currentHp: 70,
          stats: { atk: 100, def: 50, spAtk: 50, spDef: 50, spe: 50, hp: 70 },
        }),
        BattlePokemonTestMother.withCustomOptions({
          currentHp: 100,
          stats: { atk: 50, def: 100, spAtk: 50, spDef: 50, spe: 50, hp: 70 },
        }),
        BattlePokemonTestMother.withCustomOptions({
          currentHp: 50,
          stats: { atk: 70, def: 70, spAtk: 50, spDef: 50, spe: 50, hp: 70 },
        }),
      ];

      move = MoveTestMother.basicMove();
    });

    it('should return the pokemon which would get most damaged by a provided move', () => {
      const maxDamagedPokemon = battleService.getMaxDamagedPokemon(
        pokemons,
        move,
        pokemons[0],
      );

      expect(maxDamagedPokemon).toBeDefined();
      expect(maxDamagedPokemon.currentHp).toEqual(70);
    });

    it('should return not be null if all pokemons are immune to the move type', () => {
      pokemons.forEach((p) => (p.basePokemon.types = [PokemonType.FLYING]));
      move.type = PokemonType.GROUND;

      const maxDamagedPokemon = battleService.getMaxDamagedPokemon(
        pokemons,
        move,
        pokemons[0],
      );

      expect(maxDamagedPokemon).toBeDefined();
    });

    it('should return throw error if all pokemons have zero as currentHp', () => {
      pokemons.forEach((p) => (p.currentHp = 0));

      expect(() => {
        battleService.getMaxDamagedPokemon(pokemons, move, pokemons[0]);
      }).toThrowError('No remaining pokemons');
    });
  });

  describe('BattleService resetPokemonStates method', () => {
    let battlePokemons: IBattlePokemon[];

    beforeEach(() => {
      battlePokemons = [
        BattlePokemonTestMother.withCustomOptions({
          dailyForm: 1,
          currentHp: 80,
          cumulatedSpeed: 100,
          animation: 'fast',
          moving: true,
        }),
        BattlePokemonTestMother.withCustomOptions({
          dailyForm: -1,
          currentHp: 60,
          cumulatedSpeed: 200,
          animation: 'slow',
          moving: false,
        }),
      ];
    });

    it('should unset the animation and moving properties of provided pokemons', () => {
      battleService.resetPokemonStates(battlePokemons);
      expect(battlePokemons[0].animation).toBeUndefined();
      expect(battlePokemons[0].moving).toBe(false);
      expect(battlePokemons[1].animation).toBeUndefined();
      expect(battlePokemons[1].moving).toBe(false);
    });

    it('should not affect other properties of provided pokemons', () => {
      battleService.resetPokemonStates(battlePokemons);
      expect(battlePokemons[0].dailyForm).toBe(1);
      expect(battlePokemons[0].currentHp).toBe(80);
      expect(battlePokemons[0].cumulatedSpeed).toBe(100);
      expect(battlePokemons[1].dailyForm).toBe(-1);
      expect(battlePokemons[1].currentHp).toBe(60);
      expect(battlePokemons[1].cumulatedSpeed).toBe(200);
    });
  });

  describe('BattleService findAttackingPokemon method', () => {
    let pokemons: IBattlePokemon[];
    let trainers: IBattleTrainer[];
    let battleOrder: IBattlePokemon[];

    beforeEach(() => {
      pokemons = [
        BattlePokemonTestMother.withCustomOptions({
          cumulatedSpeed: 80,
          trainerId: 'trainer1',
          _id: 'pokemon0',
        }),
        BattlePokemonTestMother.withCustomOptions({
          cumulatedSpeed: 100,
          trainerId: 'trainer1',
          _id: 'pokemon1',
        }),
        BattlePokemonTestMother.withCustomOptions({
          cumulatedSpeed: 90,
          trainerId: 'trainer2',
          _id: 'pokemon2',
        }),
      ];
      trainers = [
        BattleTrainerTestMother.withCustomOptions({
          _id: 'trainer1',
          name: 'Ash',
          class: 'champion',
          pokemons: [pokemons[0], pokemons[1]],
          defeat: false,
        }),
        BattleTrainerTestMother.withCustomOptions({
          _id: 'trainer2',
          name: 'Brock',
          class: 'gym leader',
          pokemons: [pokemons[2]],
          defeat: false,
        }),
      ];
      battleOrder = [pokemons[1], pokemons[1]];
    });

    it("should return the pokemon with the greatest cumulated speed within both trainers' pokemons", () => {
      const attackingPokemon = battleService.findAttackingPokemon(
        trainers,
        battleOrder,
      );

      expect(attackingPokemon).toBeDefined();
      expect(attackingPokemon.cumulatedSpeed).toEqual(100);
    });

    it('should return undefined if there are no pokemon available in the battle order', () => {
      battleOrder = [];

      const attackingPokemon = battleService.findAttackingPokemon(
        trainers,
        battleOrder,
      );
      expect(attackingPokemon).toBeUndefined();
    });

    it("should return undefined if there are no pokemon within trainers' pokemons", () => {
      trainers = [
        BattleTrainerTestMother.withCustomOptions({
          _id: 'trainer1',
          name: 'Ash',
          class: 'champion',
          pokemons: [],
          defeat: false,
        }),
        BattleTrainerTestMother.withCustomOptions({
          _id: 'trainer2',
          name: 'Brock',
          class: 'gym leader',
          pokemons: [],
          defeat: false,
        }),
      ];

      const attackingPokemon = battleService.findAttackingPokemon(
        trainers,
        battleOrder,
      );
      expect(attackingPokemon).toBeUndefined();
    });
  });
  describe('conductBattleRound method', () => {
    let attPokemon: IBattlePokemon;
    let opponents: IBattlePokemon[];
    let selectedMove: IMove;

    beforeEach(() => {
      attPokemon = BattlePokemonTestMother.withCustomOptions({
        currentHp: 80,
        stats: { atk: 100, def: 50, spAtk: 76, spDef: 74, spe: 90, hp: 80 },
        moves: [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()],
      });
      opponents = [
        BattlePokemonTestMother.withCustomOptions({
          currentHp: 90,
          stats: { atk: 80, def: 70, spAtk: 95, spDef: 30, spe: 70, hp: 90 },
          moves: [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()],
        }),
        BattlePokemonTestMother.withCustomOptions({
          currentHp: 100,
          stats: { atk: 90, def: 96, spAtk: 80, spDef: 78, spe: 85, hp: 100 },
          moves: [MoveTestMother.basicMove(), MoveTestMother.powerfulMove()],
        }),
      ];
      selectedMove = MoveTestMother.powerfulMove();
    });

    it('should return an object containing damage and maxDamagedPokemon', () => {
      const { damage, maxDamagedPokemon } = battleService.conductBattleRound(
        attPokemon,
        opponents,
        selectedMove,
      );
      expect(damage).toBeDefined();
      expect(maxDamagedPokemon).toBeDefined();
    });

    it('should reduce the hp of maxDamagedPokemon according to the damage inflicted', () => {
      const initialHp = opponents[0]?.currentHp;
      const { damage, maxDamagedPokemon } = battleService.conductBattleRound(
        attPokemon,
        opponents,
        selectedMove,
      );
      expect(maxDamagedPokemon?.currentHp).toEqual(
        Math.max(initialHp - damage.damage, 0),
      );
    });

    it('should return null damage if the move missed', () => {
      selectedMove.accuracy = 0;
      const { damage, maxDamagedPokemon } = battleService.conductBattleRound(
        attPokemon,
        opponents,
        selectedMove,
      );
      expect(damage.damage).toBe(0);
      expect(damage.missed).toBe(true);
      expect(maxDamagedPokemon).toBeDefined();
    });
  });
  describe('BattleService initTrainer method', () => {
    let trainerId: string;
    let battleId: string;
    let gameId: string;
    let playerIds: string[];

    beforeEach(() => {
      jest.clearAllMocks();
      trainerId = 'trainer1';
      battleId = 'battle1';
      gameId = 'game1';
      playerIds = ['player1', 'player2'];
      jest.spyOn(battleService, 'getPlayerIds').mockResolvedValue(playerIds);
      jest.spyOn(battleService, 'playNextRound').mockResolvedValue();
    });

    it('should add trainer init battle status', () => {
      const spy = jest.spyOn(battleWebsocketService, 'addInitBattleStatus');
      battleService.initTrainer(trainerId, battleId, gameId);
      expect(spy).toHaveBeenCalledWith(trainerId);
    });

    it('should check if the battle is ready', async () => {
      const spyGetInitBattleReady = jest.spyOn(
        battleWebsocketService,
        'getInitBattleReady',
      );
      await battleService.initTrainer(trainerId, battleId, gameId);
      expect(spyGetInitBattleReady).toHaveBeenCalledWith(playerIds);
    });

    it('should play next round if the battle is ready', async () => {
      const spy = jest.spyOn(battleService, 'playNextRound');
      jest
        .spyOn(battleWebsocketService, 'getInitBattleReady')
        .mockReturnValueOnce(true);
      await battleService.initTrainer(trainerId, battleId, gameId);
      expect(spy).toHaveBeenCalledWith(battleId, true);
    });

    it('should not play next round if the battle is not ready', async () => {
      const spy = jest.spyOn(battleService, 'playNextRound');
      jest
        .spyOn(battleWebsocketService, 'getInitBattleReady')
        .mockReturnValueOnce(false);
      await battleService.initTrainer(trainerId, battleId, gameId);
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('BattleService askNextRound method', () => {
    let trainerId: string;
    let battleId: string;
    let gameId: string;
    let playerIds: string[];

    beforeEach(() => {
      jest.clearAllMocks();
      trainerId = 'trainer1';
      battleId = 'battle1';
      gameId = 'game1';
      playerIds = ['player1', 'player2'];
      jest.spyOn(battleService, 'getPlayerIds').mockResolvedValue(playerIds);
      jest.spyOn(battleService, 'playNextRound').mockResolvedValue();
    });

    it('should addAskNextRound', () => {
      const spy = jest.spyOn(battleWebsocketService, 'addAskNextRound');
      battleService.askNextRound(trainerId, battleId, gameId);
      expect(spy).toHaveBeenCalledWith([trainerId], true);
    });

    it('should check if the battle is ready', async () => {
      const spyGetInitBattleReady = jest.spyOn(
        battleWebsocketService,
        'getNextRoundStatus',
      );
      await battleService.askNextRound(trainerId, battleId, gameId);
      expect(spyGetInitBattleReady).toHaveBeenCalledWith(playerIds);
    });

    it('should play next round if the battle is ready', async () => {
      const spy = jest.spyOn(battleService, 'playNextRound');
      jest
        .spyOn(battleWebsocketService, 'getNextRoundStatus')
        .mockReturnValueOnce(true);
      await battleService.askNextRound(trainerId, battleId, gameId);
      expect(spy).toHaveBeenCalledWith(battleId);
    });

    it('should not play next round if the battle is not ready', async () => {
      const spy = jest.spyOn(battleService, 'playNextRound');
      jest
        .spyOn(battleWebsocketService, 'getNextRoundStatus')
        .mockReturnValueOnce(false);
      await battleService.askNextRound(trainerId, battleId, gameId);
      expect(spy).not.toHaveBeenCalled();
    });
  });
  describe('BattleService updatePostBattleStates method', () => {
    let player: IBattleTrainer;
    let opponent: IBattleTrainer;
    let battleOrder: IBattlePokemon[];
    let maxDamagedPokemon: IBattlePokemon;

    beforeEach(() => {
      player = BattleTrainerTestMother.withCustomOptions({
        _id: 'trainer1',
        name: 'Ash',
        class: 'champion',
        pokemons: [
          BattlePokemonTestMother.withCustomOptions({ currentHp: 50 }),
          BattlePokemonTestMother.withCustomOptions({ currentHp: 60 }),
        ],
        defeat: false,
      });
      opponent = BattleTrainerTestMother.withCustomOptions({
        _id: 'trainer2',
        name: 'Brock',
        class: 'gym leader',
        pokemons: [
          BattlePokemonTestMother.withCustomOptions({ currentHp: 40 }),
          BattlePokemonTestMother.withCustomOptions({ currentHp: 0 }),
        ],
        defeat: false,
      });
      battleOrder = [
        BattlePokemonTestMother.withCustomOptions({ currentHp: 100 }),
        BattlePokemonTestMother.withCustomOptions({ currentHp: 90 }),
      ];
      maxDamagedPokemon = BattlePokemonTestMother.withCustomOptions({
        currentHp: 20,
      });
    });

    it('should update battleOrder after a round', () => {
      const updatedBattleOrder = battleService.updatePostBattleStates(
        player,
        opponent,
        battleOrder,
        maxDamagedPokemon,
      );
      expect(updatedBattleOrder.length).toBeLessThanOrEqual(5);
      expect(updatedBattleOrder).not.toContainEqual(maxDamagedPokemon);
    });

    it('should set player defeat to true if all player pokemons have zero hp', () => {
      player.pokemons.forEach((p) => (p.currentHp = 0));
      battleService.updatePostBattleStates(
        player,
        opponent,
        battleOrder,
        maxDamagedPokemon,
      );
      expect(player.defeat).toBe(true);
    });

    it('should set opponent defeat to true if all opponent pokemons have zero hp', () => {
      opponent.pokemons.forEach((p) => (p.currentHp = 0));
      battleService.updatePostBattleStates(
        player,
        opponent,
        battleOrder,
        maxDamagedPokemon,
      );
      expect(opponent.defeat).toBe(true);
    });
  });
  describe('BattleService nextRoundLoop method', () => {
    let battleId: string;
    let playerIds: string[];
    let gameId: string;

    beforeEach(() => {
      jest.clearAllMocks();
      battleId = 'battle1';
      playerIds = ['player1', 'player2'];
      gameId = 'game1';
      jest.spyOn(battleService, 'playNextRound').mockResolvedValue();
      jest.spyOn(battleService, 'resetNextRoundStatus').mockResolvedValue();
    });

    it('should call playNextRound in intervals if loop mode is enabled', async () => {
      jest
        .spyOn(battleWebsocketService, 'getNextRoundLoopStatus')
        .mockReturnValue(true);

      const playNextRoundSpy = jest.spyOn(battleService, 'playNextRound');

      await battleService.nextRoundLoop(battleId, playerIds, gameId);

      expect(playNextRoundSpy).toHaveBeenCalled();
    });
  });
  describe('BattleService resetNextRoundStatus method', () => {
    let battleId: string;
    let gameId: string;
    let playerIds: string[];

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      battleId = 'battle1';
      gameId = 'game1';
      playerIds = ['player1', 'player2'];
      jest.spyOn(battleService, 'getPlayerIds').mockResolvedValue(playerIds);
    });

    it('should call resetNextRoundStatus on battleWebsocketService', async () => {
      const spy = jest.spyOn(battleWebsocketService, 'resetNextRoundStatus');
      await battleService.resetNextRoundStatus(battleId, gameId);
      expect(spy).toHaveBeenCalledWith(playerIds);
    });

    it('should call updateNextRoundStatus on battleWebsocketService', async () => {
      const spy = jest.spyOn(battleWebsocketService, 'updateNextRoundStatus');
      await battleService.resetNextRoundStatus(battleId, gameId);
      expect(spy).toHaveBeenCalledWith(playerIds);
    });
  });
});
