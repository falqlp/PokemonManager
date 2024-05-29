import { ITrainer } from "../../../domain/trainer/Trainer";
import { PokemonTestMother } from "../pokemon/PokemonTestMother";
import { PcStorageTestMother } from "../PcStorage/PcStorageTestMother";
import { TrainingCampTestMother } from "../TrainingCamp/TrainingCampTestMother";
import { NurseryTestMother } from "../Nursery/NurseryTestMother";

export class TrainerTestMother {
  static weakTrainer(): ITrainer {
    return {
      name: "Ash Ketchum",
      _id: "Ash Ketchum",
      pokemons: [PokemonTestMother.generateBulbasaur("Ash Ketchum")],
      pcStorage: PcStorageTestMother.basicPcStorage(),
      trainingCamp: TrainingCampTestMother.basicTrainingCamp(),
      nursery: NurseryTestMother.basicNursery(),
    } as ITrainer;
  }

  static withCustomOptions(options: Partial<ITrainer>): ITrainer {
    const basicTrainer = this.weakTrainer();
    return {
      ...basicTrainer,
      ...options,
    } as ITrainer;
  }

  static strongTrainer(): ITrainer {
    return this.withCustomOptions({
      _id: "red",
      name: "red",
      pokemons: [
        PokemonTestMother.generateArticuno("red"),
        PokemonTestMother.generateBulbasaur("red"),
      ],
      pcStorage: PcStorageTestMother.filledPcStorage(),
      trainingCamp: TrainingCampTestMother.advencedTrainingCamp(),
    });
  }
}
