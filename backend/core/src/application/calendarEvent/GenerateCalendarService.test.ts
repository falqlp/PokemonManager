import { Test, TestingModule } from '@nestjs/testing';
import GenerateCalendarService from './GenerateCalendarService';
import { ITrainer } from '../../domain/trainer/Trainer';
import { ICompetition } from '../../domain/competiton/Competition';
import { TrainerTestMother } from '../../test/domain/Trainer/TrainerTestMother';
import BattleInstanceRepository from '../../domain/battleInstance/BattleInstanceRepository';
import CalendarEventRepository from '../../domain/calendarEvent/CalendarEventRepository';

jest.mock('../../domain/battleInstance/BattleInstanceRepository');
jest.mock('../../domain/calendarEvent/CalendarEventRepository');

describe('GenerateCalendarService', () => {
  let service: GenerateCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenerateCalendarService,
        BattleInstanceRepository,
        CalendarEventRepository,
      ],
    }).compile();

    service = module.get<GenerateCalendarService>(GenerateCalendarService);

    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('generateChampionships method', () => {
    it('should generate a championship for each division', async () => {
      const trainersByDivision: ITrainer[][] = [
        [TrainerTestMother.strongTrainer()],
        [TrainerTestMother.weakTrainer()],
      ];
      const nbFaceEachOther = 3;
      const gameId = 'gameId';
      const championships: ICompetition[] = [
        { _id: 'champ1', division: 1 } as ICompetition,
        { _id: 'champ3', division: 3 } as ICompetition,
      ];

      const generateChampionshipSpy = jest
        .spyOn(service, 'generateChampionship')
        .mockResolvedValue(undefined);

      await service.generateChampionships(
        trainersByDivision,
        nbFaceEachOther,
        gameId,
        championships,
      );

      expect(generateChampionshipSpy).toHaveBeenCalledTimes(
        championships.length,
      );
      expect(generateChampionshipSpy).toHaveBeenCalledWith(
        trainersByDivision[0],
        nbFaceEachOther,
        gameId,
        championships[0],
      );
      expect(generateChampionshipSpy).toHaveBeenCalledWith(
        trainersByDivision[1],
        nbFaceEachOther,
        gameId,
        championships[1],
      );
    });

    it('should not call generateChampionship if championships are empty', async () => {
      const trainersByDivision: ITrainer[][] = [];
      const nbFaceEachOther = 3;
      const gameId = 'gameId';
      const championships: ICompetition[] = [];

      const generateChampionshipSpy = jest
        .spyOn(service, 'generateChampionship')
        .mockResolvedValue(undefined);

      await service.generateChampionships(
        trainersByDivision,
        nbFaceEachOther,
        gameId,
        championships,
      );

      expect(generateChampionshipSpy).not.toHaveBeenCalled();
    });
  });
});
