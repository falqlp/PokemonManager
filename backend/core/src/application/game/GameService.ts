import { IGame, IPlayer } from '../../domain/game/Game';
import GameRepository from '../../domain/game/GameRepository';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import TrainerService from '../trainer/TrainerService';
import GenerateCalendarService from '../calendarEvent/GenerateCalendarService';
import { Injectable } from '@nestjs/common';
import CompetitionService from '../competition/CompetitionService';
import { mongoId } from 'shared/utils/MongoUtils';
import { ITrainer } from '../../domain/trainer/Trainer';
import UserRepository from '../../domain/user/UserRepository';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import { ICompetition } from '../../domain/competiton/Competition';
import {
  NB_DIVISION,
  NB_GENERATED_TRAINER_BY_DIVISION,
  START_DIVISION,
} from './GameConst';
import { BattleEventsService } from '../BattleEvents/BattleEventsService';
import { UserService } from '../user/UserService';
import PokemonRepository from '../../domain/pokemon/PokemonRepository';
import BattleInstanceRepository from '../../domain/battleInstance/BattleInstanceRepository';
import CalendarEventRepository from '../../domain/calendarEvent/CalendarEventRepository';
import CompetitionRepository from '../../domain/competiton/CompetitionRepository';
import CompetitionHistoryRepository from '../../domain/competiton/competitionHistory/CompetitionHistoryRepository';
import TournamentRepository from '../../domain/competiton/tournament/TournamentRepository';

@Injectable()
class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly trainerRepository: TrainerRepository,
    private readonly trainerService: TrainerService,
    private readonly generateCalendarService: GenerateCalendarService,
    private readonly competitionService: CompetitionService,
    private readonly userRepository: UserRepository,
    private readonly websocketUtils: WebsocketUtils,
    private readonly battleEventsService: BattleEventsService,
    private readonly userService: UserService,
    private readonly pokemonRepository: PokemonRepository,
    private readonly battleInstanceRepository: BattleInstanceRepository,
    private readonly calendarEventRepository: CalendarEventRepository,
    private readonly competitionRepository: CompetitionRepository,
    private readonly competitionHistoryRepository: CompetitionHistoryRepository,
    private readonly tournamentRepository: TournamentRepository,
  ) {}

  public async createWithUsers(
    players: IPlayer[],
    name: string,
  ): Promise<IGame> {
    const gameId = mongoId();
    const trainer: ITrainer = { ...players.at(0).trainer, gameId };
    players.at(0).trainer = await this.trainerService.create(trainer);
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getUTCFullYear();
    const actualDate = new Date(Date.UTC(currentYear, 0, 1));
    const newGame = await this.gameRepository.create({
      _id: gameId,
      players,
      name,
      actualDate,
    });
    this.userRepository
      .updateMany(
        { _id: { $in: players.map((player) => player.userId) } },
        { $push: { games: newGame._id } },
      )
      .then();
    if (newGame.players.length === 1) {
      setTimeout(() => {
        this.initGame(newGame).then();
      }, 500);
    }
    return newGame;
  }

  public async initGame(game: IGame): Promise<void> {
    this.websocketUtils.sendMessageToClientInGame(game._id, {
      type: 'initGame',
      payload: {
        key: 'TRAINER_GENERATION',
      },
    });
    await this.competitionService.createFriendly(game._id);

    const championships: ICompetition[] = [];
    const nbGeneratedTrainerByDivision: number[] = [];
    for (let i = 1; i <= NB_DIVISION; i++) {
      championships.push(
        await this.competitionService.createChampionship(game, i),
      );
      if (i === START_DIVISION) {
        nbGeneratedTrainerByDivision.push(
          NB_GENERATED_TRAINER_BY_DIVISION - game.players.length,
        );
      } else {
        nbGeneratedTrainerByDivision.push(NB_GENERATED_TRAINER_BY_DIVISION);
      }
    }

    await this.trainerRepository.updateManyTrainer(
      {
        _id: {
          $in: game.players.map((player) => player.trainer._id.toString()),
        },
      },
      {
        $push: { competitions: championships[START_DIVISION - 1] },
        division: START_DIVISION,
      },
    );

    await this.trainerService.generateTrainerWithPokemonByDivision(
      game,
      nbGeneratedTrainerByDivision,
      championships,
    );

    const trainers = await this.trainerRepository.list(
      {},
      { gameId: game._id },
    );

    const trainersByDivision: ITrainer[][] =
      this.trainerService.getTrainersByDivision(trainers);

    this.websocketUtils.sendMessageToClientInGame(game._id, {
      type: 'initGame',
      payload: {
        key: 'CALENDAR_GENERATION',
      },
    });
    await this.generateCalendarService.generateChampionships(
      trainersByDivision,
      3,
      game._id,
      championships,
    );
    this.websocketUtils.sendMessageToClientInGame(game._id, {
      type: 'initGameEnd',
    });
  }

  public async initIfNot(gameId: string): Promise<void> {
    const trainers = await this.trainerRepository.list({ custom: { gameId } });
    if (trainers.length !== NB_GENERATED_TRAINER_BY_DIVISION * NB_DIVISION) {
      const game = await this.gameRepository.get(gameId);
      await this.initGame(game);
    }
  }

  public async addPlayerToGame(game: IGame, userId: string): Promise<ITrainer> {
    let initGame = false;
    if (!game.players.some((player) => !player.trainer)) {
      initGame = true;
    }
    const index = game.players.findIndex(
      (gamePlayer) => gamePlayer.userId === userId,
    );
    if (index !== -1) {
      game.players[index].trainer = await this.trainerService.create({
        ...game.players[index].trainer,
        gameId: game._id,
      });
    } else {
      throw new Error('Player not found');
    }
    await this.gameRepository.update(game._id, game);
    if (initGame) {
      setTimeout(() => {
        this.initGame(game).then();
      }, 500);
    }
    return game.players[index].trainer;
  }

  public async deleteGameForUser(
    gameId: string,
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository.get(userId);
    const game = await this.gameRepository.get(gameId);
    if (user && game) {
      game.players = game.players.filter(
        (player) => player.userId.toString() !== userId,
      );
      user.games = user.games.filter(
        (userGame) => userGame._id.toString() !== gameId,
      );
      if (game.players.length === 0) {
        await this.deleteGame(gameId);
      } else {
        await this.gameRepository.update(gameId, game);
      }
      await this.userRepository.update(userId, user);
    }
  }

  public async deleteGame(gameId: string): Promise<void> {
    await this.gameRepository.delete(gameId);
    await this.userService.deleteGameForUsers(gameId);
    await this.trainerService.deleteInGame(gameId);
    await this.pokemonRepository.deleteMany({ gameId });
    await this.battleInstanceRepository.deleteMany({ gameId });
    await this.calendarEventRepository.deleteMany({ gameId });
    await this.competitionRepository.deleteMany({ gameId });
    await this.competitionHistoryRepository.deleteMany({ gameId });
    await this.tournamentRepository.deleteMany({ gameId });
    this.battleEventsService.deleteAllBattleParticipationsForGame(gameId);
    this.battleEventsService.deleteDamageEventsForGame(gameId);
  }
}

export default GameService;
