import { IGame } from "../../domain/game/Game";
import User from "../../domain/user/User";
import GameRepository from "../../domain/game/GameRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerService from "../trainer/TrainerService";
import GenerateCalendarService from "../calendarEvent/GenerateCalendarService";
import WebsocketServerService from "../../WebsocketServerService";
import { singleton } from "tsyringe";
import CompetitionRepository from "../../domain/competiton/CompetitionRepository";
import { CompetitionType } from "../../domain/competiton/Competition";
import PokemonService from "../pokemon/PokemonService";

export const NB_GENERATED_TRAINER = 19;

@singleton()
class GameService {
  constructor(
    protected gameRepository: GameRepository,
    protected trainerRepository: TrainerRepository,
    protected trainerService: TrainerService,
    protected generateCalendarService: GenerateCalendarService,
    protected websocketServerService: WebsocketServerService,
    protected competitionRepository: CompetitionRepository,
    protected pokemonService: PokemonService,
  ) {}

  public async createWithUser(dto: IGame, userId: string): Promise<IGame> {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getUTCFullYear();
    dto.actualDate = new Date(Date.UTC(currentYear, 0, 1));
    const player = dto.player;
    dto.player = undefined;
    let newGame = await this.gameRepository.create(dto);
    player.gameId = newGame._id;
    newGame.player = await this.trainerService.create(player);
    newGame = await this.gameRepository.update(newGame._id, newGame);
    User.findByIdAndUpdate(userId, { $push: { games: newGame._id } }).then(); //TODO a refactor
    return newGame;
  }

  public async initGame(gameId: string, playerId: string): Promise<void> {
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGame",
      payload: {
        key: "TRAINER_GENERATION",
      },
    });
    const game = await this.gameRepository.get(gameId);
    await this.competitionRepository.create({
      gameId,
      name: "FRIENDLY",
      type: CompetitionType.FRIENDLY,
    });
    const startDate = new Date(game.actualDate);
    const endDate = new Date(game.actualDate);
    startDate.setUTCDate(startDate.getUTCDate() + 1);
    endDate.setUTCMonth(endDate.getUTCMonth() + 6);
    const championship = await this.competitionRepository.create({
      gameId,
      name: "CHAMPIONSHIP",
      type: CompetitionType.CHAMPIONSHIP,
      endDate,
      startDate,
    });
    await this.trainerRepository.findOneAndUpdate(
      { _id: playerId },
      { $push: { competitions: championship } },
    );
    const generatedTrainers = await this.trainerService.generateTrainers(
      gameId,
      championship,
      NB_GENERATED_TRAINER,
    );
    const res = await this.trainerService.generateTrainersPokemons(
      gameId,
      generatedTrainers,
      { max: 4, min: 2 },
      { max: 8, min: 3 },
    );
    await this.pokemonService.createPokemons(res.pokemons, gameId);
    await this.trainerService.createMany(res.trainers);
    const trainers = await this.trainerRepository.list({}, { gameId });
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGame",
      payload: {
        key: "CALENDAR_GENERATION",
      },
    });
    await this.generateCalendarService.generateChampionship(
      trainers,
      3,
      gameId,
      championship,
    );
    this.websocketServerService.sendMessageToClientInGame(gameId, {
      type: "initGameEnd",
    });
  }
}

export default GameService;
