import { container } from "tsyringe";
import TournamentService from "./TournamentService";
import { ITrainer } from "../../../domain/trainer/Trainer";
import { TrainerTestMother } from "../../../test/domain/Trainer/TrainerTestMother";
import { ITournament } from "../../../domain/competiton/tournament/Tournament";
import TournamentTestMother from "../../../test/domain/competition/tournament/TournamentTestMother";

describe("TournamentService", () => {
  let tournamentService: TournamentService;
  let trainers: ITrainer[];
  let tournament: ITournament;

  beforeEach(() => {
    tournamentService = container.resolve(TournamentService);
    trainers = [
      TrainerTestMother.weakTrainer(),
      TrainerTestMother.strongTrainer(),
    ];

    tournament = TournamentTestMother.getTournament();
  });

  describe("generateTournamentPairs", () => {
    it("should generate pairs correctly for an even number of trainers", () => {
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

    it("should throw an error when the number of trainers is not a power of 2", () => {
      const trainers: ITrainer[] = [
        TrainerTestMother.weakTrainer(),
        TrainerTestMother.strongTrainer(),
        TrainerTestMother.strongTrainer(),
      ];

      expect(() => tournamentService.generateTournamentPairs(trainers)).toThrow(
        "La taille du tournoi doit être une puissance de 2.",
      );
    });
  });
  describe("TournamentService.addTournamentStep", () => {
    it("should successfully add a new tournament step", async () => {
      await tournamentService.addTournamentStep(trainers, tournament);
      expect(tournament.tournamentSteps.length).toBe(1);
    });

    it("should throw an error when maximum steps already added", async () => {
      await tournamentService.addTournamentStep(trainers, tournament);
      await tournamentService.addTournamentStep(trainers, tournament);
      try {
        await tournamentService.addTournamentStep(trainers, tournament);
        fail("expect exception to be thrown");
      } catch (error) {
        expect(error).toBe("Max step");
      }
    });
  });
});
