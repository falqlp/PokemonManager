import { IPokemon } from "../../api/pokemon/Pokemon";
import PokemonService from "../../api/pokemon/PokemonService";
import PcStorageService from "../../api/pcStorage/PcStorageService";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerClassRepository from "../../domain/trainerClass/TrainerClassRepository";
import { ITrainer } from "../../domain/trainer/Trainer";

class TrainerService {
  private static instance: TrainerService;

  public static getInstance(): TrainerService {
    if (!TrainerService.instance) {
      TrainerService.instance = new TrainerService(
        PokemonService.getInstance(),
        PcStorageService.getInstance(),
        TrainerRepository.getInstance(),
        TrainerClassRepository.getInstance()
      );
    }
    return TrainerService.instance;
  }
  constructor(
    protected pokemonService: PokemonService,
    protected pcStorageService: PcStorageService,
    protected trainerRepository: TrainerRepository,
    protected trainerClassRepository: TrainerClassRepository
  ) {}

  public async addPokemonForTrainer(pokemon: IPokemon, trainerId: string) {
    pokemon.trainerId = trainerId;
    await this.pokemonService.update(pokemon._id, pokemon);
    const trainer = await this.trainerRepository.getComplete(trainerId);
    if (trainer.pokemons.length < 6) {
      trainer.pokemons.push(pokemon._id);
    } else {
      trainer.pcStorage.maxSize;
      let freeIndex;
      for (let i = 0; i < trainer.pcStorage.maxSize; i++) {
        if (!trainer.pcStorage.storage.find((st) => st.position === i)) {
          trainer.pcStorage.storage.push({ pokemon, position: i });
          freeIndex = true;
          break;
        }
      }
      if (!freeIndex) {
        await this.pokemonService.delete(pokemon._id);
      } else {
        await this.pcStorageService.update(
          trainer.pcStorage._id,
          trainer.pcStorage
        );
      }
    }
    await this.trainerRepository.update(trainerId, trainer);
  }

  public async generateTrainer(gameId: string): Promise<ITrainer> {
    const nameAndClass = (
      await this.trainerClassRepository.generateTrainerName()
    )[0];
    const trainer: ITrainer = {
      gameId,
      name: nameAndClass.name,
      class: nameAndClass.class,
    } as ITrainer;
    return this.trainerRepository.create(trainer, gameId);
  }
}

export default TrainerService;
