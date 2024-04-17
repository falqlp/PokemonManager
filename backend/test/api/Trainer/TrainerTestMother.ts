import { ITrainer } from "../../../domain/trainer/Trainer";
import { PokemonTestMother } from "../pokemon/PokemonTestMother";
import { PcStorageTestMother } from "../PcStorage/PcStorageTestMother";
import { TrainingCampTestMother } from "../TrainingCamp/TrainingCampTestMother";
import { NurseryTestMother } from "../Nursery/NurseryTestMother";

export class TrainerTestMother {
  static weakTrainer(): ITrainer {
    return {
      name: "Ash Ketchum",
      pokemons: [PokemonTestMother.generateBulbasaur()],
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
      name: "red",
      pokemons: [
        PokemonTestMother.generateArticuno(),
        PokemonTestMother.generateBulbasaur(),
      ],
      pcStorage: PcStorageTestMother.filledPcStorage(),
      trainingCamp: TrainingCampTestMother.advencedTrainingCamp(),
    });
  }
}
