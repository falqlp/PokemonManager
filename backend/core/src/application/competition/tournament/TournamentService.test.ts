import { Test, TestingModule } from '@nestjs/testing';
import TournamentService from './TournamentService';
import { ITrainer } from '../../../domain/trainer/Trainer';
import { TrainerTestMother } from '../../../test/domain/Trainer/TrainerTestMother';
import {
  ITournament,
  ITournamentStep,
} from '../../../domain/competiton/tournament/Tournament';
import TournamentTestMother from '../../../test/domain/competition/tournament/TournamentTestMother';
import { SerieTypes } from '../../../domain/competiton/tournament/battleSerie/BattleSerie';
import { addDays } from 'shared/utils/DateUtils';
import TournamentStepTestMother from '../../../test/domain/competition/tournament/TournamentStepTestMother';
import TournamentRepository from '../../../domain/competiton/tournament/TournamentRepository';
import GenerateCalendarService from '../../calendarEvent/GenerateCalendarService';
import TrainerRepository from '../../../domain/trainer/TrainerRepository';
import BattleInstanceRepository from '../../../domain/battleInstance/BattleInstanceRepository';
import BattleSerieRepository from '../../../domain/competiton/tournament/battleSerie/BattleSerieRepository';
import { BattleInstanceService } from '../../battleInstance/BattleInstanceService';
import CalendarEventRepository from '../../../domain/calendarEvent/CalendarEventRepository';

jest.mock('../../battleInstance/BattleInstanceService');
jest.mock('../../../domain/competiton/tournament/TournamentRepository');
jest.mock('../../../domain/battleInstance/BattleInstanceRepository');
jest.mock('../../../domain/trainer/TrainerRepository');
jest.mock('../../../domain/calendarEvent/CalendarEventRepository');
jest.mock(
  '../../../domain/competiton/tournament/battleSerie/BattleSerieRepository',
);

describe('TournamentService', () => {
  let tournamentService: TournamentService;
  let trainers: ITrainer[];
  let tournament: ITournament;
  let midDate: Date;
  let gameId: string;
  let competitionId: string;
  const maxBattle: SerieTypes = SerieTypes.BO3;
  let actualDate: Date;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        GenerateCalendarService,
        BattleInstanceService,
        TournamentRepository,
        BattleInstanceRepository,
        BattleSerieRepository,
        TrainerRepository,
        CalendarEventRepository,
      ],
    }).compile();

    tournamentService = module.get<TournamentService>(TournamentService);

    jest.clearAllMocks();
    jest.restoreAllMocks();

    midDate = addDays(new Date(), 1);
    gameId = 'gameId';
    competitionId = 'some-competition-id';
    trainers = [
      TrainerTestMother.weakTrainer(),
      TrainerTestMother.strongTrainer(),
    ];

    tournament = TournamentTestMother.getTournament();
    actualDate = new Date();
  });

  describe('generateTournamentPairs', () => {
    it('should generate pairs correctly for an even number of trainers', () => {
      const trainers: ITrainer[] = [
        TrainerTestMother.weakTrainer(),
        TrainerTestMother.strongTrainer(),
      ];

      const pairs = tournamentService.generateTournamentPairs(trainers);

      expect(pairs.length).toBe(trainers.length / 2);

      pairs.forEach((pair, idx) => {
        expect(pair.player).toBe(trainers[idx]);
        expect(pair.opponent).toBe(trainers[trainers.length - idx - 1]);
      });
    });

    it('should throw an error when the number of trainers is not a power of 2', () => {
      const trainers: ITrainer[] = [
        TrainerTestMother.weakTrainer(),
        TrainerTestMother.strongTrainer(),
        TrainerTestMother.strongTrainer(),
      ];

      expect(() => tournamentService.generateTournamentPairs(trainers)).toThrow(
        'La taille du tournoi doit être une puissance de 2.',
      );
    });
  });

  describe('TournamentService.addTournamentStep', () => {
    beforeEach(() => {
      jest
        .spyOn(tournamentService, 'generateTournamentStep')
        .mockResolvedValue(TournamentStepTestMother.getTournamentStep());
      jest
        .spyOn(tournamentService.tournamentRepository, 'update')
        .mockResolvedValue(null);
    });

    it('should successfully add a new tournament step', async () => {
      await tournamentService.addTournamentStep(trainers, tournament);
      expect(tournament.tournamentSteps.length).toBe(2);
    });

    it('should throw an error when maximum steps already added', async () => {
      await tournamentService.addTournamentStep(trainers, tournament);
      await tournamentService.addTournamentStep(trainers, tournament);

      try {
        await tournamentService.addTournamentStep(trainers, tournament);
        fail('expect exception to be thrown');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('Max step');
        } else {
          fail(`Unexpected error type: ${typeof error}`);
        }
      }
    });
  });

  describe('generateTournamentStep', () => {
    let tournamentStep: ITournamentStep;

    beforeEach(async () => {
      jest
        .spyOn(tournamentService.battleInstanceRepository, 'insertMany')
        .mockResolvedValue(null);
      jest
        .spyOn(tournamentService.battleSerieRepository, 'insertMany')
        .mockResolvedValue(null);
      jest
        .spyOn(tournamentService.calendarEventRepository, 'insertMany')
        .mockResolvedValue(null);

      tournamentStep = await tournamentService.generateTournamentStep(
        trainers,
        midDate,
        gameId,
        competitionId,
        maxBattle,
      );
    });

    it('should generate a tournament step correctly', () => {
      expect(tournamentStep).toBeTruthy();
      expect(tournamentStep.endDate).toEqual(addDays(midDate, 7));
      expect(tournamentStep.battleSeries.length).toBe(trainers.length / 2);
    });

    it('should create a battle series for each pair of trainers', () => {
      tournamentStep.battleSeries.forEach((battleSerie, idx) => {
        expect(battleSerie.player).toBe(trainers[idx]);
        expect(battleSerie.opponent).toBe(trainers[trainers.length - idx - 1]);
        expect(battleSerie.battles.length).toBe(maxBattle);
      });
    });

    it('should throw an error when the overall number of trainers is not a power of 2', async () => {
      const trainers: ITrainer[] = [
        TrainerTestMother.weakTrainer(),
        TrainerTestMother.strongTrainer(),
        TrainerTestMother.strongTrainer(),
      ];

      try {
        await tournamentService.generateTournamentStep(
          trainers,
          midDate,
          gameId,
          competitionId,
          maxBattle,
        );
        fail('expected exception to be thrown');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe(
            'La taille du tournoi doit être une puissance de 2.',
          );
        } else {
          fail(`Unexpected error type: ${typeof error}`);
        }
      }
    });
  });

  describe('TournamentService.tournamentStepEnd', () => {
    beforeEach(() => {
      jest
        .spyOn(tournamentService.tournamentRepository, 'getUpdateTournaments')
        .mockResolvedValue([tournament]);
      jest
        .spyOn(tournamentService.battleInstanceService, 'isSerieWin')
        .mockReturnValue('id');
      jest
        .spyOn(tournamentService.trainerRepository, 'list')
        .mockResolvedValue(trainers);
      jest
        .spyOn(tournamentService, 'addTournamentStep')
        .mockResolvedValue(null);
    });

    it('should call TournamentService.addTournamentStep when there are tournament steps left', async () => {
      await tournamentService.tournamentStepEnd(gameId, actualDate);

      expect(tournamentService.addTournamentStep).toHaveBeenCalledWith(
        trainers,
        tournament,
      );
    });

    it('should not call TournamentService.addTournamentStep when no tournament steps left', async () => {
      tournament.nbStep = tournament.tournamentSteps.length;

      await tournamentService.tournamentStepEnd(gameId, actualDate);

      expect(tournamentService.addTournamentStep).not.toHaveBeenCalled();
    });

    it('should throw an error when there is a problem with the database', async () => {
      jest
        .spyOn(tournamentService.tournamentRepository, 'getUpdateTournaments')
        .mockRejectedValue(new Error('DB error'));

      try {
        await tournamentService.tournamentStepEnd(gameId, actualDate);
        fail('expect exception to be thrown');
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toBe('DB error');
        } else {
          fail(`Unexpected error type: ${typeof error}`);
        }
      }
    });
  });

  describe('TournamentService - createTournament()', () => {
    let tournamentStep: ITournamentStep;

    beforeEach(() => {
      tournamentStep = TournamentStepTestMother.getTournamentStep();
      jest
        .spyOn(tournamentService, 'generateTournamentStep')
        .mockResolvedValue(tournamentStep);
    });

    it('should call the createTournament method correctly', async () => {
      const mockCreateTournament = jest.fn();
      tournamentService.tournamentRepository.create = mockCreateTournament;

      const expectedTournament: ITournament = {
        nbStep: 2,
        tournamentSteps: [tournamentStep],
        gameId: 'gameId',
        competitionId: 'compId',
      };

      await tournamentService.createTournament(
        trainers,
        expectedTournament.nbStep,
        new Date(),
        expectedTournament.gameId,
        expectedTournament.competitionId,
      );

      expect(mockCreateTournament).toHaveBeenCalledWith(expectedTournament);
    });

    it('should throw an error when number of trainers is not power of 2', async () => {
      const invalidTrainers: ITrainer[] = [
        TrainerTestMother.weakTrainer(),
        TrainerTestMother.strongTrainer(),
        TrainerTestMother.strongTrainer(),
      ];

      await expect(() =>
        tournamentService.createTournament(
          invalidTrainers,
          2,
          new Date(),
          'gameId',
          'compId',
        ),
      ).rejects.toThrow('La taille du tournoi doit être une puissance de 2.');
    });
  });
});
