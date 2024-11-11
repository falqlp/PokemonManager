import { Test, TestingModule } from '@nestjs/testing';
import CompetitionService from './CompetitionService';
import CompetitionRepository from '../../domain/competiton/CompetitionRepository';
import { CompetitionType } from '../../domain/competiton/Competition';
import { IGame } from '../../domain/game/Game';
import { GameTestMother } from '../../test/domain/Game/GameTestMother';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import { ITrainer } from '../../domain/trainer/Trainer';
import { TrainerTestMother } from '../../test/domain/Trainer/TrainerTestMother';
import TournamentService from './tournament/TournamentService';
import TournamentTestMother from '../../test/domain/competition/tournament/TournamentTestMother';
import { BattleInstanceService } from '../battleInstance/BattleInstanceService';
import CompetitionTestMother from '../../test/domain/competition/CompetitionTestMother';
import GenerateCalendarService from '../calendarEvent/GenerateCalendarService';

jest.mock('../../domain/competiton/CompetitionRepository');
jest.mock('../../domain/trainer/TrainerRepository');
jest.mock('../competition/tournament/TournamentService');
jest.mock('../battleInstance/BattleInstanceService');
jest.mock('../calendarEvent/GenerateCalendarService');

describe('CompetitionService', () => {
  let competitionService: CompetitionService;
  let competitionRepository: jest.Mocked<CompetitionRepository>;
  let trainerRepository: jest.Mocked<TrainerRepository>;
  let tournamentService: jest.Mocked<TournamentService>;
  let battleInstanceService: jest.Mocked<BattleInstanceService>;
  let generateCalendarService: jest.Mocked<GenerateCalendarService>;
  let gameId: string;
  let game: IGame;
  let division: number;
  let trainers: ITrainer[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompetitionService,
        CompetitionRepository,
        TrainerRepository,
        TournamentService,
        BattleInstanceService,
        GenerateCalendarService,
      ],
    }).compile();

    competitionService = module.get<CompetitionService>(CompetitionService);
    competitionRepository = module.get(CompetitionRepository);
    trainerRepository = module.get(TrainerRepository);
    tournamentService = module.get(TournamentService);
    battleInstanceService = module.get(BattleInstanceService);
    generateCalendarService = module.get(GenerateCalendarService);

    gameId = 'gameId';
    game = GameTestMother.withCustomOptions({ _id: gameId });
    division = 3;
    trainers = [
      TrainerTestMother.weakTrainer(),
      TrainerTestMother.strongTrainer(),
    ];

    jest.clearAllMocks();
  });

  describe('createFriendly', () => {
    it('should create a friendly competition', async () => {
      competitionRepository.create.mockResolvedValue(null);
      await competitionService.createFriendly(gameId);

      expect(competitionRepository.create).toHaveBeenCalledTimes(1);
      expect(competitionRepository.create).toHaveBeenCalledWith({
        gameId,
        name: 'FRIENDLY',
        type: CompetitionType.FRIENDLY,
      });
    });
  });

  describe('createChampionship', () => {
    it('should create a championship competition', async () => {
      competitionRepository.create.mockResolvedValue(null);

      const startDate = new Date(game.actualDate);
      startDate.setUTCDate(startDate.getUTCDate() + 1);
      const endDate = new Date(game.actualDate);
      endDate.setUTCMonth(endDate.getUTCMonth() + 8);

      await competitionService.createChampionship(game, division);

      expect(competitionRepository.create).toHaveBeenCalledTimes(1);
      expect(competitionRepository.create).toHaveBeenCalledWith({
        gameId: game._id.toString(),
        name: 'CHAMPIONSHIP',
        type: CompetitionType.CHAMPIONSHIP,
        startDate,
        endDate,
        division,
      });
    });
  });

  describe('createTournament', () => {
    it('should create a tournament competition', async () => {
      competitionRepository.create.mockResolvedValue(null);
      trainerRepository.update.mockResolvedValue(null);
      tournamentService.createTournament.mockResolvedValue(
        TournamentTestMother.getTournament(),
      );

      const startDate = new Date(game.actualDate);
      startDate.setUTCDate(startDate.getUTCDate() + 1);

      const spyCompetitionRepository = jest
        .spyOn(competitionRepository, 'create')
        .mockResolvedValue(null);

      const spyTrainerRepository = jest
        .spyOn(trainerRepository, 'update')
        .mockResolvedValue(null);

      const spyTournamentService = jest
        .spyOn(tournamentService, 'createTournament')
        .mockResolvedValue(TournamentTestMother.getTournament());

      const name = 'TestTournament';

      await competitionService.createTournament(
        gameId,
        name,
        trainers,
        startDate,
        division,
      );

      expect(spyCompetitionRepository).toHaveBeenCalled();
      expect(spyCompetitionRepository).toHaveBeenCalledTimes(1);

      expect(spyTournamentService).toHaveBeenCalled();
      expect(spyTournamentService).toHaveBeenCalledTimes(1);

      expect(spyTrainerRepository).toHaveBeenCalled();
      expect(spyTrainerRepository).toHaveBeenCalledTimes(trainers.length);

      trainers.forEach((trainer, index) => {
        expect(spyTrainerRepository.mock.calls[index][0]).toBe(trainer._id);
        expect(spyTrainerRepository.mock.calls[index][1]).toBe(trainer);
      });

      expect(spyCompetitionRepository.mock.calls[0][0]).toMatchObject({
        gameId,
        name,
        startDate,
        division,
        type: CompetitionType.TOURNAMENT,
      });
    });
  });
  describe('championshipEnd', () => {
    it('should end a championship competition and create subsequent tournaments and group competition', async () => {
      const listSpy = jest
        .spyOn(competitionRepository, 'list')
        .mockResolvedValue([
          CompetitionTestMother.championshipWithCustomOptions({
            endDate: game.actualDate,
          }),
        ]);

      const getChampionshipRankingSpy = jest
        .spyOn(battleInstanceService, 'getChampionshipRanking')
        .mockResolvedValue([
          {
            _id: '1',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '2',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '3',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '4',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '5',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '6',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '7',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '8',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '9',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '10',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '11',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '12',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '13',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '14',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '15',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '16',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '17',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '18',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '19',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
          {
            _id: '20',
            losses: 0,
            wins: 0,
            winPercentage: 0,
            class: 'class',
            name: 'name',
            directWins: 0,
            ranking: 1,
          },
        ]);

      const listTrainersSpy = jest
        .spyOn(trainerRepository, 'list')
        .mockResolvedValue([
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
          TrainerTestMother.weakTrainer(),
        ]);

      const createTournamentSpy = jest.spyOn(
        competitionService,
        'createTournament',
      );
      const createGroupsCompetitionSpy = jest.spyOn(
        competitionService,
        'createGroupsCompetition',
      );
      jest
        .spyOn(competitionService, 'createTournament')
        .mockResolvedValue(null);
      jest
        .spyOn(competitionService, 'createGroupsCompetition')
        .mockResolvedValue(null);

      await competitionService.championshipEnd(gameId, game.actualDate);

      expect(listSpy).toHaveBeenCalled();
      expect(getChampionshipRankingSpy).toHaveBeenCalled();
      expect(listTrainersSpy).toHaveBeenCalledTimes(2);
      expect(createTournamentSpy).toHaveBeenCalled();
      expect(createGroupsCompetitionSpy).toHaveBeenCalled();
    });
  });
  describe('createGroupsCompetition', () => {
    it('should create a competition with type GROUPS', async () => {
      const startDate = new Date(game.actualDate);
      startDate.setUTCDate(startDate.getUTCDate() + 1);

      const endDate = new Date(game.actualDate);
      endDate.setUTCDate(endDate.getUTCDate() + 30);

      const spyCompetitionRepository = jest
        .spyOn(competitionRepository, 'create')
        .mockResolvedValue(null);

      const spyTrainerRepository = jest
        .spyOn(trainerRepository, 'updateManyDtos')
        .mockResolvedValue(null);

      const spyGenerateCalendarService = jest
        .spyOn(generateCalendarService, 'generateGroupMatches')
        .mockResolvedValue(null);

      await competitionService.createGroupsCompetition(
        gameId,
        'TestGroups',
        trainers,
        division,
        startDate,
        endDate,
      );

      expect(spyCompetitionRepository).toHaveBeenCalled();
      expect(spyCompetitionRepository).toHaveBeenCalledTimes(1);

      expect(spyTrainerRepository).toHaveBeenCalled();
      expect(spyTrainerRepository).toHaveBeenCalledWith(trainers);

      expect(spyGenerateCalendarService).toHaveBeenCalled();
      expect(spyGenerateCalendarService).toHaveBeenCalledTimes(1);

      expect(spyCompetitionRepository.mock.calls[0][0]).toMatchObject({
        gameId,
        type: CompetitionType.GROUPS,
        name: 'TestGroups',
        startDate,
        endDate,
        division,
      });
    });
  });
});
