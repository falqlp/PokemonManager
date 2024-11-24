import { Injectable } from '@nestjs/common';
import GameRepository from '../../domain/game/GameRepository';
import {
  CalendarEventEvent,
  ICalendarEvent,
} from '../../domain/calendarEvent/CalendarEvent';
import CalendarEventRepository from '../../domain/calendarEvent/CalendarEventRepository';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import { ITrainer } from '../../domain/trainer/Trainer';
import TrainerService from '../trainer/TrainerService';
import NurseryService from '../trainer/nursery/NurseryService';
import NurseryRepository from '../../domain/trainer/nursery/NurseryRepository';
import { IBattleInstance } from '../../domain/battleInstance/Battle';
import BattleService from '../battle/BattleService';
import { BattleInstanceService } from '../battleInstance/BattleInstanceService';
import { IGame } from '../../domain/game/Game';
import { addDays, addMonth, delay } from 'shared/utils';
import CompetitionService from '../competition/CompetitionService';
import TournamentService from '../competition/tournament/TournamentService';
import ExperienceService from '../experience/ExperienceService';
import TrainerMapper from '../../api/trainer/TrainerMapper';
import { NotificationType } from '../../websocket/WebsocketDataService';
import SimulateDayWebsocketService from '../../websocket/SimulateDayWebsocketService';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import PokemonService from '../pokemon/PokemonService';
import { NewSeasonService } from './NewSeasonService';

@Injectable()
export default class SimulateDayService {
  constructor(
    private readonly simulateDayWebsocketService: SimulateDayWebsocketService,
    private readonly websocketUtils: WebsocketUtils,
    private readonly gameRepository: GameRepository,
    private readonly calendarEventRepository: CalendarEventRepository,
    private readonly trainerRepository: TrainerRepository,
    private readonly trainerService: TrainerService,
    private readonly nurseryService: NurseryService,
    private readonly nurseryRepository: NurseryRepository,
    private readonly battleService: BattleService,
    private readonly battleInstanceService: BattleInstanceService,
    private readonly competitionService: CompetitionService,
    private readonly tournamentService: TournamentService,
    private readonly experienceService: ExperienceService,
    private readonly trainerMapper: TrainerMapper,
    private readonly pokemonService: PokemonService,
    private readonly newSeasonService: NewSeasonService,
  ) {}

  public async askSimulateDay(
    trainerId: string,
    gameId: string,
    date: Date,
  ): Promise<{
    battle: IBattleInstance;
    redirectTo: string;
    isMultiplayerBattle: boolean;
  }> {
    const game = await this.gameRepository.get(gameId);
    if (game.actualDate.toString() !== date.toString()) {
      throw new Error('Bad date');
    }
    const res = await this.canSimulate(trainerId, gameId, date);
    if (!res.battle && !res.redirectTo) {
      this.simulateDayWebsocketService.changeTrainerSimulateDayStatus(
        trainerId,
        game,
        true,
      );
      if (
        game.players.length ===
        this.simulateDayWebsocketService.getNextDayStatus(game)
      ) {
        this.simulateDayWebsocketService.simulating(gameId, true);
        this.startSimulation(game, date).then();
      }
    }
    return res;
  }

  private async startSimulation(game: IGame, date: Date): Promise<void> {
    while (
      game.players.length ===
        this.simulateDayWebsocketService.getNextDayStatus(game) &&
      (await this.canBeSimulated(game, date))
    ) {
      date = await this.simulateDay(game, date);
      await delay(1000);
    }
    this.simulateDayWebsocketService.simulating(game._id, false);
    game.players.forEach((player) => {
      this.simulateDayWebsocketService.changeTrainerSimulateDayStatus(
        player.trainer._id,
        game,
        false,
      );
    });
  }

  private async canBeSimulated(game: IGame, date: Date): Promise<boolean> {
    return !(
      await Promise.all(
        game.players.map(async (player): Promise<boolean> => {
          const res = await this.canSimulate(
            player.trainer._id,
            game._id,
            date,
          );
          return !!res.battle || !!res.redirectTo;
        }),
      )
    ).some((result) => result);
  }

  public async deleteAskNextDay(
    trainerId: string,
    gameId: string,
  ): Promise<void> {
    const game = await this.gameRepository.get(gameId);
    this.simulateDayWebsocketService.changeTrainerSimulateDayStatus(
      trainerId,
      game,
      false,
    );
  }

  public async updateAskNextDay(gameId: string): Promise<void> {
    if (gameId !== 'undefined') {
      const game = await this.gameRepository.get(gameId);
      this.simulateDayWebsocketService.updateSimulateStatus(game);
    }
  }

  public async canSimulate(
    trainerId: string,
    gameId: string,
    date: Date,
  ): Promise<{
    battle: IBattleInstance;
    redirectTo: string;
    isMultiplayerBattle: boolean;
  }> {
    let redirectTo: string = null;
    let isMultiplayerBattle: boolean = false;
    const events = await this.calendarEventRepository.list({
      custom: { trainers: trainerId, date },
    });
    const game = await this.gameRepository.get(gameId);
    const trainerIds = game.players
      .filter((player) => !!player.trainer)
      .map((player) => player.trainer._id.toString());
    const battle = events.find(
      (event) =>
        event.type === CalendarEventEvent.BATTLE && !event.event.winner,
    )?.event;
    if (!battle) {
      const nurseryEvent = events.find(
        (event) =>
          event.type === CalendarEventEvent.NURSERY_FIRST_SELECTION_DEADLINE ||
          event.type === CalendarEventEvent.NURSERY_LAST_SELECTION_DEADLINE ||
          event.type === CalendarEventEvent.GENERATE_NURSERY_EGGS,
      );
      if (nurseryEvent) {
        const trainer = await this.trainerRepository.get(trainerId);
        redirectTo = await this.nurseryEvents(
          nurseryEvent,
          trainer,
          addDays(date, 1),
          gameId,
          redirectTo,
        );
      }
    } else if (
      trainerIds.includes(battle.player._id.toString()) &&
      trainerIds.includes(battle.opponent._id.toString())
    ) {
      isMultiplayerBattle = true;
    }
    return { battle, redirectTo, isMultiplayerBattle };
  }

  public async nurseryEvents(
    nurseryEvent: ICalendarEvent,
    trainer: ITrainer,
    date: Date,
    game: string,
    redirectTo: string,
  ): Promise<string> {
    const nursery = trainer.nursery;
    switch (nurseryEvent.type) {
      case CalendarEventEvent.GENERATE_NURSERY_EGGS:
        if (nursery.eggs?.length === 0) {
          await this.nurseryService.generateNurseryEgg(nursery, game);
        }
        break;
      case CalendarEventEvent.NURSERY_FIRST_SELECTION_DEADLINE:
        if (nursery.eggs?.length > nursery.wishList.quantity * 2) {
          redirectTo = this.alertTrainerToSelectEggs(trainer);
        } else {
          nursery.step = 'LAST_SELECTION';
        }
        break;
      case CalendarEventEvent.NURSERY_LAST_SELECTION_DEADLINE:
        if (nursery.eggs?.length > nursery.wishList.quantity) {
          redirectTo = this.alertTrainerToSelectEggs(trainer);
        } else {
          nursery.eggs.forEach((egg) => {
            egg.hatchingDate = addMonth(date, 1);
            this.trainerService.addPokemonForTrainer(egg, trainer._id);
          });
          nursery.eggs = [];
          nursery.step = 'WISHLIST';
        }
        break;
      default:
        throw new Error('Unknown event: ' + nurseryEvent.type);
    }
    await this.nurseryRepository.update(nursery._id, nursery);
    return redirectTo;
  }

  private alertTrainerToSelectEggs(trainer: ITrainer): string {
    this.websocketUtils.notify(
      'SELECT_VALID_NUMBER_OF_EGGS',
      NotificationType.Neutral,
      trainer._id,
    );
    return 'nursery';
  }

  private async simulateDay(game: IGame, date: Date): Promise<Date> {
    await this.simulateBattleForDay(game, date);
    date = addDays(date, 1);
    game.actualDate = date;
    await this.gameRepository.update(game._id, game);
    await this.competitionService.championshipEnd(game._id, addDays(date, -1));
    await this.tournamentService.tournamentStepEnd(game._id, addDays(date, -1));
    if (date.getDay() === 1) {
      await this.experienceService.xpForOtherTrainer(game, date);
      for (const player of game.players) {
        let oldPlayer: ITrainer = await this.trainerRepository.get(
          player.trainer._id,
          { gameId: game._id },
        );
        const res = await this.experienceService.weeklyXpGain(
          player.trainer._id,
        );
        await this.trainerService.update(res.trainer);
        oldPlayer = this.trainerMapper.map(oldPlayer);
        res.trainer = this.trainerMapper.map(res.trainer);
        const weeklyXp = { ...res, oldPlayer };
        this.websocketUtils.sendMessageToTrainers([player.trainer._id], {
          type: 'weeklyXp',
          payload: weeklyXp,
        });
      }
    }
    if (date.getMonth() === 0 && date.getDate() === 1) {
      await this.newSeasonService.newSeason(game);
    }
    await this.pokemonService.isHatched(date, game._id);
    this.websocketUtils.updateGame(game._id.toString());
    return date;
  }

  private async simulateBattleForDay(game: IGame, date: Date): Promise<void> {
    const battles = await this.calendarEventRepository.list({
      custom: {
        gameId: game._id,
        date,
        'event.winner': { $exists: false },
        trainers: { $nin: game.players.map((player) => player.trainer._id) },
      },
    });
    const promises = battles.map(async (value) => {
      value.event = await this.battleService.simulateBattle(value.event, date);
      await this.battleInstanceService.update(value.event._id, value.event);
    });
    await Promise.all(promises);
  }
}
