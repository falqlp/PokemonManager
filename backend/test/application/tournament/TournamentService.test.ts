import { container } from "tsyringe";
import TournamentService from "../../../application/competition/tournament/TournamentService";
import { ITrainer } from "../../../domain/trainer/Trainer";
import { TrainerTestMother } from "../../api/Trainer/TrainerTestMother";

describe("TournamentService", () => {
  let tournamentService: TournamentService;

  beforeEach(() => {
    tournamentService = container.resolve(TournamentService);
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
});
